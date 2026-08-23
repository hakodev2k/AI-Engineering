# Directory Services Engineering

## Purpose
Design and operate directory services as reliable identity data stores and policy dependencies without allowing schema, replication, or administrative drift to undermine access control.

## When to use
Use for directory design, consolidation, replication issues, schema changes, or privileged directory operations.

## Inputs
Directory topology, domains/tenants, schemas, replication model, identity sources, application dependencies, availability requirements.

## Context to inspect
Forests/domains/tenants, OUs, groups, replication health, sync engines, schema extensions, admin delegation, backups, and recovery tests.

## Core knowledge
Directories are control-plane infrastructure. Replication, naming, immutable identifiers, group nesting, and delegated administration directly affect authentication and authorization correctness.

## Procedure
1. Inventory directory boundaries and authoritative data.
2. Validate immutable identifiers and naming conventions.
3. Review replication and synchronization paths.
4. Minimize privileged directory roles.
5. Rationalize group nesting and ownership.
6. Assess schema extensions and compatibility.
7. Define backup and recovery procedures.
8. Monitor replication, sync latency, and failed objects.
9. Test outage and corruption scenarios.
10. Document operational dependencies and escalation paths.

## Decision points
Separate directories when trust, regulation, or blast-radius isolation requires it; consolidate when duplicated identity state creates greater risk.

## Common failure patterns
Email as primary key, uncontrolled group nesting, stale sync connectors, schema changes without rollback, and untested recovery.

## Verification
Check replication/sync health, representative object flows, delegated permissions, and restore procedures.

## Expected output
Directory topology, ownership model, health controls, recovery plan, and remediation actions.

## Stop conditions
Escalate when replication integrity is uncertain, destructive schema changes are required, or recovery evidence is missing.