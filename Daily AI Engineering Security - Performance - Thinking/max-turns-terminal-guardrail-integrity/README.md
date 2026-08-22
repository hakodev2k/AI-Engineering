# Max-Turns Terminal Guardrail Integrity

**Category:** Security / Thinking

## Problem
Agent runtimes have multiple ways to finish: normal final output, `max_turns`, model refusal, invalid output, guardrail tripwire, cancellation, and error-handler fallbacks. If an abnormal terminal path produces user-facing output without the same guardrail admission and durable-session rules used by normal output, policy can be bypassed exactly when execution is degraded.

## Evidence
See `evidence/research.md`. This package is grounded in fresh August 2026 OpenAI Agents SDK reports about `max_turns` handler output bypassing output-guardrail/session semantics and streamed guardrail persistence leaving an orphaned tool call, plus current official guardrail, run-error-handler, and runner documentation.

## Existing approach
Configure output guardrails, set a maximum turn limit, optionally return a fallback from a run-error handler, and rely on framework-managed session persistence.

## Existing limitations
Applications often test normal final output but not every terminal path. Error-handler output can take a shortcut around normal final-output admission. Streaming/resume paths can also diverge in persisted session structure.

## Proposed improvement
Define one observable terminal-output contract outside individual handlers. Before delivery, every candidate terminal output must have a guardrail verdict. After persistence, a deterministic integrity gate verifies call/output pairing and rejected-output semantics. Equivalent streaming and non-streaming fixtures are compared before release.

## Architecture

```text
max-turns-terminal-guardrail-integrity/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-delivery-terminal-gate.md
├── rules/terminal-output-policy.md
├── scripts/terminal_integrity_guard.py
├── skills/terminal-path-audit.md
├── subagents/terminal-integrity-verifier.md
├── tests/fixtures.json
└── workflows/verify-terminal-paths.md
```

## Installation
Requires Python 3.10+ only for the deterministic guard. Integrate the hook at the application/runtime boundary immediately before terminal output delivery and after terminal session persistence can be inspected.

## Configuration
Edit `config/policy.json` to reflect supported terminal reasons and fail-secure behavior. Do not remove abnormal paths from coverage merely to make verification pass.

## Usage
Export a terminal trace JSON and run:

```bash
python scripts/terminal_integrity_guard.py trace.json --policy config/policy.json --strict
```

Exit codes: `0` allowed, `2` invalid trace/config, `3` policy/integrity block.

## Workflow
Follow `workflows/verify-terminal-paths.md`: enumerate paths → capture baseline → diagnose bypass/divergence → implement shared admission → rerun full matrix → independent verification.

## Metrics
Track guardrail coverage for delivered terminal outputs, orphaned call/output count, rejected-output persistence violations, streaming/non-streaming semantic parity failures, and regression count.

## Verification
Start with `tests/fixtures.json`: normal allowed output must pass; max-turns output without verdict must block; blocked fallback persisted as accepted must block; an orphaned terminal tool call must block. Add runtime integration fixtures for streaming, non-streaming, resumed approvals, and actual configured handlers.

## Safety
Fail secure when required guardrail evidence is missing. Do not disable output guardrails to restore availability. Do not mutate production sessions during verification. High-impact terminal changes require an independent verifier.

## Failure handling
Detection: deterministic gate or parity test fails. Evidence: preserve trace and session manifest. Retry: maximum one verification retry. Fallback: block affected terminal output/release while retaining existing stricter policy. Escalation: framework/runtime owner. Stop condition: unresolved security violation or exhausted verification retry.

## Definition of Done
- **Implemented:** all user-facing terminal outputs pass through the shared admission boundary.
- **Measured:** full terminal-path matrix and session traces captured before/after.
- **Verified:** 100% delivered-output guardrail coverage, zero orphaned call/output records, zero rejected outputs persisted as accepted, and zero unexplained streaming/non-streaming semantic parity failures.

## Customization
Map framework-specific session item types into the generic `function_call` / `function_call_output` trace format, extend terminal reasons, and add provider/runtime-specific expected metadata differences without weakening semantic invariants.
