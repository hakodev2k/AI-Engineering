# Migration Discovery and Inventory

## Purpose
Establish an evidence-based inventory of databases, schemas, workloads, dependencies, owners, and operational constraints before migration decisions are made.

## When to use
Use at the start of a database migration, consolidation, engine change, cloud move, or major version transition. Do not use an assumed CMDB entry as the sole source of truth.

## Inputs
Repository and deployment configuration, database catalog metadata, topology, connection telemetry, job schedules, ownership records, SLAs, backup policies, and known incidents.

## Preconditions
Obtain read-only access appropriate to discovery and identify the authoritative environments. Avoid intrusive production scans without approval.

## Context to inspect
Inspect schemas, extensions, stored code, users and roles, replication, linked services, ETL jobs, CDC, application connection strings, scheduled tasks, data volume, growth, peak traffic, and maintenance windows.

## Core knowledge
A migration boundary is wider than tables. Hidden coupling commonly exists through jobs, reports, credentials, filesystem exports, database links, extensions, and operational procedures. Inventory must distinguish observed facts from inferred dependencies.

## Procedure
1. Define source systems and migration objective.
2. Enumerate instances, databases, schemas, objects, extensions, and versions.
3. Map inbound and outbound dependencies using configuration plus telemetry.
4. Identify workload classes, critical queries, jobs, and peak periods.
5. Record data size, growth, retention, RPO, RTO, and availability requirements.
6. Identify owners and consumers for every critical dependency.
7. Flag unsupported features and undocumented coupling.
8. Reconcile discovered state against documentation.
9. Produce a dependency graph and risk register.
10. Have application and operations owners validate the inventory.

## Decision points
Prefer telemetry over stale documentation when they conflict, but investigate the discrepancy. Use deeper tracing when static configuration cannot prove runtime dependency.

## Common failure patterns
Missing batch jobs, assuming inactive connections are unused, ignoring read replicas and reports, omitting extensions, treating credentials as application-local, and failing to inventory restore procedures.

## Verification
Cross-check catalog queries, connection telemetry, deployment manifests, scheduler inventories, and owner sign-off. A migration is not ready for design while critical consumers remain unidentified.

## Expected output
A validated source inventory, dependency map, ownership map, workload profile, and explicit unknowns.

## Stop conditions
Stop and escalate when production discovery would require unsafe privileges, ownership cannot be established for critical systems, or evidence shows the proposed migration boundary is incomplete.