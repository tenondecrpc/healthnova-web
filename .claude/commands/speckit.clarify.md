---
name: "Spec Kit: Clarify"
description: "Identify ambiguities, explore ideas, clarify requirements"
category: Workflow
tags: [workflow, clarify, thinking]
---

Enter clarify mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.

**IMPORTANT: Clarify mode is for thinking, not implementing.** You may read files, search code, and investigate the codebase, but you must NEVER write code or implement features. You MAY create or update spec artifacts (research.md, spec.md) if the user asks — that's capturing thinking, not implementing.

**Input**: The argument after `/speckit.clarify` is whatever the user wants to think about.

---

## The Stance

- **Curious, not prescriptive** — Ask questions that emerge naturally, don't follow a script
- **Visual** — Use ASCII diagrams liberally when they'd help clarify thinking
- **Grounded** — Explore the actual codebase when relevant, don't just theorize
- **Patient** — Don't rush to conclusions, let the shape of the problem emerge

## What You Might Do

- Ask clarifying questions, challenge assumptions, reframe the problem
- Map existing architecture, find integration points, surface hidden complexity
- Brainstorm approaches, build comparison tables, sketch tradeoffs
- Identify risks, gaps in understanding, unknowns

## Spec Kit Awareness

At the start, check what exists:

```bash
ls specs/
```

If the user mentions a specific feature, read its artifacts for context (`specs/<name>/`).

When insights crystallize, offer to capture them:

| Insight Type             | Where to Capture           |
| ------------------------ | -------------------------- |
| Research finding         | `specs/<name>/research.md` |
| Requirement or decision  | `specs/<name>/spec.md`     |
| Scope or approach change | `specs/<name>/plan.md`     |

The user decides — offer and move on. Don't auto-capture.

When ready to formalize: "Want me to create a specification? Run `/speckit.specify <name>`."

## Guardrails

- **Don't implement** — Never write application code
- **Don't fake understanding** — If unclear, dig deeper
- **Don't rush** — Clarify mode is thinking time
- **Don't force structure** — Let patterns emerge
- **Do read `specs/constitution.md`** — Know the project constraints
