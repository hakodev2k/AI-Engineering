# Migration and Cutover Rules

## Purpose
Control transitions between contract versions without creating inconsistent producer or consumer states.

## Scope
Applies to version migrations, schema transitions, dual-publishing, backfills, consumer cutovers, and retirement of legacy contracts.

## MUST
- Breaking migrations MUST define sequencing for producer changes, consumer adoption, validation, and legacy retirement.
- Cutover criteria MUST be measurable and MUST include evidence that critical consumers function on the target contract.
- Dual-write or dual-publish periods MUST define reconciliation and divergence detection.
- Rollback or containment options MUST be documented before high-risk production cutover.

## MUST NOT
- Legacy contracts MUST NOT be removed before migration completion is evidenced for required consumers.
- Dual-published representations MUST NOT drift silently.
- A production cutover MUST NOT proceed solely because the new contract passes isolated producer tests.

## SHOULD
- Prefer staged migration with reversible checkpoints over synchronized big-bang cutovers.
- Migration plans SHOULD identify irreversible steps explicitly.

## Exceptions
Exceptions require documented risk, affected consumers, alternative considered, rollback limitation, and authorized approval.

## Verification
Inspect migration plans, compatibility tests, reconciliation results, consumer validation, cutover evidence, and retirement approvals.