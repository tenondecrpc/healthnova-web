# claude-mem - Installation and Troubleshooting Guide

## What is claude-mem

Persistent memory plugin for Claude Code that preserves context between sessions. Uses a local worker (Bun + ChromaDB) to store observations, sessions, and prompts.

- Repo: https://github.com/thedotmack/claude-mem
- Installed version: 10.6.2
- Scope: project (healthnova-web)

## Installation

```bash
# 1. Add marketplace
/plugin marketplace add thedotmack/claude-mem

# 2. Install plugin
/plugin install claude-mem

# 3. Reload plugins
/reload-plugins

# Update to latest version
/plugin update claude-mem
```

On install, the `smart-install.js` hook auto-installs:

- **Bun** (JS runtime) at `~/.bun/bin/bun`
- **uv** (Python package manager) for ChromaDB
- Plugin dependencies via `bun install`

## File Structure

```
~/.claude/plugins/
├── installed_plugins.json
├── cache/thedotmack/claude-mem/10.6.2/
│   ├── .mcp.json
│   ├── hooks/hooks.json
│   ├── scripts/
│   │   ├── bun-runner.js
│   │   ├── smart-install.js
│   │   ├── worker-service.cjs
│   │   ├── worker-wrapper.cjs
│   │   ├── worker-cli.js
│   │   ├── mcp-server.cjs
│   │   └── context-generator.cjs
│   └── skills/
│       ├── mem-search/
│       ├── timeline-report/
│       ├── make-plan/
│       ├── do/
│       └── smart-explore/
└── data/claude-mem-thedotmack/

~/.claude-mem/
├── settings.json
├── supervisor.json
└── logs/
```

## Configuration (~/.claude-mem/settings.json)

Main options:

| Variable                        | Default             | Description                            |
| ------------------------------- | ------------------- | -------------------------------------- |
| `CLAUDE_MEM_MODEL`              | `claude-sonnet-4-5` | AI model for processing                |
| `CLAUDE_MEM_WORKER_PORT`        | `37777`             | Worker HTTP port                       |
| `CLAUDE_MEM_WORKER_HOST`        | `127.0.0.1`         | Worker host                            |
| `CLAUDE_MEM_PROVIDER`           | `claude`            | AI provider (claude/gemini/openrouter) |
| `CLAUDE_MEM_CLAUDE_AUTH_METHOD` | `cli`               | Authentication method                  |
| `CLAUDE_MEM_DATA_DIR`           | `~/.claude-mem`     | Data directory                         |
| `CLAUDE_MEM_LOG_LEVEL`          | `INFO`              | Log level                              |
| `CLAUDE_MEM_CHROMA_ENABLED`     | `true`              | ChromaDB enabled                       |
| `CLAUDE_MEM_CHROMA_PORT`        | `8000`              | ChromaDB port                          |

## Registered Hooks

The plugin registers hooks at these stages:

| Hook                 | Action                                      |
| -------------------- | ------------------------------------------- |
| **Setup**            | Runs `setup.sh` (does not exist in v10.6.2) |
| **SessionStart**     | smart-install, worker start, context hook   |
| **UserPromptSubmit** | session-init hook                           |
| **PostToolUse**      | observation hook (saves what Claude does)   |
| **Stop**             | summarize hook                              |
| **SessionEnd**       | session-complete hook                       |

## Available Skills

- `/claude-mem:mem-search` - Search persistent memory
- `/claude-mem:timeline-report` - Narrative history report
- `/claude-mem:make-plan` - Create implementation plan
- `/claude-mem:do` - Execute plan with subagents
- `/claude-mem:smart-explore` - Structural search with tree-sitter

## Available MCP Tools

- `search` - Search observations by query/filters
- `get_observations` - Get full details by IDs
- `timeline` - Temporal context around a point
- `smart_search` - Intelligent search
- `smart_outline` - Code outline
- `smart_unfold` - Unfold code details

## Known Bug: Hardcoded \_\_dirname (Issue #1433)

### Symptoms

- Worker starts and `/health` responds OK
- All other endpoints return: `"Database is still initializing, please retry"` indefinitely
- Log shows: `"Background initialization failed Critical: code.json mode file missing"`

### Root Cause

`worker-service.cjs` contains 3 hardcoded paths from the original developer:

```
Line 7472:  var __dirname = "/Users/alexnewman/conductor/.../src/shared"
Line 43681: var __dirname = "/Users/alexnewman/conductor/.../src/services/server"
Line 68282: var __dirname = "/Users/alexnewman/conductor/.../src/services"
```

The dynamic fallback (`import.meta.url`) never executes because `typeof __dirname !== "undefined"` is always true.

### Fix

Patch all 3 lines to `undefined` to activate the fallback:

```bash
FILE="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.2/scripts/worker-service.cjs"

# Backup
cp "$FILE" "$FILE.bak"

# Patch line 7472
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/shared"|var __dirname = undefined|' \
  "$FILE"

# Patch line 43681
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services/server"|var __dirname = undefined|' \
  "$FILE"

# Patch line 68282
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services", __filename = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services/worker-service.ts"|var __dirname = undefined, __filename = undefined|' \
  "$FILE"
```

### Verification

```bash
# Confirm all 3 lines were patched
grep -n 'var __dirname' "$FILE"
# Should show: undefined on all 3 lines

# Start worker
PATH="$HOME/.bun/bin:$PATH" \
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.2" \
nohup bun "$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.2/scripts/worker-wrapper.cjs" > /dev/null 2>&1 &

# Wait 8 seconds and verify
sleep 8
curl -s http://127.0.0.1:37777/health
# Should return: {"status":"ok",...}

curl -s "http://127.0.0.1:37777/api/search?query=test&limit=5"
# Should return results or "No results found" (NOT "Database is still initializing")
```

## Secondary Issue: Worker Does Not Auto-Start

The hooks run `bun-runner.js` with `node`, which looks for `bun` in PATH and at `~/.bun/bin/bun`. If Bun was just installed and the terminal hasn't been restarted, the hook silently fails with `"Failed to start worker"`.

### Temporary Solution

Start manually:

```bash
PATH="$HOME/.bun/bin:$PATH" \
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.2" \
nohup bun "$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.2/scripts/worker-wrapper.cjs" > /dev/null 2>&1 &
```

### Permanent Solution

Ensure `~/.bun/bin` is in PATH in `.zshrc` / `.bashrc`:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

## Devcontainer Isolation

The devcontainer mounts only `~/.claude/settings.json`, `~/.claude/settings.local.json`, and `~/.claude/credentials.json` — NOT the full `~/.claude/` directory. This prevents the container's `installed_plugins.json` (with `/home/node/` paths) from overwriting the host's (with `/Users/...` paths).

Plugins must be installed separately in each environment:

- **Mac local:** `/plugin install claude-mem`
- **Devcontainer:** `/plugin install claude-mem` (after container creation)

## Important Notes

- The patch is lost if the plugin is updated (`/plugin update claude-mem`) — it must be reapplied
- Issue #1433 documents the bug: https://github.com/thedotmack/claude-mem/issues/1433
- The worker API is GET at `/api/search?query=<text>&limit=<n>` (not POST, not `q=`)
- The supervisor stores the worker PID in `~/.claude-mem/supervisor.json`
- Daily logs at `~/.claude-mem/logs/claude-mem-YYYY-MM-DD.log`
