# Payment State Machine Rules

## Purpose
Keep payment lifecycle transitions explicit, legal, recoverable, and auditable.

## Scope
Created, pending, authorized, captured, failed, cancelled, refunded, disputed, and provider-specific states.

## MUST
- Payment states MUST have defined legal transitions and terminal-state semantics.
- Provider status changes MUST be mapped explicitly to internal states.
- Unexpected or out-of-order events MUST be handled without regressing authoritative state.
- Every transition MUST retain evidence of its trigger and timestamp.

## MUST NOT
- MUST NOT infer success from HTTP success alone when the provider reports asynchronous completion.
- MUST NOT overwrite a terminal financial state with an older event.
- MUST NOT collapse materially different states when downstream behavior depends on the distinction.

## SHOULD
- Encode transition validation centrally rather than duplicating it across handlers.

## Exceptions
Require documented provider behavior, transition rationale, risk, and tests.

## Verification
Use state-transition tests, replay out-of-order events, and inspect audit history for illegal transitions.