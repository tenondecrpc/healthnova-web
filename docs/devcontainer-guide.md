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
