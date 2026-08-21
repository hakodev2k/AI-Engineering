# Workflow — Measure, Diagnose, Recover

## Trigger
A long-running model/tool/subagent step fails and the runtime is considering retry.

## Goal
Recover from transient failures while preventing identical no-progress replays and full-turn amplification.

## Inputs
Failure event, request fingerprint, checkpoint/progress state, attempt history, token/tool/time counters, retry budget, implementation under test.

## Baseline
Capture the current failure reproduction: attempts, duplicate fingerprints, wall time after first failure, replayed tokens, tool calls, checkpoint used, and final outcome.

## Context
Use `evidence/research.md`, `rules/retry-policy.md`, `config/retry-budget.json`, and relevant runtime traces.

## Stages
1. **Observe** — identify first failure and all subsequent replay attempts.
2. **Measure baseline** — quantify replay cost and progress delta.
3. **Diagnose** — classify transient vs deterministic/repeated failure and locate stale/missing checkpoint behavior.
4. **Form hypothesis** — state what policy or checkpoint change should reduce replay without breaking transient recovery.
5. **Implement** — add request fingerprinting, progress tracking, multi-dimensional budgets, or checkpoint resume as needed.
6. **Measure again** — replay the same deterministic fixture and compare attempts/tokens/tools/time.
7. **Transient recovery test** — ensure a one-time recoverable failure still completes.
8. **Independent verification** — `subagents/retry-verifier.md` validates both fixtures and measurements.
9. **Complete** — record Implemented, Measured, and Verified states separately.

## Responsible agent
Implementation owner for stages 1–7; Retry Verifier for stage 8.

## Tools
Trace/log queries, token accounting, workflow-state inspection, unit/integration tests, and `python scripts/retry_gate.py <input> --config config/retry-budget.json`.

## Outputs
Baseline metrics, root cause, recovery hypothesis, implementation, after metrics, verifier result, and residual-risk record.

## Checkpoints
- C1: first failure and replay chain reconstructed.
- C2: baseline includes attempts, tokens, tool calls, time, fingerprints, and progress.
- C3: deterministic fixture is bounded.
- C4: transient fixture recovers.
- C5: independent verification passes.

## Metrics
Replay amplification ratio, duplicate fingerprint count, no-progress retries, post-failure tokens/tool calls/time, checkpoint-resume ratio, recovery success rate.

## Retry policy
Maximum 2 remediation cycles for this workflow. Each retry must change a falsifiable hypothesis or implementation. Identical remediation attempts are forbidden.

## Stop conditions
Stop if any configured budget is exhausted, two remediation cycles fail, checkpoint integrity is uncertain, or continuing would require weakening security/correctness.

## Failure path
Preserve sanitized trace and fixture, mark verification failed, stop automatic replay for the affected failure signature where safe, and escalate to a human/runtime owner.

## Verification
The Retry Verifier must reproduce both deterministic-failure containment and transient recovery using the same budget configuration.

## Definition of Done
Baseline captured; root cause supported by evidence; improvement implemented; deterministic replay bounded; transient recovery preserved; before/after metrics collected; independent verification passed; no blocking issue remains.
