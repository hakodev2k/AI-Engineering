# Provider and Version Management

## Purpose
Control Terraform CLI, provider, and module versions so infrastructure changes are reproducible and upgrades are deliberate.

## When to use
Use during bootstrap, dependency upgrades, provider migrations, or unexplained plan changes.

## Inputs
Required versions, lock file, module sources, release notes, CI runtime, provider configuration.

## Context to inspect
terraform block, dependency lock file, module constraints, aliases, CI images, current state provider addresses.

## Core knowledge
Version constraints express compatibility; lock files pin provider selections. Provider upgrades can change defaults, schemas, diffs, and replacement behavior. Modules need explicit compatibility ranges.

## Procedure
1. Inventory CLI, provider, and module versions.
2. Pin Terraform to a tested compatible range.
3. Set provider constraints and commit the lock file.
4. Review upstream breaking changes and deprecations.
5. Upgrade one dependency domain at a time.
6. Reinitialize with controlled upgrade flags.
7. Run validation, tests, and plans across representative stacks.
8. Document migration steps and rollback.

## Decision points
Use narrow constraints for applications/stacks needing reproducibility and broader compatible ranges for reusable modules. Upgrade incrementally when provider schema migrations are substantial.

## Common failure patterns
Unbounded versions, deleting lock files casually, simultaneous major upgrades, ignoring provider address migrations, and trusting a no-error init as proof of compatibility.

## Verification
CI and local selections match; lock changes are reviewed; plans show no unexplained drift or replacement; tests pass on supported Terraform versions.

## Expected output
A reproducible dependency set with documented compatibility and upgrade evidence.

## Stop conditions
Stop on unexplained plan churn, unsupported state migration, unavailable provider artifacts, or breaking changes without an approved migration.