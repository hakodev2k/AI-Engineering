# TTL and Cache Rules

## Purpose
Control propagation, load, and rollback behavior through deliberate TTL design.

## Scope
Positive and negative caching for production DNS records and zones.

## MUST
- TTL changes MUST consider query load, failure recovery, propagation time, and downstream cache behavior.
- Planned migrations requiring rapid convergence MUST lower relevant TTLs early enough for previous values to expire.
- Negative caching behavior MUST be considered when introducing previously nonexistent names.

## MUST NOT
- MUST NOT claim immediate global DNS propagation after an authoritative update.
- MUST NOT use extremely low TTLs without capacity and dependency analysis.

## SHOULD
- Stable records SHOULD use TTLs that reduce unnecessary authoritative load while meeting recovery objectives.

## Exceptions
Temporary low TTLs require a defined purpose and restoration plan.

## Verification
Query authoritative and recursive paths, inspect SOA negative-cache parameters, and measure cache hit/load behavior.