# Governance and Timelocks

## Purpose
Make protocol governance deliberate, observable, and resistant to unilateral high-impact changes.

## Scope
Governance proposals, voting, quorum, timelocks, executors, guardians, and emergency powers.

## MUST
- Define who can propose, approve, queue, execute, cancel, and emergency-intervene.
- Make governance payloads fully inspectable before approval.
- Use delays proportional to the impact of changes unless emergency authority is explicitly bounded.
- Prevent replay or duplicate execution of governance actions.
- Document quorum, delegation, voting-power snapshots, and failure behavior.

## MUST NOT
- Hide privileged execution behind nominally decentralized interfaces.
- Permit governance to bypass critical validation accidentally.
- Execute high-risk governance changes without required human approval and review.

## SHOULD
- Separate routine parameter changes from code upgrades and emergency powers.
- Monitor concentration and sudden delegation changes.

## Exceptions
Emergency bypasses require narrowly defined triggers, bounded scope, named authority, and retrospective review.

## Verification
Inspect governance contracts/configuration, simulate proposal lifecycle, test replay/cancellation, and review execution payloads and privilege maps.