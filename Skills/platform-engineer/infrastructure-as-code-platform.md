# Infrastructure as Code Platform

## Purpose
Provide repeatable, reviewable infrastructure provisioning with safe platform defaults.

## When to use
Use when teams provision cloud, network, identity, data, or runtime resources repeatedly.

## Inputs
IaC repositories, cloud topology, state model, policy, environments, and recovery requirements.

## Context to inspect
Providers, modules, state backends, permissions, drift, secrets, pipelines, and existing resources.

## Core knowledge
IaC needs deterministic plans, protected state, least privilege, modular ownership, drift control, and safe lifecycle handling.

## Procedure
1. Inventory resource patterns and ownership.
2. Define module boundaries and version contracts.
3. Secure remote state and locking.
4. Encode policy and safe defaults.
5. Separate plan from apply with review gates.
6. Handle imports and migrations explicitly.
7. Add drift detection and rollback/recovery procedures.
8. Test modules in isolated environments.

## Decision points
Use reusable modules for stable patterns; avoid universal modules with excessive switches. Choose workspace/state boundaries by blast radius and ownership.

## Common failure patterns
Shared mutable state, secret leakage, unpinned providers, destructive defaults, manual production drift, and giant modules.

## Verification
Plans are reproducible, state is protected, policy tests pass, drift is detectable, and destructive changes require explicit review.

## Expected output
A governed IaC capability with modules, pipelines, state strategy, tests, and recovery guidance.

## Stop conditions
Escalate destructive migrations, unknown imported resources, or insufficient cloud permissions.