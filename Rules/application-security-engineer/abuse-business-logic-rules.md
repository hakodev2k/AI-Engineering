# Abuse and Business Logic Rules

## Purpose
Prevent attackers from using valid application functions in unintended sequences, volumes, identities, or economic contexts.

## Scope
Applies to signup, recovery, payments, credits, promotions, inventory, workflows, invitations, approvals, exports, messaging, and other abuse-sensitive features.

## MUST
- High-impact workflows MUST identify business invariants, actor permissions, state transitions, replay behavior, and abuse incentives.
- Server-side logic MUST enforce quantities, ownership, eligibility, price/value, sequence, and state constraints that affect security or economic outcomes.
- Operations with irreversible, financial, privilege, or high-volume effects MUST define duplicate/replay handling and appropriate confirmation or approval controls.
- Abuse controls MUST consider distributed attackers and account farming when simple per-IP limits are insufficient.
- Material fraud/abuse assumptions MUST be observable through logs, metrics, or reviewable evidence where practical.

## MUST NOT
- MUST NOT trust client-calculated prices, discounts, entitlements, workflow state, or approval status without authoritative validation.
- MUST NOT assume a function is safe because every individual request is syntactically valid and authenticated.
- MUST NOT silently weaken anti-abuse controls to improve conversion without explicit risk review.

## SHOULD
- SHOULD use layered controls: authorization, invariant enforcement, velocity limits, anomaly signals, friction, and manual review as appropriate.
- SHOULD evaluate attacker economics and bypass cost when selecting mitigations.

## Exceptions
Exceptions require business owner and security owner agreement on exposure, monitoring, loss bounds, and rollback criteria.

## Verification
Perform abuse-case walkthroughs, state-machine tests, concurrency/replay tests, economic boundary tests, telemetry review, and targeted adversarial testing.