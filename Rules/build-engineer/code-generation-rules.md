# Code Generation Rules

## Purpose
Ensure generated source and metadata remain deterministic, reviewable, and safely integrated into builds.

## Scope
Applies to schema generators, API clients, source generators, asset pipelines, compiler plugins, and generated configuration.

## MUST
- Generators MUST have explicit versioned inputs and tool versions.
- Generated outputs MUST be reproducible from committed source inputs.
- Generator changes that affect public APIs or serialized formats MUST receive compatibility review.
- CI MUST detect stale committed generated files when the project stores generated outputs in source control.
- Generated code MUST meet security and correctness requirements equivalent to handwritten code.

## MUST NOT
- MUST NOT hand-edit generated files unless the generation contract explicitly supports preserved regions.
- MUST NOT hide generator failures by silently retaining stale outputs.
- MUST NOT execute untrusted generators with unnecessary privileges.

## SHOULD
- Generation SHOULD occur in a clearly separated build phase.
- Large generated diffs SHOULD be accompanied by source-input changes that explain them.

## Exceptions
Exceptions require documented generator limitations, a controlled patching process, regeneration evidence, and ownership for future maintenance.

## Verification
Regenerate from clean inputs, compare diffs, inspect generator versions, run compatibility tests, and verify CI freshness checks.