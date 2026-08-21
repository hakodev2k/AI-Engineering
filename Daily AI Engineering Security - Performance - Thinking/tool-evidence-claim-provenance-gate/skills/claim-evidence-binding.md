# Skill: Claim Evidence Binding

## Purpose
Bind claims of external/private/live access to observable successful tool or backend evidence rather than inference.

## Trigger
Before final output and whenever the draft contains claims equivalent to “I opened/read/found/saw/searched/checked/monitored” a source outside the current provided context.

## Inputs
Structured claims and an evidence ledger containing evidence ID, source type, operation, success state, timestamp, source identity/reference, and optional content hash.

## Preconditions
Evidence ledger is produced by the runtime/tool layer, not invented by the model. No hidden chain-of-thought is required.

## Allowed tools
Read-only evidence ledger, claim extractor/classifier, `claim_provenance_gate.py`.

## Constraints
MUST NOT fabricate evidence IDs. MUST distinguish user-provided content from tool-retrieved content. MUST require freshness for claims explicitly described as live/current/just checked.

## Procedure
1. Extract externally grounded claims from the proposed output.
2. Classify each as `knowledge`, `user-provided`, `retrieved`, `live`, `attempted`, or `inferred`.
3. For `retrieved`/`live`, require one or more evidence IDs.
4. Verify every referenced evidence entry exists and has `success=true`.
5. Verify source identity/type matches the claim.
6. For live claims, enforce configured maximum evidence age.
7. If evidence is missing/stale/failed, rewrite state to attempted/unavailable or block the unsupported claim.
8. Have an independent verifier inspect the final structured claim set.

## Decision points
PASS only when every evidence-required claim is bound to valid evidence. BLOCK unsupported completed-observation language. Inference MAY remain only when explicitly presented as inference rather than retrieved fact.

## Expected output
Claim verification JSON with claim IDs, evidence IDs, status, missing/stale/mismatched evidence, and permitted wording state.

## Metrics
Unsupported-claim rate, evidence coverage, stale-live-claim count, correction/rework rate, retrieval-failure honesty rate.

## Verification
Replay the gate using only the evidence ledger and structured claims. A verifier should be able to reach the same PASS/BLOCK decision deterministically.

## Failure handling
One rewrite attempt may convert unsupported completion language to accurate attempted/unavailable/inferred wording. If the claim remains unsupported, block it.

## Stop conditions
Missing runtime ledger, fabricated evidence identifier, source mismatch, or second failed rewrite.