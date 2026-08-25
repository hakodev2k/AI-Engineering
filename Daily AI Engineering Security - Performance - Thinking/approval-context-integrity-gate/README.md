# Approval Context Integrity Gate

## Topic
Approval-context integrity for agent tool calls.

## Category
Security

## Problem
Agent permission prompts can omit or silently lose the exact arguments of a sensitive tool call while still appearing valid. The reviewer may approve a generic tool name or summary instead of the executable command, paths, payload, or MCP arguments.

## Evidence
See `evidence/research.md`. Current signals include ACP v1.6.0 default-on-error behavior for `rawInput`, July 2026 Cursor approval reports where MCP arguments were not visible, and a Qwen Code subagent approval bug that hid tool/command details.

## Existing approach
Interactive approval prompts, allow/ask/deny rules, tool annotations, exact command rules, and expandable argument views.

## Existing limitations
These controls do not guarantee that reviewer-visible data is canonically bound to the data that executes. Serialization fallbacks and UI omissions can preserve the approval flow while degrading its evidence.

## Proposed improvement
Fail closed when sensitive arguments are absent, defaulted, parse-failed, or differ between execution and display. Bind approval to SHA-256 of canonical arguments and revalidate immediately before execution.

## Architecture
- `evidence/research.md` — evidence, gaps, root causes.
- `skills/approval-context-audit.md` — audit procedure.
- `rules/approval-context-integrity.md` — enforceable invariants.
- `subagents/approval-security-reviewer.md` — independent review contract.
- `workflows/inspect-and-gate.md` — bounded workflow.
- `hooks/pre-approval-integrity.md` — deterministic hook.
- `scripts/approval_context_guard.py` — executable validator.
- `tests/test_approval_context_guard.py` — regression tests.

## Actual package tree
```text
approval-context-integrity-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-approval-integrity.md
├── rules/approval-context-integrity.md
├── scripts/approval_context_guard.py
├── skills/approval-context-audit.md
├── subagents/approval-security-reviewer.md
├── tests/test_approval_context_guard.py
└── workflows/inspect-and-gate.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
The input envelope contains `risk` or explicit `sensitive`, `source.toolCallId`, `source.toolName`, `source.rawInput`, `source.rawInputParseStatus`, `display.toolName`, `display.rawInput`, and optional `decision.actionSha256`.

## Usage
`python scripts/approval_context_guard.py --input approval-envelope.json`

Exit codes: `0` integrity pass, `1` malformed input, `2` security block.

## Workflow
Observe → measure disclosure baseline → diagnose loss point → fix integration → run guard → independent verification → permit approval broker to continue.

## Metrics
Missing disclosure, defaulted input, payload mismatch, approval-hash mismatch, sensitive approvals carrying canonical hashes.

## Verification
`python -m unittest tests/test_approval_context_guard.py`

## Safety
The script never executes tool calls and needs no network. Avoid logging plaintext secret-bearing arguments; retain redacted metadata and hashes.

## Failure handling
Malformed envelopes may be rebuilt once. Persistent mismatch, unknown executable payload, or missing sensitive arguments blocks execution. No infinite retries.

## Definition of Done
**Implemented:** guard runs before approval and before execution. **Measured:** before/after disclosure and mismatch metrics exist. **Verified:** tests pass, negative fixtures block, matching fixtures pass, and independent review validates the result.

## Customization
Extend sensitive classifications or add a host-side classifier, but never downgrade known mutation, credential, or production actions merely to reduce approval friction.
