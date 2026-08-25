# Import Existing Infrastructure

## Purpose
Bring pre-existing infrastructure under Terraform management without changing or recreating it unexpectedly.

## When to use
Use for brownfield adoption, recovery from unmanaged creation, or ownership consolidation.

## Inputs
Resource identifiers, provider credentials, intended configuration, current state, ownership evidence.

## Context to inspect
Actual resource settings, provider import syntax, state addresses, dependencies, lifecycle-sensitive attributes, external managers.

## Core knowledge
Import establishes state identity; it does not automatically prove configuration parity. Brownfield resources often contain defaults and historical settings that must be modeled deliberately.

## Procedure
1. Confirm the resource is intended to be Terraform-owned.
2. Record current configuration and backup state.
3. Write the target resource/module configuration.
4. Define import blocks when supported or use controlled import commands.
5. Plan immediately after import.
6. Reconcile configuration until remaining changes are intentional.
7. Import dependencies in an order that keeps plans understandable.
8. Remove competing management paths.
9. Document ownership and future change process.

## Decision points
Adopt existing settings when they are valid requirements; normalize them only through separately reviewed changes. Import into the lifecycle boundary that will own the resource long term.

## Common failure patterns
Importing before writing configuration, assuming import means zero diff, double management, wrong account/region, and using ignore_changes to hide unexplained differences.

## Verification
Resource ID and state address match reality; plan has no unexplained changes; subsequent apply and plan converge.

## Expected output
A safely managed brownfield resource with explicit Terraform ownership.

## Stop conditions
Stop when ownership is disputed, resource identity is uncertain, import requires destructive reconciliation, or external automation still controls the resource.