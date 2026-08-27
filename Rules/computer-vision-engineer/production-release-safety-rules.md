# Production Release Safety Rules

## Purpose
Make model deployment controlled, reversible, and evidence-based.

## Scope
Model promotion, configuration, runtime changes, rollout, rollback, and production activation.

## MUST
- Every production candidate MUST have immutable artifact identity, acceptance evidence, known limitations, and rollback target.
- Rollouts MUST define health signals, abort criteria, and ownership.
- Production deployment, breaking contract changes, and high-risk configuration changes MUST require explicit human approval before execution.
- Rollback procedures MUST be tested or otherwise demonstrated feasible for consequential systems.

## MUST NOT
- Experimental checkpoints MUST NOT be promoted directly to production without release gates.
- A failed safety, quality, or compatibility gate MUST NOT be hidden by aggregate metrics.

## SHOULD
- Progressive delivery, shadowing, or canarying SHOULD be used when blast radius justifies it.

## Exceptions
Emergency releases require documented incident context, approver, reduced-risk scope, monitoring, and retrospective validation.

## Verification
Inspect release records, artifact hashes, approval evidence, gate results, canary metrics, abort criteria, and rollback tests.