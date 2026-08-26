# Split-Horizon DNS Rules

## Purpose
Keep differentiated DNS views intentional and supportable.

## Scope
Internal/external views, conditional forwarding, private namespaces, and overlapping names.

## MUST
- Split-horizon behavior MUST have documented client populations, authoritative sources, and expected answer differences.
- Internal and external changes MUST be tested from representative network contexts.
- Conditional forwarding dependencies MUST have defined failure behavior.

## MUST NOT
- MUST NOT assume a result observed from one network view represents all clients.
- MUST NOT create overlapping namespaces without ownership and troubleshooting guidance.

## SHOULD
- View complexity SHOULD be minimized because divergent answers increase operational risk.

## Exceptions
Complex view logic requires documented necessity, test coverage, and operational ownership.

## Verification
Query from each intended view, inspect forwarding policies, compare expected answer matrices, and test dependency failure.