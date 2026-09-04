# Resource Modeling Rules

## Purpose
Keep API models aligned with stable business capabilities rather than transient storage or UI structures.

## Scope
Applies to resource-oriented and domain-oriented API design.

## MUST
- Public resources MUST represent stable domain concepts with explicit ownership and lifecycle semantics.
- Identifier meaning, mutability, and uniqueness scope MUST be defined.
- Relationships MUST state whether they are embedded, referenced, traversable, or independently addressable.
- Write operations MUST define which fields are client-controlled, server-controlled, immutable, or conditionally mutable.
- Derived fields MUST have documented consistency expectations.

## MUST NOT
- Database tables MUST NOT be exposed one-for-one as public resources without a deliberate contract decision.
- Internal implementation identifiers MUST NOT leak when doing so creates security, privacy, or migration constraints.
- Resource models MUST NOT mix unrelated domain ownership merely to reduce endpoint count.

## SHOULD
- Models SHOULD remain stable when persistence technology or internal service topology changes.
- Optionality SHOULD reflect domain semantics, not accidental serializer behavior.

## Exceptions
Exceptions require domain rationale, compatibility analysis, consumer impact, and approval by the accountable API owner.

## Verification
Review schemas, domain models, ownership boundaries, lifecycle documentation, and representative create/update/read flows. Confirm persistence changes can occur without unnecessary public contract churn.