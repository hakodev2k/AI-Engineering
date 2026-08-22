# Capture Contract Baseline

## Purpose
Create an auditable baseline of public contracts before a change is evaluated.

## When to use
Use before modifying REST/OpenAPI endpoints, DTOs, serialized payloads, public C# APIs, SDK contracts, webhook schemas, or event/message contracts.

## Inputs
- Repository root
- Contract source paths
- Baseline ref/tag/commit
- Contract types in scope
- Existing compatibility policy

## Preconditions
- Repository is readable.
- Baseline ref is immutable or recorded by commit SHA.
- Generated contracts are reproducible.

## Allowed tools
Repository search, git diff/show, build/export commands, OpenAPI generation, reflection/metadata inspection, test execution.

## Constraints
- Do not infer a baseline from memory.
- Do not overwrite a previously verified baseline without recording the new source ref.
- Do not include secrets or environment-specific values.

## Process
1. Identify public contract surfaces: routes, methods, status codes, request/response fields, enums, serialized names, public types/members, events/webhooks.
2. Resolve the exact baseline commit SHA.
3. Export or collect baseline contract artifacts into deterministic JSON/text.
4. Normalize ordering and unstable metadata.
5. Record provenance: source ref, generator/tool, generated timestamp, paths, hashes.
6. Validate artifacts using `scripts/validate-contract-manifest.py`.
7. Store baseline artifacts outside generated build folders or attach them to CI artifacts.
8. Mark state `baseline-captured`; do not mark `verified` until an independent reviewer/gate validates provenance.

## Expected output
A contract manifest following `schemas/contract-manifest.schema.json` plus baseline artifacts referenced by path and SHA-256.

## Verification
- Baseline commit SHA exists.
- Every artifact exists and hash matches.
- Contract types and source paths are explicit.
- Generated content is deterministic across two runs when feasible.

## Failure handling
Retry a transient generator/tool failure once. If output differs across repeated generation without source changes, stop and report nondeterminism.

## Stop conditions
Stop if baseline ref cannot be resolved, source contracts cannot be generated, or contract provenance is ambiguous.
