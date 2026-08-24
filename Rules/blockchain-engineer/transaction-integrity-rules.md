# Transaction Integrity

## Purpose
Ensure transactions produce intentional, bounded, and verifiable state changes.

## Scope
Transaction construction, signing, submission, confirmation, replay handling, and state-transition semantics.

## MUST
- Bind signed transactions to the intended chain, contract, operation, parameters, and replay domain where applicable.
- Validate nonce, expiry, value, recipient, and authorization assumptions before signing or submitting.
- Treat submission and confirmation as separate states.
- Make duplicate submission safe or explicitly detectable.
- Record transaction identifiers needed for operational reconciliation.

## MUST NOT
- Equate RPC acceptance with final execution.
- Blindly retry non-idempotent transactions.
- Sign opaque or incompletely decoded payloads in privileged automation.

## SHOULD
- Use explicit state machines for pending, replaced, confirmed, reverted, and finalized transactions.

## Exceptions
Alternative confirmation models require documented chain semantics and failure handling.

## Verification
Test replay, replacement, revert, duplicate submission, reorganization, and timeout scenarios; inspect signed payload decoding and reconciliation logs.