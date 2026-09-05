# Workflow: Embedding Index Compatibility

## Trigger
Embedding model/provider/dimension/normalization/chunking/index/metric configuration changes.

## Stages
1. **Discover** — Embedding Explorer maps generation/query paths.
2. **Baseline** — capture current manifest and sample evidence.
3. **Candidate** — capture proposed manifest.
4. **Gate** — run `scripts/check_embedding_compat.py`.
5. **Compatible path** — run sample vector checks and host tests.
6. **Breaking path** — Reindex Planner creates new-generation rebuild plan.
7. **Approval checkpoint** — stop before production reindex/cutover/destructive or paid high-cost actions.
8. **Rebuild** — implementation owner builds new generation.
9. **Completeness** — verify source/vector counts and samples.
10. **Re-gate** — compare manifests with completed generation.
11. **Independent verification** — Verification Agent reviews evidence.
12. **Complete** — only when Definition of Done passes.

## Retry rules
Transient metadata/provider reads: max 2. Reindex fix cycles: max 2. Permission/approval failures: no automatic retry.

## Failure paths
Unknown model identity, mixed generations, partial rebuild, failed samples, or missing rollback path block completion.

## Definition of Done
Compatible manifest or full new-generation rebuild; vector shape/norm checks pass; known corpus fully indexed; host tests/build pass; independent status `verified`; no pending approval action.
