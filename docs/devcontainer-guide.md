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

What each flag does:

- `--remove-existing-container` — stops and deletes the current container before starting a new one
- `--build-no-cache` — forces Docker to rebuild the image from scratch, ignoring cached layers

Use this when you change `Dockerfile`, `devcontainer.json`, or `init-firewall.sh`. Without `--build-no-cache`, Docker reuses cached layers and your changes may not take effect.

Without `--build-no-cache` (faster, reuses image — use when only config changed, not Dockerfile):

```bash
devcontainer up --workspace-folder . --remove-existing-container
```

Your data is safe: the workspace (`/workspace`), shell history (volume), and Claude credentials (`~/.claude` bind mount) are all preserved across rebuilds.

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

#### Troubleshooting: auth conflict warning

If Claude shows this on startup:

```
⚠ Auth conflict: Both a token (claude.ai) and an API key (ANTHROPIC_API_KEY) are set.
```

It means `ANTHROPIC_API_KEY` is present in the container environment. The most common cause is a **stale container** built before the variable was removed from `.env` or `devcontainer.json` — the old environment is baked into the running container.

**Permanent fix — rebuild the container from scratch:**

```bash
devcontainer up --workspace-folder . --remove-existing-container
```

This discards the old container (including its stale env vars) and creates a clean one. The OAuth token in `~/.claude/credentials.json` is preserved via the bind mount, so no re-login is needed.

If the conflict persists after a rebuild, the variable is still being injected somewhere. Check the host shell profiles:

```bash
grep -r ANTHROPIC_API_KEY ~/.zshrc ~/.bashrc ~/.zprofile ~/.profile ~/.zshenv 2>/dev/null
```

**Fix for the current session only** (without rebuilding):

```bash
unset ANTHROPIC_API_KEY
claude
```

To find the source permanently, check where it's being set on the host:

```bash
grep -r ANTHROPIC_API_KEY ~/.zshrc ~/.bashrc ~/.zprofile ~/.profile ~/.zshenv 2>/dev/null
```

Remove or comment it out from whichever file exports it. The OAuth token already handles auth — `ANTHROPIC_API_KEY` is not needed.

#### Troubleshooting: /login interrupted immediately

If you open the container with `devcontainer exec --workspace-folder . bash` (without `--`) and `/login` exits immediately without showing a URL, the issue is a missing TTY. Use:

```bash
devcontainer exec --workspace-folder . -- bash
```

The `--` separator ensures a proper interactive terminal is allocated.

### Plugins

Plugins installed on the host are available inside the container. The `fix-claude-paths.sh` script runs automatically on container start and rewrites macOS absolute paths (`/Users/<user>/...`) to container paths (`/home/node/...`) in the plugin registry.

To install a new plugin, run `/plugin install <name>` inside the container or on the host — both write to the same `~/.claude` directory.
