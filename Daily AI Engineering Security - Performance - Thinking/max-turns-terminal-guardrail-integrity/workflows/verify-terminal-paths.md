# Workflow — Verify Terminal Paths

## Trigger
Before releasing a change to agent terminal handling, guardrails, error handlers, streaming persistence, or session resume behavior.

## Goal
Prove that every externally delivered terminal output passes output policy and every terminal session satisfies durable-state invariants.

## Inputs
Runtime configuration, policy, terminal fixtures, session traces, guardrail results.

## Baseline
Record current terminal-path matrix, guardrail coverage, orphan count, streaming parity result, and known expected differences.

## Stages
1. **Observe** — enumerate terminal reasons and delivery behavior.
2. **Measure** — capture baseline traces for normal output and abnormal paths.
3. **Diagnose** — identify any output path that skips final-output admission or persists divergent session state.
4. **Form hypothesis** — locate the shared terminal boundary where policy/session validation should occur.
5. **Implement improvement** — route candidate terminal outputs through the same admission contract; preserve framework-specific persistence ordering.
6. **Measure again** — rerun the entire terminal matrix.
7. **Independent verification** — `subagents/terminal-integrity-verifier.md` reviews traces and gate output.
8. **Complete** only after all critical invariants pass.

## Responsible agents
Implementation agent for remediation; independent Terminal Integrity Verifier for final verdict.

## Tools
`config/policy.json`, `scripts/terminal_integrity_guard.py`, test runner, trace/session exporter.

## Outputs
Before/after matrix, gate reports, session diffs, parity report, verification verdict.

## Checkpoints
- No delivered terminal output lacks guardrail evidence.
- A blocked fallback cannot reach the user.
- No orphaned tool-call terminal records.
- Streaming/non-streaming semantic parity verified where both are supported.

## Metrics
Coverage %, terminal-policy violations, orphan count, parity failures, regression count.

## Retry policy
At most one verification retry after a failed implementation attempt. A second failure stops the workflow for diagnosis/escalation.

## Stop conditions
All terminal fixtures pass; any unresolved security-critical violation; verification retry budget exhausted.

## Failure path
Preserve the existing stricter policy, block the affected terminal delivery path or release, capture evidence, and escalate. Do not disable output guardrails to restore availability.

## Definition of Done
Implemented: terminal admission gate integrated. Measured: full path matrix executed. Verified: independent review confirms zero uncovered delivered outputs and zero terminal session-integrity violations.
