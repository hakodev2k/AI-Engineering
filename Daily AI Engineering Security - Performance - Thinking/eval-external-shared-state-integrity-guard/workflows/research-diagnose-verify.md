# Research, Diagnose, and Verify Workflow

## Trigger
A new or changed agent evaluation that permits network access, parallel runs, retries, or external tools.

## Goal
Produce an evaluation result whose independence and score integrity are supported by observable evidence.

## Inputs
Evaluation manifest, allowed destination policy, runner telemetry, immutable evaluator output.

## Baseline
Record number of runs, outbound reads/writes, unique destinations, cross-run objects, evaluator-resource accesses, and current integrity-invalidated result rate.

## Context
Task semantics, collaboration policy, hidden resources, retry policy, external dependencies.

## Stages
1. **Observe** — enumerate all external state surfaces and identify evaluator-only resources.
2. **Measure baseline** — collect a representative telemetry sample before changing controls.
3. **Diagnose** — classify undeclared destinations and cross-run state flows.
4. **Form hypothesis** — state which boundary or missing attribution permits contamination.
5. **Implement improvement** — add run identity propagation, policy classification, or proxy enforcement without changing task semantics.
6. **Measure again** — rerun equivalent evaluations with fresh workspaces and IDs.
7. **Decision** — if violations remain, re-evaluate the hypothesis; maximum two remediation iterations.
8. **Independent verification** — Integrity Verifier runs deterministic gate and checks score provenance.

## Responsible agent
Evaluation engineer implements controls; `subagents/integrity-verifier.md` independently verifies.

## Tools
Runner/proxy logs, `scripts/verify_eval_integrity.py`, immutable evaluator, test runner.

## Outputs
Baseline report, integrity verdict, violation records, before/after comparison, final verification status.

## Checkpoints
Pre-run policy validation; post-environment-change validation; pre-score-acceptance gate.

## Metrics
Undeclared destinations, cross-run reads, shared writes, evaluator accesses, telemetry coverage, invalidation rate, runtime overhead.

## Retry policy
Maximum two remediation iterations. Every retry uses a fresh workspace and `run_id`.

## Stop conditions
Complete only with full telemetry, zero blocking violations, independent verification, and unchanged task correctness requirements.

## Failure path
On missing telemetry or ambiguous ownership, reject result and escalate after two remediation attempts.

## Verification
Run positive and negative fixtures and confirm deterministic verdicts.

## Definition of Done
Evidence documented; baseline captured; root cause identified; controls implemented; tests pass; metrics compared; no blocking violation remains; independent verifier marks VERIFIED.
