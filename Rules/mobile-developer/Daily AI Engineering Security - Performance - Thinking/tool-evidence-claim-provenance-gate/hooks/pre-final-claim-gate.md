# Hook: Pre-final Claim Gate

## Trigger
Immediately before emitting a response containing claims classified as `retrieved` or `live`.

## Preconditions
`claims.json` and runtime-generated `evidence-ledger.json` exist.

## Action
Run `python3 scripts/claim_provenance_gate.py claims.json evidence-ledger.json --max-live-age-sec 300`.

## Expected result
Exit 0 / PASS with all evidence-required claims bound to successful, source-matching entries and live evidence inside the freshness window.

## Failure behavior
Exit 3 blocks finalization and allows one correction pass through `workflows/bind-correct-verify.md`. Exit 2 blocks due to invalid/unverifiable input.

## Blocking
Yes for unsupported completed-observation claims. The runtime may still answer by explicitly stating that retrieval/access was unavailable when that statement is accurate.