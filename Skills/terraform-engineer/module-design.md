# Module Design

## Purpose
Design reusable Terraform modules with stable contracts, low surprise, and bounded responsibility.

## When to use
Use when a proven infrastructure pattern repeats across stacks or teams; avoid premature wrappers around single resources.

## Inputs
Repeated use cases, provider constraints, callers, lifecycle requirements, compatibility expectations.

## Context to inspect
Existing modules, call sites, versioning scheme, provider aliases, variable/output conventions, tests.

## Core knowledge
A module is an API. Optimize for cohesion, explicit inputs, useful outputs, sane defaults, validation, composability, and backward compatibility. Avoid exposing every provider argument mechanically.

## Procedure
1. Identify the stable capability and its consumers.
2. Define responsibility and non-goals.
3. Design typed inputs and validations.
4. Choose stable resource keys and addresses.
5. Expose only outputs callers need.
6. Handle optional behavior explicitly rather than with opaque magic.
7. Document examples, assumptions, provider requirements, and breaking changes.
8. Add tests for defaults, optional paths, and failure cases.
9. Exercise upgrades from the previous module version.

## Decision points
Use one module when resources share lifecycle and policy; compose modules when responsibilities or release cadence differ. Prefer maps with stable semantic keys over positional lists for long-lived resources.

## Common failure patterns
Mega-modules, boolean explosions, leaking provider internals, embedded credentials, unstable count indexes, undocumented breaking changes, and provider blocks inside reusable modules.

## Verification
Validate module examples, inspect plans for multiple callers, run tests and policy checks, and verify an upgrade does not recreate stable resources unexpectedly.

## Expected output
A documented, versionable module contract with tests and predictable lifecycle behavior.

## Stop conditions
Stop when requirements are still divergent, the abstraction has no stable common behavior, or compatibility cannot be preserved without an explicit major change.