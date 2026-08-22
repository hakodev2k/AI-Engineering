# Terminal Output Guardrail Consistency Gate

## Category
Security / Thinking

## Problem
Terminal agent outputs can pass through different finalization branches for streaming, normal completion, error handlers, max-turns fallback, resumed approvals, and tool turns. When guardrail and session persistence ordering differs, rejected output can become durable or tool-call history can become structurally invalid.

## Evidence
See `evidence/research.md`. Current signals include OpenAI Agents SDK issues #4393 (2026-08-13) and #4125 (2026-08-02), plus the official output-guardrail contract.

## Existing approach and limitation
SDK tests and output guardrails protect individual paths, but application wrappers and custom runners may still implement terminal branches separately. Visible response tests alone do not prove durable session integrity.

## Proposed improvement
Define one observable finalization contract and validate every terminal fixture with a deterministic parity checker that also enforces tool-call/result pairing.

## Architecture
- `evidence/research.md` — current evidence and root causes.
- `skills/finalization-parity-audit.md` — reusable audit procedure.
- `rules/finalization-contract.md` — enforceable terminal rules.
- `subagents/session-integrity-reviewer.md` — independent verifier contract.
- `workflows/diagnose-and-verify.md` — bounded repair workflow.
- `hooks/finalization-parity-check.md` — deterministic pre-release hook.
- `scripts/finalization_guard.py` — dependency-free validator.
- `tests/fixtures.json` — passing reference fixture matrix.

## Installation
Requires Python 3.9+. Copy this directory into the project or call the script from CI.

## Usage
From this package directory run:

`python scripts/finalization_guard.py tests/fixtures.json`

Replace or extend fixtures with snapshots captured from the target framework. A fixture records expected/actual candidate persistence, persisted tool call IDs, persisted tool result IDs, and duplicate terminal records.

## Workflow
Observe -> capture baseline -> diagnose first divergent finalization stage -> form hypothesis -> implement minimum fix -> rerun complete matrix -> independently verify. Maximum two repair cycles before escalation.

## Metrics
Fixture pass rate; candidate-persistence mismatches; orphan call/result count; duplicate terminal-record count; streamed/non-streamed parity.

## Verification
Exit 0 means the supplied evidence satisfies the deterministic contract. Exit 3 is a contract violation. Exit 2 means invalid evidence. Production verification requires target-specific fixtures; the included fixtures verify the validator's expected happy path, not a third-party SDK version.

## Safety
Never make rejected output durable to preserve convenience. Never weaken guardrails to obtain parity. Use isolated sessions for destructive-tool fixtures. High-risk runner changes require a reviewer other than the implementing agent.

## Failure handling
Detection: non-zero validator exit or target integration test mismatch. Evidence: retain session snapshots and runner version. Retry: at most two repair attempts. Fallback: isolate/revert the affected finalization branch. Escalation: session/runner owner. Stop condition: verified parity or blocked report after two failed attempts.

## Definition of Done
Evidence documented; baseline captured; terminal paths enumerated; improvement implemented; full matrix measured; zero rejected-output persistence; zero orphan/duplicate records; independent verification complete; risks recorded; no blocking issue remains.

## Status language
- **Implemented**: contract/checker integrated.
- **Measured**: target fixture results captured.
- **Verified**: all required fixtures pass from clean sessions with independent review.
