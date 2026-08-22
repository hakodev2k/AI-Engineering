# ML Testing Strategy

## Purpose
Protect ML systems against code, data, model, and integration regressions that ordinary unit tests miss.

## When to use
When productionizing training or inference pipelines and before material changes.

## Inputs
Pipeline code, schemas, model contracts, golden examples, historical incidents, acceptance thresholds.

## Context to inspect
Deterministic logic, statistical components, external data dependencies, serving interfaces, invariants, known failure modes.

## Core knowledge
ML tests span deterministic assertions and statistical expectations. Avoid brittle exact-output assertions for stochastic models unless determinism is guaranteed.

## Procedure
1. Unit-test transformations and domain logic.
2. Add schema and data-invariant tests.
3. Create small golden datasets for pipeline integration.
4. Test train-serving preprocessing parity.
5. Add model-quality regression thresholds against baselines.
6. Test serialization and model loading compatibility.
7. Exercise missing, extreme, malformed, and sparse inputs.
8. Test deployment smoke and rollback paths.
9. Keep expensive tests in appropriate CI stages.

## Decision points
Use exact assertions for deterministic stages and tolerance/distribution assertions for statistical behavior. Prefer small representative fixtures over production-sized CI data.

## Common failure patterns
Testing only Python functions, asserting exact floating-point predictions unnecessarily, no data-contract tests, and quality tests that silently use changed datasets.

## Verification
Intentional defects in data, transformation, model artifact, and serving contract are caught by the appropriate test layer.

## Expected output
A layered ML regression suite with clear ownership and thresholds.

## Stop conditions
Block release when critical contracts or model-quality gates fail without approved rationale.