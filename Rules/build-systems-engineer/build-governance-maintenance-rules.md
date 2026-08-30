# Build Governance and Maintenance Rules

## Purpose
Keep shared build infrastructure maintainable through explicit ownership, lifecycle policy, compatibility management, and evidence-based technical debt decisions.

## Scope
Applies to shared build rules, plugins, macros, target conventions, deprecated behavior, ownership boundaries, documentation, and long-lived maintenance work.

## MUST
- Shared build components MUST have identifiable ownership and an escalation path.
- Supported interfaces and target conventions MUST document compatibility expectations.
- Deprecations MUST provide migration guidance, a measurable adoption state, and removal criteria.
- Build-system technical debt that creates reliability, security, or release risk MUST be tracked and prioritized according to impact.
- Significant policy changes MUST be communicated to affected consumers before enforcement where migration is required.

## MUST NOT
- MUST NOT keep obsolete compatibility layers indefinitely without an owner and retirement condition.
- MUST NOT introduce organization-wide build policy through undocumented implementation side effects.
- MUST NOT remove a supported interface solely because maintenance is inconvenient without assessing consumer impact.

## SHOULD
- Shared build APIs SHOULD remain small, composable, and versioned when incompatible evolution is unavoidable.
- Maintenance work SHOULD use telemetry, incident history, migration cost, and consumer impact to prioritize changes.

## Exceptions
An accelerated deprecation or compatibility break MUST document urgency, affected consumers, mitigation, approval, and recovery plan.

## Verification
Review ownership records, deprecation inventories, compatibility tests, migration status, incident history, documentation, and outstanding build-system risk items.