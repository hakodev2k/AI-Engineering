# Compatibility Policy Rules

## Purpose
Prevent schema evolution from breaking active producers or consumers.

## Scope
Backward, forward, full, transitive, and no-compatibility modes.

## MUST
- Every governed subject MUST have an explicit compatibility policy.
- Policy choice MUST match the actual producer and consumer deployment model.
- Compatibility checks MUST run before registration or promotion to production.
- Transitive compatibility MUST be used when consumers may read data produced by more than the immediately previous version.
- Policy weakening MUST require impact analysis and approval.

## MUST NOT
- MUST NOT disable compatibility checks merely to unblock a deployment.
- MUST NOT assume backward compatibility implies forward compatibility.
- MUST NOT change compatibility mode globally without evaluating all affected subjects.

## SHOULD
- Prefer the strongest compatibility mode that supports legitimate evolution requirements.
- Keep policy exceptions scoped to the smallest possible subject set.

## Exceptions
Exceptions require rationale, affected versions, rollout sequencing, rollback plan, and human approval.

## Verification
Review registry configuration, compatibility test results, version history, and approval records.