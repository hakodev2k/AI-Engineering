# Generated Code Pipelines

## Purpose
Integrate code generation as deterministic, dependency-aware build actions with clear ownership and lifecycle.

## When to use
Use for schema/protocol clients, parsers, bindings, resources, ORM models, or other generated sources.

## Inputs
Generator, schemas/templates, generator version, configuration, consumers, and generated artifact policy.

## Context to inspect
Inspect whether generated files are committed, generation ordering, source-of-truth ownership, formatting, package dependencies, and stale-output cleanup.

## Core knowledge
Generated code has at least three inputs: source schema/template, generator binary, and generator configuration. Consumers must depend on the generation target, not accidental prior execution. Checked-in output trades simpler consumers for drift risk.

## Procedure
1. Identify authoritative source inputs.
2. Pin generator and plugin versions.
3. Define generation as a first-class target with declared inputs/outputs.
4. Make consumer targets depend on generated outputs.
5. Write outputs to isolated deterministic locations.
6. Remove stale outputs when inputs delete symbols/files.
7. Decide whether outputs are committed and enforce that policy.
8. Add drift detection when generated output is checked in.
9. Test clean and incremental generation.
10. Document regeneration and compatibility expectations.

## Decision points
Commit generated code when downstream users cannot run the generator or reviewability requires it; otherwise prefer build-time generation to reduce drift. Avoid generation during unrelated configuration phases.

## Common failure patterns
Unpinned generators, manually edited output, stale files after schema deletion, hidden network calls, non-deterministic ordering, and consumers reading a developer's old generated directory.

## Verification
Delete all generated outputs and rebuild; modify and delete schema elements; verify exact regeneration, consumer rebuilds, and no drift after repeated generation.

## Expected output
A deterministic generation target, ownership policy, stale-output handling, and verification evidence.

## Stop conditions
Stop if generator licensing/provisioning is unresolved or schema compatibility changes require external consumer approval.