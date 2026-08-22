# Skill: Finalization Parity Audit

## Purpose
Detect terminal-path differences that can bypass guardrails or corrupt durable agent session history.

## Trigger
Framework upgrade; runner/session/guardrail/error-handler change; new streaming/resume path; reported replay inconsistency.

## Inputs
Fixture matrix, expected terminal policy, captured persisted items, visible final result, framework version.

## Preconditions
Use isolated test sessions and non-production side effects. Capture before/after session state.

## Allowed tools
Test runner, session store inspection, structured logs, `scripts/finalization_guard.py`.

## Constraints
Do not disable guardrails to obtain parity. Do not rewrite expected outcomes to match observed regressions.

## Procedure
1. Enumerate dimensions: streamed/non-streamed, normal/error-handler terminal, guardrail pass/tripwire/exception, resumed/not-resumed, tool-turn/no-tool-turn.
2. Record baseline behavior on the current known-good version if available.
3. Execute each fixture once; collect visible outcome and durable session snapshot.
4. Normalize snapshots into calls, results, assistant candidates, guardrail outcome and persistence outcome.
5. Run the deterministic guard.
6. Diagnose any mismatch by identifying the first finalization stage where streamed/non-streamed state diverges.
7. Implement the smallest shared finalization change; maximum two repair iterations.
8. Repeat the entire matrix and require an independent verification run.

## Decision points
- Rejected candidate persisted: security-blocking failure.
- Orphan call/result: session-integrity failure.
- Only ordering differs while pairing/policy remains correct: document and decide whether order is contractually relevant.

## Expected output
Parity report with fixture, expected state, actual state, violation, framework version and verification status.

## Metrics
Parity coverage; rejected-persistence count; orphan count; fixture pass rate; regression count.

## Verification
All required fixtures pass twice, second run performed independently or from clean state.

## Failure handling
Keep evidence, roll back or isolate the terminal change, and escalate after two failed repair cycles.

## Stop conditions
Stop on complete verified parity or after two unsuccessful repair cycles with a blocking report.
