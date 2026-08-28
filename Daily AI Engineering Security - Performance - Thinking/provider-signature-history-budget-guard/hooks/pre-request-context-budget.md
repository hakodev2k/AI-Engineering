# Hook: Pre Request Context Budget

## Trigger
Immediately before serializing/sending a model request containing provider-specific signature metadata.

## Preconditions
History has provider/model provenance and active-loop markers; `config/policy.json` matches the target provider contract.

## Action
Run:

`python scripts/signature_budget_guard.py --input <history.json> --policy config/policy.json`

Use the emitted `transformed` history only when the decision is `allow`.

## Expected result
Required active signatures remain unchanged, optional metadata stays within budget, archival signatures are removed from outbound context, and the result reports before/after signature-byte metrics.

## Failure behavior
Exit `3` blocks the request for missing/oversized mandatory signature state. Exit `2` blocks malformed input/policy. Do not retry unchanged payloads.

## Blocking
Yes for protocol compliance and mandatory-context overflow. A block MUST NOT be bypassed by deleting required signatures.
