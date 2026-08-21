# Skill: Cache Hit Verification

## Purpose
Prove that a proposed semantic cache hit is safe, isolated, fresh, and behaviorally equivalent enough to reuse.

## Inputs
Request contract, candidate entry, policy, similarity score, context hashes, test evidence.

## Process
1. Validate required request fields.
2. Apply bypass checks before examining candidates.
3. Verify exact isolation dimensions and entry age.
4. Recompute similarity with the deterministic gate.
5. Confirm candidate response has no side effects or context-specific secrets.
6. Run adversarial tests for cross-tenant, changed scope, changed model/system/toolset/schema, mutation intent, secrets and PII.
7. Compare observed decision with policy expectation.
8. Inspect changed files for unintended policy broadening.
9. Produce status `verified`, `rejected`, or `blocked` with evidence.

## Verification
A hit is verified only when all exact dimensions match, threshold and TTL pass, no bypass condition applies, and adversarial fixtures cannot obtain an unsafe hit.

## Failure handling
A validation mismatch is not retryable. Transient command/tool failures may be retried twice. Repeated failures stop verification and preserve evidence.

## Stop conditions
Any cross-boundary hit, sensitive-data cacheability, side-effect request, unexplained policy change, or failed test blocks completion.
