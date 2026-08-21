# Triage Evaluation Regression

## Purpose
Turn a failed evaluation gate into evidence-backed diagnosis without weakening the gate to make a change pass.

## Inputs
Gate report, per-case outputs, baseline/candidate configuration, repository diff, tool traces.

## Procedure
1. Confirm case-set equality and evaluator version before interpreting score movement.
2. Partition failures into correctness, safety, format, tool-use, latency, cost, and infrastructure errors.
3. For each failed case, compare baseline/candidate evidence and identify the first observable divergence.
4. Classify cause as implementation, prompt/context, model behavior, tool integration, evaluator defect, environment, or ambiguous requirement.
5. Reproduce each blocking failure once. Retry infrastructure/transient failures at most twice; never retry semantic failures merely hoping for a different answer.
6. Implement the smallest change that addresses a supported cause.
7. Re-run affected cases, then the complete gate.
8. Inspect cost/latency and critical-case status even when correctness improves.
9. Hand evidence to the Verification Agent.

## Verification
A regression is resolved only when the full candidate set passes configured thresholds and no critical regression remains.

## Failure handling
Preserve failed outputs and commands. If evaluator drift is suspected, stop and require independent evaluator review; changing evaluator or thresholds requires approval.

## Stop conditions
Two failed transient retries, unresolved requirement ambiguity, permission failure, or any proposal to weaken safety/thresholds without approval.
