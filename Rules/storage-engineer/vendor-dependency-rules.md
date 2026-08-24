# Vendor and Dependency Rules

## Purpose
Manage storage platform dependencies, supportability, compatibility, and lock-in as explicit engineering risks.

## Scope
Storage vendors, cloud services, drivers, client libraries, plugins, firmware, support contracts, and external control planes.

## MUST
- Critical dependencies MUST have known ownership, support status, compatibility constraints, and escalation paths.
- Major upgrades MUST review release notes, breaking changes, rollback, interoperability, and data-format implications.
- Architecture decisions with significant lock-in MUST document exit or migration considerations.
- Dependency vulnerabilities affecting storage security MUST be assessed and remediated according to risk.

## MUST NOT
- MUST NOT deploy unsupported dependency combinations without explicit risk acceptance.
- MUST NOT perform large dependency migrations in production without staged validation and human approval.
- MUST NOT rely on undocumented vendor behavior for critical correctness without validation.

## SHOULD
- Prefer supported, observable, automatable interfaces and maintain upgrade currency within operational constraints.

## Exceptions
Pinned or legacy dependencies require rationale, compensating controls, and a review date.

## Verification
Inspect inventories, compatibility matrices, vulnerability reports, upgrade tests, support status, and architecture decisions.