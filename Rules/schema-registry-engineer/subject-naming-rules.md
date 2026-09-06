# Subject Naming Rules

## Purpose
Keep registry subjects predictable, collision-resistant, and aligned with ownership boundaries.

## Scope
Subject names, namespaces, topic/value-key conventions, environment separation, and multi-tenant naming.

## MUST
- Subject naming MUST follow a documented deterministic convention.
- Names MUST distinguish materially different contracts that evolve independently.
- Environment or tenant boundaries MUST be represented in configuration or naming where required to prevent collisions.
- Subject ownership MUST be discoverable from registry metadata or an authoritative catalog.
- Renaming a production subject MUST include migration and retained-data impact analysis.

## MUST NOT
- MUST NOT reuse a subject name for an unrelated contract.
- MUST NOT depend on ambiguous abbreviations that create ownership or semantic collisions.
- MUST NOT create ad hoc production subjects outside the governed naming convention.

## SHOULD
- Prefer stable domain-oriented names over deployment-instance names.
- Keep names independent of transient infrastructure topology.

## Exceptions
Exceptions require documented reason, collision analysis, migration plan, and owner approval.

## Verification
Review naming-policy checks, registry inventory, ownership metadata, and collision tests.