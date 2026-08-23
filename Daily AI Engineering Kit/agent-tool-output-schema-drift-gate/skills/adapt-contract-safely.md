# Adapt a Tool Contract Safely

## Purpose
Change an agent-side adapter after verified tool schema drift without spreading provider-specific assumptions through core workflow logic.

## Inputs
Validated drift report, current adapter/parser, fixtures, acceptance criteria, and provider documentation when available.

## Preconditions
The drift is reproduced from evidence. Any change that weakens validation or changes a public API requires explicit human approval.

## Procedure
1. Locate the narrowest provider/tool adapter that owns response normalization.
2. List old and new field shapes and classify compatibility.
3. Define one canonical internal representation.
4. Reject ambiguous values instead of inventing defaults.
5. Implement the smallest adapter change.
6. Add a fixture for the new response and retain the previous fixture unless support is intentionally dropped.
7. Run `python scripts/run-contract-tests.py`.
8. Run `python scripts/inspect-changes.py` and inspect all changed paths.
9. Hand the result to the Verification Agent; the implementer cannot self-certify completion.

## Expected output
A minimal adapter change plus fixtures proving accepted old/new shapes and rejected invalid shapes.

## Verification
All contract tests pass and the normalized output validates against the canonical schema.

## Failure handling
After two implementation/test attempts, stop with preserved test output and unresolved incompatibilities.

## Stop conditions
Stop before breaking contracts, disabling validation, adding broad permissive parsing, or changing production configuration without approval.