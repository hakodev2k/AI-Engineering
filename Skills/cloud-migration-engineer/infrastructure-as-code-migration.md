# Infrastructure as Code for Migration

## Purpose
Make target infrastructure repeatable, reviewable, and recoverable instead of creating one-off cloud environments manually.

## When to use
Use for landing-zone extensions, workload environments, migration tooling, and repeatable wave provisioning.

## Inputs
Target architecture, current infrastructure, cloud standards, module catalog, environment differences, state backend, policy controls, and deployment pipeline.

## Preconditions
Repository ownership, secrets handling, state management, and review process must be established.

## Context to inspect
Inspect existing IaC modules, naming/tagging, IAM, network, compute, storage, databases, monitoring, policy, drift, state locking, and CI/CD.

## Core knowledge
IaC is valuable only when it is the authoritative path. Importing existing resources, managing state, versioning providers/modules, and handling immutable changes require deliberate controls.

## Procedure
1. Inspect existing IaC conventions before introducing new tooling or modules.
2. Model target resources and environment boundaries.
3. Reuse approved modules where they fit requirements.
4. Define remote state, locking, access, and backup.
5. Keep secrets out of source and state where tooling permits.
6. Add policy/static validation and plan review.
7. Provision non-production target from code.
8. Validate idempotence and expected diffs.
9. Import unavoidable pre-existing resources rather than duplicating them.
10. Exercise destroy/rebuild only in safe environments.
11. Promote versioned changes through environments.
12. Detect and remediate drift.
13. Preserve code and state needed for recovery after migration.

## Decision points
Build custom modules when repeated patterns justify ownership; use vendor/community modules only after reviewing lifecycle and security. Import manual resources when replacement is unsafe; replace them when drift risk and change cost are acceptable.

## Common failure patterns
Manual hotfixes becoming permanent; secrets committed; shared state with broad access; unpinned providers; destructive plans not reviewed; environment differences implemented as copied stacks.

## Verification
Plans are reviewed, deployments are repeatable, drift is detectable, state is protected, and a clean environment can be provisioned from documented inputs.

## Expected output
Version-controlled target infrastructure, protected state, validation pipeline, reusable modules, and documented operational ownership.

## Stop conditions
Stop when plans contain unexplained destructive changes, state ownership is unclear, credentials would be exposed, or required manual exceptions are not documented and approved.