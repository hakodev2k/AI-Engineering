# Production Safety Rules

## Purpose
Protect availability, integrity, confidentiality, and operational continuity during tests that touch production.

## Scope
Applies to all testing against live systems, production data, customer-facing services, and production control planes.

## MUST
- MUST identify critical services, dependencies, peak periods, monitoring coverage, backups or rollback capabilities, and emergency contacts before risky activity.
- MUST start with the least invasive technique and increase intensity only when evidence and authorization justify it.
- MUST monitor for unexpected latency, errors, resource pressure, alerts, or business impact during potentially disruptive tests.
- MUST stop when predefined safety thresholds or unexpected material impact occur.
- MUST immediately disclose suspected test-caused incidents through the agreed operational channel.

## MUST NOT
- MUST NOT perform denial-of-service, destructive writes, irreversible migrations, mass data access, or infrastructure destruction without explicit human approval.
- MUST NOT disable monitoring, backups, security controls, or failover to make testing easier.
- MUST NOT continue a technique after credible evidence of unintended production harm.

## SHOULD
- SHOULD validate risky techniques in staging or a representative lab first.
- SHOULD schedule high-risk testing in controlled windows with operators available.

## Exceptions
High-impact production testing requires explicit accountable-owner approval, rollback or containment, live monitoring, success criteria, and a tested stop path.

## Verification
Review approvals, monitoring dashboards, test timestamps, operational alerts, change records, stop events, incident records, and post-test health checks.