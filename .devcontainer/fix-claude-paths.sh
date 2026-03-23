#!/bin/bash
# Fix macOS absolute paths in Claude Code plugin registry for Linux container.
# Rewrites /Users/<user>/... → /home/node/... and project paths → /workspace.

PLUGINS_JSON="/home/node/.claude/plugins/installed_plugins.json"
KNOWN_MARKETPLACES="/home/node/.claude/plugins/known_marketplaces.json"

if [ ! -f "$PLUGINS_JSON" ]; then
  exit 0
fi

# Detect the macOS home directory from existing paths
MAC_HOME=$(grep -oP '"/Users/[^/]+' "$PLUGINS_JSON" | head -1 | tr -d '"')

# Also try known_marketplaces.json as fallback source
if [ -z "$MAC_HOME" ] && [ -f "$KNOWN_MARKETPLACES" ]; then
  MAC_HOME=$(grep -oP '"/Users/[^/]+' "$KNOWN_MARKETPLACES" | head -1 | tr -d '"')
fi

if [ -z "$MAC_HOME" ]; then
  exit 0
fi

sed -i "s|${MAC_HOME}/.claude|/home/node/.claude|g" "$PLUGINS_JSON"
sed -i "s|${MAC_HOME}/Projects/[^\"]*|/workspace|g" "$PLUGINS_JSON"

# Fix marketplace paths (known_marketplaces.json also stores absolute host paths)
if [ -f "$KNOWN_MARKETPLACES" ]; then
  sed -i "s|${MAC_HOME}/.claude|/home/node/.claude|g" "$KNOWN_MARKETPLACES"
fi
