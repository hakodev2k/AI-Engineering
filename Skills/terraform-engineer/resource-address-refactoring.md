# Resource Address Refactoring

## Purpose
Refactor Terraform structure without recreating infrastructure by preserving or explicitly migrating resource addresses.

## When to use
Use when renaming resources, introducing modules, changing count/for_each, or reorganizing configuration.

## Inputs
Old and new addresses, state, configuration diff, target plan, backup.

## Context to inspect
Current state list, module paths, instance keys, dependencies, lifecycle constraints, remote-state consumers.

## Core knowledge
Terraform identity is address-based. Structural refactors can look like destroy/create unless moved blocks or state moves establish continuity.

## Procedure
1. Capture state backup and old address inventory.
2. Define a one-to-one migration map.
3. Prefer declarative moved blocks for reviewable migrations.
4. For count-to-for_each conversions, choose stable semantic keys.
5. Apply refactor in small stages when mappings are complex.
6. Generate plan and require zero unintended recreation.
7. Keep migration declarations long enough for all supported upgrade paths.
8. Document compatibility implications.

## Decision points
Use moved blocks for normal source-controlled refactors; use state mv for exceptional operational surgery. Split migrations when a single change obscures identity mapping.

## Common failure patterns
Changing keys and attributes simultaneously, deleting old state entries, index-based identities, removing moved blocks too early, and accepting recreation of stateful resources.

## Verification
State addresses match the new configuration and plan contains expected moves/updates rather than unintended create/destroy actions.

## Expected output
A safe refactor with preserved infrastructure identity and an auditable migration path.

## Stop conditions
Stop if mapping is ambiguous, state backup is missing, resource identity cannot be proven, or the plan recreates critical resources unexpectedly.