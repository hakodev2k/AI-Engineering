# Purge and Invalidation Rules

## Purpose
Remove stale or unsafe content without destabilizing origins or deleting more cache state than intended.

## Scope
Applies to URL purge, wildcard purge, tag/surrogate-key invalidation, versioned assets, and emergency cache removal.

## MUST
- Purge scope MUST be the smallest scope that satisfies the correctness requirement.
- High-volume invalidations MUST account for resulting origin load and refill behavior.
- Security-sensitive stale content MUST have a documented emergency invalidation path.
- Purge requests MUST be auditable and attributable.
- Bulk purge tools MUST support dry-run or explicit scope review where feasible.

## MUST NOT
- MUST NOT purge the entire cache as a routine deployment mechanism.
- MUST NOT execute broad production invalidations without approval and origin-capacity assessment.
- MUST NOT assume purge propagation is instantaneous.

## SHOULD
- Prefer immutable versioned assets over repeated invalidation.
- Use tags/surrogate keys for coherent object groups.
- Monitor propagation completion and post-purge miss rate.

## Exceptions
Incident-driven emergency purge may use broad scope under incident authority when exposure exceeds origin-risk; scope and outcome MUST be recorded.

## Verification
Test invalidation in non-production; inspect audit logs and propagation status; verify stale objects disappear; monitor miss ratio, origin load, latency, and errors afterward.