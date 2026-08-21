# Skill: Revalidate Time-Sensitive Decision

## Purpose
Prevent an agent from executing a decision whose time evidence has become stale or whose window/TTL changed before action.

## Inputs
TimeDecision JSON, current policy, latest TimeObservation, prior evaluation, optional review.

## Preconditions
Decision condition and risk are explicit; dangerous-action approval requirements are known.

## Procedure
1. Confirm the decision still targets the same action/resource and timezone.
2. Check the observation age against the risk-specific policy.
3. Refresh time evidence if stale, skewed, or below required trust.
4. Run `evaluate-time-decision.py` against the refreshed decision.
5. If the condition is false, stop; do not extend the window automatically.
6. For high/critical risk, obtain an independent review bound to the exact decision fingerprint.
7. If the action is dangerous, stop until explicit human approval is recorded.
8. Run `evaluate-final-gate.py` immediately before the side effect.
9. Execute only when gate status is `verified` and the condition remains satisfied.
10. Record execution timestamp separately from verification timestamp.

## Output
`verified`, `revalidation-required`, `review-required`, or `blocked`, with evidence.

## Verification
The final gate binds the current observation ID, decision ID, fingerprint, reviewer identity, and approval requirement.

## Failure handling
One retry is allowed only for transient read/time-source failure. Validation, trust, skew, review, approval, or business-window failures stop execution.

## Stop conditions
Stop on ambiguous timezone, stale review, insufficient trust, false condition, missing approval, or repeated transient failure.
