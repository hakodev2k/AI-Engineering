# Fleet Management

## Purpose
Operate large heterogeneous device populations through inventory, grouping, configuration, health, lifecycle, and controlled actions.

## When to use
Use when designing fleet operations or scaling beyond manual device administration.

## Inputs
Device inventory, ownership, sites, versions, configuration, lifecycle states, support requirements.

## Context to inspect
Registry, provisioning, update service, telemetry, authorization, support tools, and retirement flow.

## Core knowledge
Fleet operations depend on stable identity, cohort targeting, desired state, auditability, blast-radius controls, and explicit lifecycle states.

## Procedure
1. Define canonical inventory and ownership metadata.
2. Model lifecycle states from manufacturing to retirement.
3. Create dynamic/static cohorts for operations.
4. Define configuration and update targeting rules.
5. Add authorization and approval for high-impact actions.
6. Track health and version convergence.
7. Provide quarantine and recovery workflows.
8. Securely decommission identities and data.

## Decision points
Automate reversible low-risk operations; require stronger approval for fleet-wide, destructive, or safety-relevant actions.

## Common failure patterns
Manual spreadsheets, mutable identity, no audit trail, overly broad targeting, abandoned devices, and no ownership transfer process.

## Verification
Test cohort selection, permission boundaries, partial failures, quarantine, ownership changes, and retirement.

## Expected output
A scalable, auditable fleet lifecycle and operating model.

## Stop conditions
Escalate when target selection is ambiguous for high-impact fleet actions.