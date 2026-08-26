# Transaction Monitoring Rules

## Purpose
Detect suspicious transaction behavior with correct temporal, monetary, and entity context.

## Scope
Payments, transfers, purchases, withdrawals, refunds, and other value-moving events.

## MUST
- Monitoring MUST use canonical amounts, currencies, timestamps, transaction states, and entity identifiers.
- Velocity logic MUST define window semantics and behavior for retries, reversals, duplicates, and late events.
- Controls MUST distinguish attempted, authorized, settled, reversed, and disputed activity where relevant.
- Material anomalies MUST be traceable to underlying events.

## MUST NOT
- MUST NOT double-count retries or duplicated events as independent risk without explicit intent.
- MUST NOT compare monetary values across currencies without correct normalization.

## SHOULD
- Behavioral baselines SHOULD account for seasonality and customer context where supported by evidence.

## Exceptions
Require documented event semantics, rationale, and validation.

## Verification
Replay transaction histories, test edge states, reconcile counts and amounts, inspect event lineage, and review production alerts.