# Safe and Constrained Reinforcement Learning

## Purpose
Design RL systems that optimize performance while respecting safety, compliance, resource, and operational constraints that cannot be left to reward optimization alone.

## When to use
Use when actions can cause safety incidents, irreversible state changes, policy violations, financial loss, resource exhaustion, or other material harm.

## Inputs
- Safety and operational requirements
- Constraint metrics and limits
- Environment/action model
- Baseline policy and incident history

## Preconditions
Constraints must be expressed as measurable invariants, budgets, or approval boundaries. Ownership for approving risk must be known.

## Context to inspect
Inspect illegal actions, unsafe states, constraint frequency, delayed violations, recovery options, actuator limits, human override, and distribution shift.

## Core knowledge
Reward penalties do not guarantee constraint satisfaction. Action masking, shielding, constrained MDPs, risk-sensitive objectives, safety layers, fallback policies, and human approval offer different assurance levels. Safety must be validated independently of reward.

## Procedure
1. Classify hard constraints versus soft costs.
2. Define measurable constraint signals and allowed budgets.
3. Remove impossible or prohibited actions at the environment boundary where practical.
4. Select constrained optimization or risk-sensitive methods for remaining limits.
5. Define a known-safe fallback policy.
6. Add runtime monitors and intervention paths.
7. Train with representative rare and adverse scenarios.
8. Track return and constraint metrics separately.
9. Stress-test distribution shift and sensor/action failures.
10. Define deployment gates, rollback rules, and human escalation.

## Decision points
Prefer deterministic enforcement for legal or physical hard limits. Use optimization constraints for tradeable resource budgets. Require human approval when residual risk cannot be bounded automatically.

## Common failure patterns
- Large negative rewards are treated as guarantees.
- Rare violations disappear in average metrics.
- Safety checks differ between training and production.
- Fallback policy is untested.

## Verification
Demonstrate constraint compliance under normal, rare, and adversarial scenarios; test monitors and fallback transitions; report worst-case and tail-risk metrics, not only means.

## Expected output
A constrained RL design with explicit limits, enforcement mechanisms, fallback behavior, risk metrics, and deployment gates.

## Stop conditions
Stop if critical constraints cannot be measured or enforced, residual risk lacks an accountable approver, or testing cannot cover credible hazardous scenarios.