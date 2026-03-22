#!/bin/bash
# Fix macOS absolute paths in Claude Code plugin registry for Linux container.
# Rewrites /Users/<user>/... → /home/node/... and project paths → /workspace.

PLUGINS_JSON="/home/node/.claude/plugins/installed_plugins.json"

if [ ! -f "$PLUGINS_JSON" ]; then
  exit 0
fi

# Detect the macOS home directory from existing paths
MAC_HOME=$(grep -oP '"/Users/[^/]+' "$PLUGINS_JSON" | head -1 | tr -d '"')

if [ -z "$MAC_HOME" ]; then
  exit 0
fi

sed -i "s|${MAC_HOME}/.claude|/home/node/.claude|g" "$PLUGINS_JSON"
sed -i "s|${MAC_HOME}/Projects/[^\"]*|/workspace|g" "$PLUGINS_JSON"
