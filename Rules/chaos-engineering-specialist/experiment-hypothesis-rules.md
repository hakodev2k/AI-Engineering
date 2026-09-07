# Experiment Hypothesis Rules

## Purpose
Ensure chaos experiments test explicit resilience assumptions and produce decision-quality evidence rather than uncontrolled disruption.

## Scope
Applies to fault-injection, resilience validation, game days, and production or pre-production chaos experiments.

## MUST
- Every experiment MUST state a falsifiable hypothesis, expected steady state, injected fault, blast radius, and abort condition before execution.
- Success criteria MUST use observable signals such as SLOs, error rates, latency, saturation, recovery time, or correctness checks.
- The hypothesis MUST identify the specific architecture assumption being tested.
- Results MUST distinguish observed facts from interpretation.

## MUST NOT
- Experiments MUST NOT begin with only a vague goal such as "test resilience."
- Success MUST NOT be declared solely because the system remained available.
- Unexpected behavior MUST NOT be discarded as noise without evidence.

## SHOULD
- Hypotheses SHOULD prioritize high-impact failure modes and previously unverified assumptions.
- Experiments SHOULD test one primary resilience question at a time when practical.

## Exceptions
Broader exploratory experiments require documented rationale, bounded scope, explicit stop conditions, and reviewer approval appropriate to the risk.

## Verification
Review the experiment plan, telemetry queries, acceptance thresholds, and result record. Confirm each conclusion is traceable to captured evidence.