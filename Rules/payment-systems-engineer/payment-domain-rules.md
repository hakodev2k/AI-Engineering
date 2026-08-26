# Payment Domain Rules

## Purpose
Establish correct, reviewable handling of payment concepts and lifecycle states.

## Scope
Applies to payment intents, authorizations, captures, settlements, refunds, reversals, disputes, and related state transitions.

## MUST
- Payment lifecycle states MUST be modeled explicitly; implicit state inferred from unrelated fields is not sufficient.
- Every state transition MUST define its valid predecessor states, triggering event, persisted evidence, and failure behavior.
- Monetary amounts MUST carry currency context and MUST use exact decimal or integer-minor-unit representations.
- External provider states MUST be translated into stable internal domain states through an explicit mapping layer.
- Business rules that change financial outcome MUST be test-covered with representative success, decline, retry, reversal, and duplicate scenarios.

## MUST NOT
- MUST NOT treat authorization, capture, settlement, and payout as equivalent events.
- MUST NOT use floating-point arithmetic for monetary values.
- MUST NOT derive irreversible financial conclusions from undocumented provider behavior.

## SHOULD
- Domain terminology SHOULD match industry-standard payment language where possible.
- State machines SHOULD reject impossible transitions rather than silently normalize them.

## Exceptions
Any exception requires documented provider behavior, business justification, financial risk analysis, and reviewer approval.

## Verification
Review state diagrams, transition guards, tests, persisted event history, and provider mapping code. Trace at least one successful and one failure path end-to-end.