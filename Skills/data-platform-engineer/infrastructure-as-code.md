# Infrastructure as Code for Data Platforms

## Purpose
Provision and evolve data-platform infrastructure reproducibly through reviewed, testable, version-controlled definitions.

## When to use
Use for cloud resources, clusters, networking, IAM, catalogs, queues, storage, and environment promotion.

## Inputs
Architecture, provider APIs, environment topology, state backend, security requirements, and deployment workflow.

## Context to inspect
Existing IaC modules, state ownership, drift, provider versions, manual resources, secrets, policies, and CI permissions.

## Core knowledge
IaC state is sensitive operational data. Modules should encode stable abstractions, not hide every provider option. Plans are evidence but can become stale between review and apply.

## Procedure
1. Inventory managed and manually created resources.
2. Define state boundaries by ownership and blast radius.
3. Import existing resources before attempting replacement where appropriate.
4. Build small composable modules with explicit inputs/outputs.
5. Pin and deliberately upgrade providers/modules.
6. Keep secrets out of source and state where possible.
7. Add formatting, validation, policy, and security checks in CI.
8. Review plans for destructive or privilege changes.
9. Apply through controlled identities and environments.
10. Detect drift and reconcile intentionally.
11. Test recovery of the IaC state backend.

## Decision points
Split state when teams, lifecycle, or blast radius differ; excessive fragmentation creates dependency overhead. Use provider-native constructs when generic modules obscure critical behavior.

## Common failure patterns
Monolithic state, manual production edits, secrets in variables/state, unpinned providers, blind auto-apply, circular module dependencies, and deleting resources to resolve drift.

## Verification
Create a clean environment from definitions, detect intentional drift, test module upgrades, verify least-privilege deployment identity, and restore state from backup.

## Expected output
Versioned IaC, module boundaries, CI checks, state/recovery design, drift process, and deployment evidence.

## Stop conditions
Stop before destructive plans, privilege expansion, state surgery, or production replacement when approval and recovery evidence are absent.