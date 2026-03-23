# AI Agent Context & Token Optimizations

This document outlines the specific strategies and constraints applied to this project to ensure AI coding agents (Claude Code, Gemini CLI, Cursor, Copilot, etc.) operate efficiently, quickly, and with minimal token consumption.

Relying on AI agents for complex projects can quickly become expensive and slow if the context window is bloated. We follow a "Surgical Prompting" and "Strict Context Management" methodology to divide token consumption by 2x-5x without sacrificing output quality.

## Existing Optimizations (Already in use)

### 1. Surgical `CLAUDE.md`

The root `CLAUDE.md` is extremely short (barely 20 lines) and avoids loading the entire project context. Instead, it delegates: `"Read specs/constitution.md for stack constraints"`. This prevents loading the entire architecture into every single session turn.

### 2. Explicit Scope and "Do Not Read" Instructions

Our `CLAUDE.md` enforces the rule: `"Only read the specific spec you need — do not load all specs into context."` This is crucial to prevent the agent from reading all requirement files just in case.

### 3. Atomic Tasks and Short Sessions

Our use of the Spec Kit workflow (SDD) (`/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) forces development to be broken down into atomic steps and sessions. By separating planning from execution, we avoid a massive history of trial and error in a single long session.

### 4. Multi-Agent Architecture & Templates

Instead of using a single monolithic agent, we use specialized prompts via the `.claude/commands/speckit.*.md` folder and have a separate `AGENTS.md` file to inject specific rules (like Next.js constraints). This allows the agent to assume a particular "role" with a strictly delimited context.

### 5. No-Explanation Mode

Our `constitution.md` enforces the rule: `"No code comments unless explicitly requested"`. This saves thousands of output tokens (which are usually the most expensive) by forcing the agent to return only the necessary code without preamble.

### 6. Prompt Caching (via claude-mem)

We utilize `claude-mem` to leverage model prompt caching. This prevents being billed for system prompt tokens that are repeatedly sent in each API call, resulting in typical savings of 60% to 90% on repetitive inputs.

---

## Added Optimizations (Implemented for the future)

### 7. Tool Output Filtering (Bash Limits)

When an agent uses shell tools, the output is injected directly into the conversation history. Our `CLAUDE.md` now enforces a strict rule: `"When using bash commands, always pipe output to limit results: grep add | head -20, ls add | head -30. Never display more than 30 lines of command output."`

### 8. Phase-Restricted Tooling

To prevent tokens from being wasted on accidental code generation during analysis phases, the `/speckit.clarify` & `/speckit.plan` commands now explicitly restrict the agent to read-only operations (Read, Search) and forbid the use of Write tools or executing mutating Bash commands.

### 9. Diffs over Full File Rewrites

Asking an AI to modify a few lines in a large file and returning the entire file is a massive waste of output tokens. The `/speckit.implement` guidelines now instruct the agent to **"Pass diffs instead of full files"** when proposing complex modifications.

---

## Planned Future Optimizations

### 10. Nested `CLAUDE.md` Files (Localized Context)

Instead of one global instruction file, we plan to use nested `CLAUDE.md` files in specific subdirectories.

- **Example:** A `src/app/CLAUDE.md` containing Next.js 16 App Router routing rules, or a `src/components/ui/CLAUDE.md` enforcing the use of Radix primitives. The agent will only load these when working within those specific folders.

### 11. "Context Sandwich" Pattern for Long Prompts

In long inputs or specs, implement the "Context Sandwich" structural pattern:
`[SHORT & PRECISE INSTRUCTION] -> [INDISPENSABLE MINIMAL CONTEXT] -> [REPETITION OF INSTRUCTION / RESTRICTIONS REMINDER]`.
LLMs pay more attention to the beginning and the end. Repeating the restrictions at the end avoids long outputs caused by forgetting constraints.

### 12. Token Consumption Monitoring & Checklists

Introduce token tracking to identify abnormally expensive tasks. Calculate Input/Output ratios (a ratio > 10:1 indicates bloated context). Also, document a Pre-session and Post-session optimization checklist for developers before interacting with agents.
