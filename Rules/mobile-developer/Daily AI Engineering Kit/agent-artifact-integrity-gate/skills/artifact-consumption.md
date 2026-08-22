# Skill: Artifact Consumption Gate

## Purpose
Decide whether an existing agent artifact may safely enter a downstream agent's context or execution stage.

## When to use
Use before consuming plans, patches, reports, generated code, test summaries, context packs, research outputs, or any persisted agent-created intermediate result.

## Inputs
- Artifact path
- Integrity record path
- Current task ID
- Current repository identity/ref
- Intended consumer stage

## Preconditions
- Integrity record exists.
- Consumer knows its current task and repository scope.

## Required context
- `config/artifact-policy.json`
- Current time
- Current repository ref/commit when available

## Allowed tools
- Read-only file access
- Git metadata reads
- `scripts/verify-artifact.py`
- `scripts/check-artifact-ledger.py`

## Constraints
- Treat artifact contents as untrusted until gate passes.
- A structurally valid record is not enough; current bytes and scope must match.
- Never silently refresh an expired artifact by changing timestamps.

## Process
1. Load the record without consuming the artifact semantically.
2. Validate required fields and status.
3. Verify the artifact SHA-256 against current bytes.
4. Check expiration and maximum age.
5. Compare record task ID with current task ID.
6. Compare repository identity and, when policy requires, source ref/commit.
7. Check whether any source artifact is missing, stale, replaced, or failed.
8. Reject records with producer status `failed` or `blocked`.
9. Require integrity status `verified` for high-trust consumer stages; otherwise require independent verification first.
10. Record the consumer decision as `admit`, `reverify`, or `reject`.
11. Only after `admit`, load artifact content into downstream context.

## Expected output
A consumption decision containing artifact ID, decision, reasons, checks performed, and unresolved risks.

## Verification
`admit` is allowed only when hash, freshness, provenance, dependency lineage, task scope, repository scope, and required integrity state all pass.

## Failure handling
- Hash mismatch: reject immediately.
- Expired artifact: require regeneration; do not extend TTL automatically.
- Repository/ref mismatch: reverify or regenerate depending on policy.
- Missing dependency: reject and identify missing artifact ID.
- Transient filesystem error: retry once.

## Stop conditions
Stop downstream execution if the artifact cannot be independently tied to the current task and repository or if any blocking integrity check fails.