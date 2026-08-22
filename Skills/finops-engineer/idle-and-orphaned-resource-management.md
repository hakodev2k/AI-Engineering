# Idle and Orphaned Resource Management

## Purpose
Safely identify and remove resources that consume money without delivering required business, reliability, security, or recovery value.

## When to use
Use for recurring waste reviews, post-project cleanup, environment sprawl, or unexplained baseline spend.

## Inputs
Resource inventory, billing, utilization metrics, ownership data, deployment records, dependencies, backup/retention policies.

## Context to inspect
Inspect unattached disks/IPs, stopped resources that still bill, stale snapshots, load balancers, old environments, unused databases, test resources, reserved capacity dependencies, and IaC state.

## Core knowledge
Zero utilization does not prove a resource is unnecessary. Standby, DR, security, licensing, and recovery resources can be intentionally idle. Deletion should be reversible where possible.

## Procedure
1. Define candidate heuristics per resource type.
2. Rank candidates by cost and confidence.
3. Resolve owner using multiple metadata sources.
4. Check dependencies, IaC, DR, compliance, and retention purpose.
5. Notify owner with evidence and deadline.
6. Prefer stop/quarantine/snapshot before deletion when reversible staging is possible.
7. Observe for impact.
8. Delete after approved waiting period.
9. Remove stale IaC/configuration references.
10. Confirm billing reduction and automate recurrence.

## Decision points
Use automatic deletion only for clearly ephemeral resources with explicit lifecycle contracts. Require human approval for ambiguous or production-adjacent assets.

## Common failure patterns
Deleting by age alone, assuming unattached means unused, leaving IaC to recreate deleted waste, forgetting billable static IP/storage, and claiming projected rather than realized savings.

## Verification
Dependency checks pass; owner approval or policy permits cleanup; monitoring shows no impact; billing confirms removal.

## Expected output
A candidate inventory, evidence, approvals, cleanup actions, exceptions, and realized savings.

## Stop conditions
Stop when ownership, dependency, retention, DR, or compliance purpose cannot be established safely.