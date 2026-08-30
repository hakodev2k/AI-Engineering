# Hook: Pre-Dispatch Authorization Gate

## Trigger
Immediately after parsing a model tool-call request and before resolver lookup/callback invocation.

## Preconditions
Request authorization set is frozen; canonical alias map loaded; subject/tenant context validated.

## Action
Canonicalize the requested tool, compare it with the request-scoped authorized set, evaluate optional subject/tenant and approval predicates, then emit ALLOW or DENY.

## Script/command
For trace validation:
```bash
python scripts/verify_tool_dispatch.py traces.jsonl --policy config/policy.example.json
```
Production adapters should implement the same invariant in the framework dispatch path.

## Expected result
Authorized tool calls proceed. Unadvertised, cross-tenant, or approval-missing calls are denied before resolution/callback.

## Failure behavior
Fail closed with a stable reason code (`UNADVERTISED_TOOL`, `IDENTITY_MISMATCH`, `APPROVAL_REQUIRED`, `UNKNOWN_ALIAS`). Do not expose hidden registry contents to the model.

## Blocking
Yes. A failed authorization check blocks completion of the tool call and blocks release when reproduced in the regression corpus.
