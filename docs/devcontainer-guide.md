# Devcontainer Guide

## Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install the devcontainer CLI:

```bash
npm install -g @devcontainers/cli
```

## Build and start the container

From the project root:

```bash
devcontainer up --workspace-folder .
```

On first run, this builds the Docker image, installs dependencies (`npm install`), and initializes the firewall. The first build takes a few minutes. Subsequent runs reuse the existing container.

## Open a bash shell inside the running container

```bash
devcontainer exec --workspace-folder . bash
```

## Start the Next.js dev server (accessible at localhost:3000)

```bash
devcontainer exec --workspace-folder . npm run dev
```

## Stop the container

```bash
docker stop $(docker ps -q --filter "label=devcontainer.local_folder=$(pwd)")
```

## Rebuild the container from scratch (use after Dockerfile or devcontainer.json changes)

```bash
devcontainer up --workspace-folder . --remove-existing-container --build-no-cache
```

## Re-initialize the firewall rules without rebuilding the container

```bash
devcontainer exec --workspace-folder . sudo /usr/local/bin/init-firewall.sh
```

## Claude Code in the devcontainer

The entire `~/.claude` directory is bind-mounted from the host, so settings, hooks, and plugins are shared.

### Authentication

Claude Code inside the container authenticates via **OAuth** (`claude login`), not API keys. The Claude Pro/Max subscription and the API (platform.claude.com) are separate billing systems — a Pro subscription does not include API credits.

On first use inside the container, run:

```bash
claude login
```

The OAuth token is stored in `~/.claude/credentials.json` via the bind mount, so it persists across container and machine restarts.

**Do not** set `ANTHROPIC_API_KEY` in `.env` for local development — it conflicts with the OAuth token and requires separate prepaid API credits.

### Plugins

Plugins installed on the host are available inside the container. The `fix-claude-paths.sh` script runs automatically on container start and rewrites macOS absolute paths (`/Users/<user>/...`) to container paths (`/home/node/...`) in the plugin registry.

To install a new plugin, run `/plugin install <name>` inside the container or on the host — both write to the same `~/.claude` directory.
