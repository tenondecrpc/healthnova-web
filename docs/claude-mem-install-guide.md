# claude-mem - Guia de Instalacion y Troubleshooting

## Que es claude-mem

Plugin de memoria persistente para Claude Code que preserva contexto entre sesiones. Usa un worker local (Bun + ChromaDB) para almacenar observaciones, sesiones y prompts.

- Repo: https://github.com/thedotmack/claude-mem
- Version instalada: 10.6.1
- Scope: project (healthnova-web)

## Instalacion

```bash
# 1. Agregar marketplace
/plugin marketplace add thedotmack/claude-mem

# 2. Instalar plugin
/plugin install claude-mem

# 3. Recargar plugins
/reload-plugins
```

Al instalar, el hook `smart-install.js` auto-instala:
- **Bun** (runtime JS) en `~/.bun/bin/bun`
- **uv** (package manager Python) para ChromaDB
- Dependencias del plugin via `bun install`

## Estructura de archivos

```
~/.claude/plugins/
├── installed_plugins.json          # Registro de plugins instalados
├── cache/thedotmack/claude-mem/10.6.1/  # Plugin cacheado
│   ├── .mcp.json                   # Config MCP server
│   ├── hooks/hooks.json            # Hooks del plugin
│   ├── scripts/
│   │   ├── bun-runner.js           # Wrapper para encontrar bun
│   │   ├── smart-install.js        # Auto-instalador de dependencias
│   │   ├── worker-service.cjs      # Worker principal (bundleado)
│   │   ├── worker-wrapper.cjs      # Wrapper del worker daemon
│   │   ├── worker-cli.js           # CLI para start/stop/restart/status
│   │   ├── mcp-server.cjs          # Servidor MCP para search
│   │   └── context-generator.cjs   # Generador de contexto
│   └── skills/                     # Skills disponibles
│       ├── mem-search/
│       ├── timeline-report/
│       ├── make-plan/
│       ├── do/
│       └── smart-explore/
└── data/claude-mem-thedotmack/     # Datos del plugin

~/.claude-mem/
├── settings.json       # Configuracion principal
├── supervisor.json     # Estado del worker (PID, etc)
└── logs/               # Logs diarios
```

## Configuracion (~/.claude-mem/settings.json)

Principales opciones:

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `CLAUDE_MEM_MODEL` | `claude-sonnet-4-5` | Modelo AI para procesamiento |
| `CLAUDE_MEM_WORKER_PORT` | `37777` | Puerto del worker HTTP |
| `CLAUDE_MEM_WORKER_HOST` | `127.0.0.1` | Host del worker |
| `CLAUDE_MEM_PROVIDER` | `claude` | Proveedor AI (claude/gemini/openrouter) |
| `CLAUDE_MEM_CLAUDE_AUTH_METHOD` | `cli` | Metodo de autenticacion |
| `CLAUDE_MEM_DATA_DIR` | `~/.claude-mem` | Directorio de datos |
| `CLAUDE_MEM_LOG_LEVEL` | `INFO` | Nivel de log |
| `CLAUDE_MEM_CHROMA_ENABLED` | `true` | ChromaDB habilitado |
| `CLAUDE_MEM_CHROMA_PORT` | `8000` | Puerto ChromaDB |

## Hooks registrados

El plugin registra hooks en estas etapas:

| Hook | Accion |
|------|--------|
| **Setup** | Ejecuta `setup.sh` (no existe en v10.6.1) |
| **SessionStart** | smart-install, worker start, context hook |
| **UserPromptSubmit** | session-init hook |
| **PostToolUse** | observation hook (guarda lo que hace Claude) |
| **Stop** | summarize hook |
| **SessionEnd** | session-complete hook |

## Skills disponibles

- `/claude-mem:mem-search` - Buscar en memoria persistente
- `/claude-mem:timeline-report` - Reporte narrativo del historial
- `/claude-mem:make-plan` - Crear plan de implementacion
- `/claude-mem:do` - Ejecutar plan con subagentes
- `/claude-mem:smart-explore` - Busqueda estructural con tree-sitter

## MCP Tools disponibles

- `search` - Buscar observaciones por query/filtros
- `get_observations` - Obtener detalles completos por IDs
- `timeline` - Contexto temporal alrededor de un punto
- `smart_search` - Busqueda inteligente
- `smart_outline` - Outline de codigo
- `smart_unfold` - Desplegar detalles de codigo

## Bug conocido: __dirname hardcodeado (Issue #1433)

### Sintomas
- Worker arranca y `/health` responde OK
- Todos los demas endpoints devuelven: `"Database is still initializing, please retry"` indefinidamente
- Log muestra: `"Background initialization failed Critical: code.json mode file missing"`

### Causa raiz
`worker-service.cjs` contiene 3 rutas hardcodeadas del developer original:

```
Linea 7472:  var __dirname = "/Users/alexnewman/conductor/.../src/shared"
Linea 43681: var __dirname = "/Users/alexnewman/conductor/.../src/services/server"
Linea 68282: var __dirname = "/Users/alexnewman/conductor/.../src/services"
```

El fallback dinamico (`import.meta.url`) nunca se ejecuta porque `typeof __dirname !== "undefined"` siempre es true.

### Fix

Parchear las 3 lineas a `undefined` para activar el fallback:

```bash
FILE="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.1/scripts/worker-service.cjs"

# Backup
cp "$FILE" "$FILE.bak"

# Patch linea 7472
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/shared"|var __dirname = undefined|' \
  "$FILE"

# Patch linea 43681
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services/server"|var __dirname = undefined|' \
  "$FILE"

# Patch linea 68282
sed -i '' \
  's|var __dirname = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services", __filename = "/Users/alexnewman/conductor/workspaces/claude-mem/banjul/src/services/worker-service.ts"|var __dirname = undefined, __filename = undefined|' \
  "$FILE"
```

### Verificacion

```bash
# Confirmar que las 3 lineas fueron parcheadas
grep -n 'var __dirname' "$FILE"
# Debe mostrar: undefined en las 3 lineas

# Arrancar worker
PATH="$HOME/.bun/bin:$PATH" \
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.1" \
nohup bun "$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.1/scripts/worker-wrapper.cjs" > /dev/null 2>&1 &

# Esperar 8 segundos y verificar
sleep 8
curl -s http://127.0.0.1:37777/health
# Debe devolver: {"status":"ok",...}

curl -s "http://127.0.0.1:37777/api/search?query=test&limit=5"
# Debe devolver resultados o "No results found" (NO "Database is still initializing")
```

## Problema secundario: Worker no arranca automaticamente

Los hooks ejecutan `bun-runner.js` con `node`, que busca `bun` en PATH y en `~/.bun/bin/bun`. Si Bun se acaba de instalar y no se ha reiniciado la terminal, el hook falla silenciosamente con `"Failed to start worker"`.

### Solucion temporal
Arrancar manualmente:

```bash
PATH="$HOME/.bun/bin:$PATH" \
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.1" \
nohup bun "$HOME/.claude/plugins/cache/thedotmack/claude-mem/10.6.1/scripts/worker-wrapper.cjs" > /dev/null 2>&1 &
```

### Solucion permanente
Asegurar que `~/.bun/bin` este en PATH en `.zshrc` / `.bashrc`:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

## Notas importantes

- El patch se pierde si se actualiza el plugin (`/plugin update claude-mem`) — hay que reaplicarlo
- El issue #1433 documenta el bug: https://github.com/thedotmack/claude-mem/issues/1433
- La API del worker es GET en `/api/search?query=<text>&limit=<n>` (no POST, no `q=`)
- El supervisor guarda el PID del worker en `~/.claude-mem/supervisor.json`
- Logs diarios en `~/.claude-mem/logs/claude-mem-YYYY-MM-DD.log`
