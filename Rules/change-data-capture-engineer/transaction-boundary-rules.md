# Transaction Boundary Rules

## Purpose
Preserve atomic source changes when downstream behavior depends on transaction semantics.

## Scope
Commit boundaries, multi-row changes, transaction metadata, buffering, and publication.

## MUST
- Transaction commit status MUST be known before uncommitted changes are published as committed state.
- Multi-event transaction metadata MUST be preserved when consumers require atomic reconstruction.
- Rollbacks MUST NOT produce committed downstream mutations.
- Large transactions MUST have bounded buffering and operational safeguards.
- Transaction identifiers MUST be treated as scoped identifiers, not universally unique unless guaranteed.

## MUST NOT
- MUST NOT expose uncommitted database state as final CDC state.
- MUST NOT split transactions in ways that violate documented consumer atomicity requirements.
- MUST NOT discard commit metadata required for deterministic reconciliation.

## SHOULD
- Publish transaction boundary markers when useful for consumers.
- Load-test unusually large transactions.

## Exceptions
Consumers that explicitly tolerate non-atomic application may use weaker semantics with documented evidence.

## Verification
Run rollback tests, multi-row transaction tests, large-transaction tests, and inspect emitted metadata.