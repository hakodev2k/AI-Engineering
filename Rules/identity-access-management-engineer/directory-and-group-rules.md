# Directory and Group Rules

## Purpose
Keep directory objects and group-based access authoritative, understandable, and bounded.

## Scope
Users, groups, nested groups, directory attributes, synchronization, dynamic membership, and administrative groups.

## MUST
- Security-relevant groups MUST have an owner, purpose, membership rule, and review expectation.
- Nested membership MUST be included when calculating effective access.
- Directory synchronization MUST define conflict resolution, deletion behavior, and authoritative attribute sources.
- Dynamic group rules MUST be tested for over-inclusion and attribute-change behavior.

## MUST NOT
- MUST NOT use ambiguous general-purpose groups for high-risk authorization.
- MUST NOT allow untrusted self-service attribute changes to confer privilege.
- MUST NOT create circular or uncontrolled group nesting that obscures effective access.

## SHOULD
- Separate collaboration groups from security authorization groups where their governance differs.

## Exceptions
Legacy group structures require documented dependency analysis, owner, compensating review, and migration plan.

## Verification
Inspect group inventory, nested effective membership, synchronization logs, attribute ownership, dynamic-rule tests, and stale-object reports.