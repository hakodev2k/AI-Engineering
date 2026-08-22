# Skill: Prune Context Without Losing Proof

## Purpose
Reduce active agent-context evidence while preserving verifiability, auditability, reproducibility, and safe recovery.

## When to use
Use after evidence collection, before agent handoff, before long-running workflow checkpoints, or when context pressure risks forcing unstructured truncation.

## Inputs
- Validated evidence bundle.
- Current retention plan.
- Current task claims and workflow stage.
- Retention policy.

## Preconditions
- Source evidence remains available at its `storage_ref`.
- Hashes and fingerprints are current.
- No approval-required deletion is being performed.

## Procedure
1. Treat context removal and source deletion as different actions. This skill changes only context representation.
2. Keep `secret`, `credential`, and `personal-sensitive` evidence reference-only.
3. Preserve full critical/high evidence when budget permits and policy allows embedding.
4. Preserve concise traceable summaries for medium evidence when full content adds little decision value.
5. Convert low-value duplicate or historical context to reference-only.
6. Never exclude minimum metadata for evidence required by a `verified` or `blocked` claim.
7. Preserve the exact source hash so a later agent can detect changed evidence.
8. When a summary is used, keep source reference and hash beside it.
9. Re-run `apply-retention-policy.py` after any claim, evidence, sensitivity, source, or importance change.
10. If critical evidence is present, obtain independent review before final gate.
11. Before a handoff, ensure the receiving agent gets the bundle fingerprint and retention fingerprint.
12. At task completion, keep the durable bundle/plan according to repository policy; do not automatically purge source evidence.

## Expected output
A bounded retention plan where each evidence item is `keep-full`, `keep-summary`, `reference-only`, or `exclude-context`, with reasons and fingerprints.

## Verification
- Final gate returns `verified`.
- Mandatory evidence remains re-fetchable and hash-bound.
- No prohibited sensitivity class is embedded.
- No verified claim depends only on untraceable prose.
- Context budget is respected.

## Failure handling
If source evidence has disappeared, hash changed, or mandatory evidence cannot fit even as metadata, block and preserve the failed plan. Do not fabricate a summary from memory.

## Stop conditions
Stop before source deletion, audit-log purge, retention-policy weakening, or any action listed in `approval_required_actions` unless explicit human approval is present.
