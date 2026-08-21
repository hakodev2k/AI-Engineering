# Skill: Classify and Budget Evidence

## Purpose
Convert raw task evidence into a compact, auditable evidence bundle that preserves verification and reproduction value without loading every artifact into agent context.

## When to use
Use when a workflow has accumulated logs, diffs, test outputs, API responses, database plans, approvals, review artifacts, or research evidence that could exceed agent context or artifact budgets.

## Inputs
- Task identifier and repository revision when relevant.
- Claims that need evidence.
- Evidence metadata: source, observation time, content hash, storage reference, estimated context cost, importance, sensitivity, required claims.
- `config/evidence-retention-policy.json`.

## Preconditions
- Source evidence is stored durably enough for its task-specific retention requirement.
- Secret/credential content is not copied into the bundle.
- Hashes describe the exact source artifact referenced.

## Allowed tools
Read-only repository/log/artifact APIs, hashing tools, local filesystem metadata, deterministic scripts in `scripts/`.

## Constraints
- Never invent missing evidence metadata.
- Never call a claim verified merely because a summary exists.
- Never embed evidence classified `secret`, `credential`, or `personal-sensitive`.
- Never delete source evidence as part of context budgeting.

## Procedure
1. Enumerate the claims: fact, hypothesis, decision, executed, verified, blocked, or open.
2. For each claim, identify the minimal source artifacts that can prove or reproduce it.
3. Record each source once as an evidence item and map it to all relevant claim IDs.
4. Compute or obtain an exact SHA-256 hash of the referenced artifact.
5. Record a durable `storage_ref` rather than pasting the artifact by default.
6. Assign `importance` from task risk, not convenience.
7. Assign `sensitivity` before any context inclusion decision.
8. Estimate `context_cost_bytes` for full inclusion.
9. Add a short factual summary only when it can be traced back to the source artifact.
10. Run `scripts/validate-evidence-bundle.py`.
11. Run `scripts/apply-retention-policy.py`.
12. Inspect every mandatory item that fell back to summary/reference-only mode and confirm its source remains retrievable.
13. If the policy blocks due to stale mandatory evidence, refresh the source rather than extending freshness limits.
14. Hand off the validated bundle and retention plan to the Evidence Reviewer when critical evidence is present.

## Expected output
- Valid evidence bundle.
- Validation artifact with bundle fingerprint.
- Retention plan with deterministic inclusion modes and budget totals.

## Verification
- Bundle validation status is `verified`.
- Every `verified`/`blocked` claim references existing evidence IDs.
- Every retained decision contains hash + storage reference.
- Total estimated context bytes do not exceed policy.
- Sensitive classes never use `keep-full` or `keep-summary` when prohibited.

## Failure handling
- Missing source/hash/reference: block the affected claim.
- Transient artifact metadata failure: retry once maximum.
- Validation/policy failure: zero blind retries; fix metadata or refresh evidence.
- Budget overflow: rebudget at most two cycles; preserve mandatory references.

## Stop conditions
Stop when source evidence is unavailable, sensitive material would need to be embedded, mandatory evidence is stale, budget cannot preserve mandatory metadata, or a required approval/reviewer is unavailable.
