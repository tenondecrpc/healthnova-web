#!/usr/bin/env bash
set -euo pipefail

# Approved domains for HealthNova development
APPROVED_DOMAINS=(
  # npm / Node.js
  "registry.npmjs.org"
  "nodejs.org"
  # GitHub
  "github.com"
  "api.github.com"
  "raw.githubusercontent.com"
  # Claude / Anthropic
  "api.anthropic.com"
  "claude.ai"
  "statsig.anthropic.com"
  "statsig.com"
  "sentry.io"
  # AWS — Auth & Identity
  "cognito-idp.us-east-1.amazonaws.com"
  "cognito-identity.us-east-1.amazonaws.com"
  "sts.amazonaws.com"
  # AWS — Hosting & Storage
  "amplify.us-east-1.amazonaws.com"
  "s3.amazonaws.com"
  "s3.us-east-1.amazonaws.com"
  # AWS — Serverless Compute
  "lambda.us-east-1.amazonaws.com"
  "states.us-east-1.amazonaws.com"
  # AWS — Data
  "dynamodb.us-east-1.amazonaws.com"
  "glue.us-east-1.amazonaws.com"
  # AWS — Integration & Messaging
  "sqs.us-east-1.amazonaws.com"
  "sns.us-east-1.amazonaws.com"
  "events.us-east-1.amazonaws.com"
  "execute-api.us-east-1.amazonaws.com"
  "apigateway.us-east-1.amazonaws.com"
  # AWS — Observability
  "logs.us-east-1.amazonaws.com"
  "monitoring.us-east-1.amazonaws.com"
  "xray.us-east-1.amazonaws.com"
  # AWS — Secrets & Config
  "secretsmanager.us-east-1.amazonaws.com"
  "ssm.us-east-1.amazonaws.com"
  # Google Fonts
  "fonts.googleapis.com"
  "fonts.gstatic.com"
  # VS Code extensions
  "marketplace.visualstudio.com"
  "vscode.blob.core.windows.net"
  "update.code.visualstudio.com"
  # Bun runtime (required by claude-mem plugin)
  "bun.sh"
  # uv / astral (Python package manager, used by claude-mem for Chroma vector DB)
  "astral.sh"
)

echo "Initializing firewall..."

# Create ipset for approved IPs
ipset create approved_ips hash:ip -exist
ipset flush approved_ips

# Resolve a domain to IPs using multiple methods for better coverage
resolve_domain() {
  local domain="$1"
  {
    dig +short "$domain" A 2>/dev/null
    dig +short "$domain" AAAA 2>/dev/null
    getent ahosts "$domain" 2>/dev/null | awk '{print $1}'
    # Follow CNAMEs one level deep (common with CDNs)
    local cname
    cname=$(dig +short "$domain" CNAME 2>/dev/null | head -1)
    if [ -n "$cname" ]; then
      dig +short "$cname" A 2>/dev/null
    fi
  } | grep -E '^[0-9]+\.' | sort -u || true
}

# Resolve approved domains and add to ipset
for domain in "${APPROVED_DOMAINS[@]}"; do
  ips=$(resolve_domain "$domain")
  for ip in $ips; do
    ipset add approved_ips "$ip" -exist
  done
done

# Add GitHub meta IPs
gh_ips=$(curl -s https://api.github.com/meta 2>/dev/null | jq -r '.git[],.web[],.api[]' 2>/dev/null || true)
for cidr in $gh_ips; do
  # Only add individual IPs, skip CIDRs for ipset hash:ip
  if [[ "$cidr" != *"/"* ]]; then
    ipset add approved_ips "$cidr" -exist
  fi
done

# Detect host/gateway for local network access
gateway=$(ip route | grep default | awk '{print $3}' || true)
local_subnet=$(ip route | grep -v default | grep src | awk '{print $1}' | head -1 || true)

# Load conntrack module for stateful packet inspection
modprobe nf_conntrack 2>/dev/null || true

# Set up iptables
iptables -F OUTPUT 2>/dev/null || true

# Allow loopback
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections (conntrack-based)
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow responses to incoming connections (dev server, HMR websocket)
iptables -A OUTPUT -p tcp --sport 3000 -j ACCEPT

# Allow DNS
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT

# Allow local network (for dev server, hot reload, etc.)
if [ -n "$local_subnet" ]; then
  iptables -A OUTPUT -d "$local_subnet" -j ACCEPT
fi
if [ -n "$gateway" ]; then
  iptables -A OUTPUT -d "$gateway" -j ACCEPT
fi

# Allow approved IPs
iptables -A OUTPUT -m set --match-set approved_ips dst -j ACCEPT

# Default: drop outbound
iptables -P OUTPUT DROP

echo "Firewall initialized. Approved ${#APPROVED_DOMAINS[@]} domains."

# Verify connectivity — retry with fresh DNS if first attempt fails
verify_and_fix() {
  local domain="$1"
  # Use --head and ignore HTTP status — we only care about network/TLS reachability
  if curl -so /dev/null --max-time 5 "https://${domain}" 2>/dev/null; then
    return 0
  fi
  # Connection failed — the CDN likely returned a different IP.
  # Re-resolve and add any new IPs, then retry.
  echo "  Re-resolving ${domain}..."
  local ips
  ips=$(resolve_domain "$domain")
  for ip in $ips; do
    ipset add approved_ips "$ip" -exist
  done
  curl -so /dev/null --max-time 5 "https://${domain}" 2>/dev/null
}

if verify_and_fix "api.anthropic.com"; then
  echo "Verified: Anthropic API reachable"
else
  echo "Warning: Anthropic API not reachable — check firewall rules"
fi
