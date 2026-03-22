# Devcontainer vs Docker Compose vs Alternatives

Comparison of container-based development strategies and rationale for the approach chosen in HealthNova Web.

## What HealthNova Web uses

A **Dev Container** (`.devcontainer/`) with:

- A standalone `Dockerfile` (node:22-slim + tooling)
- A `devcontainer.json` that configures the workspace, ports, mounts, extensions, and lifecycle hooks
- A firewall script (`init-firewall.sh`) that restricts outbound traffic to approved domains via iptables/ipset

No `docker-compose.yml` is involved. The container runs standalone because this project has no local infrastructure dependencies — the backend, database, and auth services are all remote (AWS).

---

## Comparison

### 1. Dev Container (current approach)

**What it is**: An open specification (devcontainers.io) that defines a reproducible development environment inside a container. Supported natively by VS Code, GitHub Codespaces, and any tool implementing the spec via the `devcontainer` CLI.

**How it works here**:

```
devcontainer up --workspace-folder .   # build + start
devcontainer exec --workspace-folder . bash  # shell into container
```

**Advantages**:

- **Single container, zero orchestration**: No services to coordinate — the project only needs Node.js, CLI tools, and network access to remote APIs.
- **IDE integration**: VS Code (and Codespaces) auto-detects `.devcontainer/`, installs extensions, applies settings, and opens a ready-to-code workspace.
- **Lifecycle hooks**: `postCreateCommand` (npm install) and `postStartCommand` (firewall init) run automatically — no manual setup steps after cloning.
- **Credential forwarding**: Bind-mounts for `~/.claude` (settings + credentials only) and `~/.aws` share host credentials without baking secrets into the image. Plugins are isolated per environment to avoid path conflicts between host and container.
- **Portable**: Works identically on macOS (Docker Desktop), Linux, and in cloud environments (Codespaces, DevPod).
- **Spec-driven**: The `devcontainer.json` format is an open standard, not tied to a single vendor.

**Limitations**:

- Single-container by design (though it can reference a `docker-compose.yml` if needed).
- Requires Docker Desktop (or a compatible runtime like Podman/Colima) on the host.
- Network firewall rules require `NET_ADMIN` / `NET_RAW` capabilities — some corporate environments may restrict this.

---

### 2. Docker Compose

**What it is**: A tool for defining and running multi-container Docker applications via a `docker-compose.yml` file.

**When it makes sense**:

- The project needs **local infrastructure**: databases, message queues, caches, mock APIs.
- You want to orchestrate multiple services (e.g., frontend + backend + db) in a single `docker compose up`.

**Why it was not chosen for HealthNova Web**:

- **No local services to orchestrate**: The backend, Cognito, DynamoDB, S3 — everything lives in AWS. There is nothing to compose.
- **No IDE integration**: Docker Compose starts containers but does not configure the editor, install extensions, or forward credentials. You would need a separate setup layer.
- **More ceremony**: Requires a `docker-compose.yml` even for a single container. Lifecycle hooks (npm install, firewall init) would need to be wired via `command:` or entrypoint scripts.
- **Credential management is manual**: No built-in equivalent to devcontainer's bind-mount declarations for `~/.aws`, `~/.claude`, etc.

**When to reconsider**: If HealthNova later needs local services (e.g., a local DynamoDB for offline testing, or a mock auth server), Docker Compose could be introduced _alongside_ the devcontainer — `devcontainer.json` supports a `dockerComposeFile` property that lets both coexist.

---

### 3. Plain Dockerfile (manual `docker run`)

**What it is**: Build an image with `docker build`, run it with `docker run`, mount volumes manually.

```bash
docker build -t healthnova-dev .devcontainer/
docker run -it --cap-add=NET_ADMIN -p 3000:3000 \
  -v $(pwd):/workspace \
  -v ~/.aws:/home/node/.aws \
  -v ~/.claude/settings.json:/home/node/.claude/settings.json \
  -v ~/.claude/credentials.json:/home/node/.claude/credentials.json \
  healthnova-dev
```

**Advantages**:

- No dependency on the devcontainer CLI or VS Code.
- Full control over every flag.

**Disadvantages**:

- **No reproducibility guarantee**: Each developer writes their own `docker run` incantation. Port mappings, volume mounts, and capabilities drift.
- **No IDE integration**: Extensions, settings, and formatOnSave must be configured separately by each developer.
- **Lifecycle hooks are manual**: npm install and firewall init must be run by the developer after starting the container.
- **The devcontainer approach already provides this as a fallback**: The Dockerfile is standalone and can be used with plain Docker if needed.

---

### 4. Nix / Devbox / asdf

**What it is**: Host-level environment managers that install specific versions of tools (Node, AWS CLI, etc.) without containers.

**Advantages**:

- No Docker required.
- Near-native performance (no container overhead).
- Fine-grained per-tool version pinning.

**Disadvantages**:

- **No network isolation**: The firewall-based security boundary (approved domains only) is not possible without containers or OS-level configuration.
- **OS-dependent edge cases**: "Works on my Mac" problems with system libraries, especially for native modules.
- **No built-in IDE integration**: Extensions and settings must be managed separately.

**Verdict**: Not viable for this project because the network firewall is a hard requirement. The container boundary is what makes outbound traffic control possible.

---

### 5. GitHub Codespaces / Cloud Dev Environments

**What it is**: A cloud-hosted VM that runs the devcontainer in GitHub's infrastructure.

**Relationship to the current setup**: Codespaces reads the same `.devcontainer/` configuration. The current setup is **already Codespaces-compatible** with no additional work.

**Advantages**:

- No local Docker needed.
- Consistent compute regardless of developer hardware.
- Pre-built images can eliminate cold-start time.

**Disadvantages**:

- Cost (billed per hour of compute + storage).
- Network latency for file operations.
- Firewall script may behave differently in Codespaces networking (needs testing).

---

## Decision summary

| Criterion                   | Devcontainer | Docker Compose | Plain Docker | Nix/Devbox | Codespaces |
| --------------------------- | :----------: | :------------: | :----------: | :--------: | :--------: |
| Zero local services needed  |      ++      |       --       |      +       |     +      |     ++     |
| IDE integration             |      ++      |       --       |      --      |     --     |     ++     |
| Network firewall            |      ++      |       +        |      +       |     --     |     ?      |
| Reproducible setup          |      ++      |       +        |      --      |     +      |     ++     |
| No Docker dependency        |      --      |       --       |      --      |     ++     |     ++     |
| Multi-service orchestration |      --      |       ++       |      --      |     --     |     --     |

**HealthNova Web** is a frontend-only project that consumes remote AWS services. It needs a reproducible environment with IDE integration and network isolation, but has no local services to orchestrate. The devcontainer is the minimal, correct tool for this.

If multi-service orchestration becomes necessary, Docker Compose can be integrated into the existing devcontainer setup without replacing it.
