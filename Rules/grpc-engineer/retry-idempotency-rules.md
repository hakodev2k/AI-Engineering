# Retry and Idempotency Rules

## Purpose
Prevent retry storms, duplicate side effects, and ambiguous outcomes.

## Scope
Client retries, service-config retry policies, hedging, mutating RPCs, and downstream calls.

## MUST
- Retries MUST be limited to failures proven transient and operations safe to repeat.
- Mutating operations that may be retried MUST provide idempotency semantics or deduplication.
- Retry policies MUST define attempt limits, backoff, jitter, and deadline interaction.
- Ambiguous commit outcomes MUST be handled explicitly.
- Retry load amplification MUST be considered in capacity and incident analysis.

## MUST NOT
- MUST NOT retry permanent validation, authentication, authorization, or semantic failures.
- MUST NOT stack independent retry loops across layers without calculating the resulting attempt multiplication.
- MUST NOT enable hedging for side-effecting operations without a correctness proof.

## SHOULD
- Prefer retry ownership at one well-defined layer.
- Idempotency keys SHOULD have bounded retention aligned with retry windows.

## Exceptions
Any non-idempotent retry requires documented duplicate-risk controls and senior approval.

## Verification
Inject transient failures, inspect attempt counts and backoff, test duplicate requests, and measure behavior under dependency degradation.