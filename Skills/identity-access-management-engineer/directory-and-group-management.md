# Directory and Group Management

## Purpose
Operate directories and groups as reliable identity infrastructure with controlled naming, ownership, nesting, synchronization, and lifecycle.

## When to use
Use for directory design, group-based authorization, synchronization, group sprawl remediation, or troubleshooting membership/access drift.

## Inputs
Directories, group types, ownership model, synchronization topology, application dependencies, naming standards, lifecycle rules, and effective memberships.

## Context to inspect
Inspect authoritative attributes, group nesting, dynamic rules, sync scope, duplicate objects, soft-deleted objects, privileged groups, owners, and applications consuming memberships.

## Core knowledge
Groups are often both operational objects and authorization primitives. Deep nesting and uncontrolled dynamic rules obscure effective access. Directory synchronization introduces propagation delay and source-of-authority constraints.

## Procedure
1. Classify directory objects and authoritative sources.
2. Define group purposes and naming conventions.
3. Assign accountable owners and lifecycle metadata.
4. Limit nesting where effective access becomes hard to reason about.
5. Protect privileged groups with stronger change controls.
6. Validate dynamic membership rules against business intent.
7. Define synchronization direction and conflict behavior.
8. Reconcile memberships and stale groups regularly.
9. Monitor failed sync and unexpected membership changes.
10. Retire unused groups safely after dependency checks.

## Decision points
Use dynamic groups for stable attribute-driven rules; use managed groups when business judgment is required. Nesting can simplify administration but should not hide privilege paths.

## Common failure patterns
Groups without owners, circular or deep nesting, display names as identifiers, stale privileged memberships, bidirectional sync conflicts, dynamic rules based on poor-quality attributes, and deleting groups before dependency analysis.

## Verification
Resolve effective memberships for representative users, compare source and synchronized targets, and validate privileged and dynamic group behavior.

## Expected output
A governed directory/group model with ownership, synchronization, lifecycle, monitoring, and verified effective membership.

## Stop conditions
Stop when source authority is ambiguous, group deletion could break unknown dependencies, or effective privileged membership cannot be determined.