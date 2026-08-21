# Migration and Modernization Strategy

## Purpose
Move systems safely from current to target architecture while controlling business disruption, data risk, compatibility, and rollback complexity.

## When to use
Use for cloud migrations, platform replacements, monolith decomposition, database moves, API replacement, and legacy modernization.

## Inputs
Current architecture, target architecture, dependencies, data volumes, downtime tolerance, release constraints, test coverage.

## Preconditions
Business reasons for migration and success criteria are explicit.

## Context to inspect
Dependency graph, interfaces, data ownership, deployment process, batch jobs, hidden consumers, operational procedures, compliance, rollback options.

## Core knowledge
Migration is an architecture in its own right. Strangler patterns, dual running, CDC, compatibility layers, and staged cutover can reduce risk but add temporary complexity.

## Procedure
1. Inventory current dependencies and hidden consumers.
2. Define target state and migration invariants.
3. Split migration into independently verifiable stages.
4. Choose rehost, replatform, refactor, replace, or retire per component.
5. Define data migration and reconciliation.
6. Design backward compatibility during transition.
7. Define cutover, rollback, and freeze conditions.
8. Instrument both old and new paths.
9. Rehearse migrations with production-like data/volume.
10. Decommission only after evidence confirms no remaining dependency.

## Decision points
Prefer incremental migration when uncertainty or business criticality is high. Big-bang cutover requires unusually strong evidence and rollback capability.

## Common failure patterns
Unknown consumers, no reconciliation, irreversible cutover, dual-write inconsistency, migrating technology without business value, decommissioning too early.

## Verification
Each stage has acceptance evidence, reconciliation, rollback, and ownership.

## Expected output
Phased migration roadmap with risk controls and exit criteria.

## Stop conditions
Stop when rollback is impossible for a high-risk cutover without explicit approval.