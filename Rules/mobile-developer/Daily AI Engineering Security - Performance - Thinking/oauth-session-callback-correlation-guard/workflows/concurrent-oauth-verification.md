# Workflow: Concurrent OAuth Correlation Verification

## Trigger
OAuth is available from more than one concurrent task/window/instance or a callback mismatch/miscorrelation is reported.

## Goal
Prove every callback mutates only the session that initiated its transaction.

## Inputs
Flow-start API, callback handler, transaction store, session store, issuer/provider configuration, test identities.

## Baseline
Measure concurrent-flow success rate, state mismatches, orphan flows, callback target-session accuracy, replay acceptance, and callback latency.

## Stages
1. **Observe** — map trust boundaries and transaction/session lifecycle.
2. **Measure** — run two-flow tests A→B and B→A plus simultaneous completion.
3. **Diagnose** — identify singleton/active-session/last-writer routing or non-atomic consumption.
4. **Hypothesize** — callback must resolve immutable transaction by state before any session lookup/mutation.
5. **Implement** — transaction registry + atomic consume + issuer/session checks.
6. **Measure again** — rerun race matrix, expiry, replay, unknown-state, deleted-session cases.
7. **Verify** — independent agent reviews logs and implementation.

## Checkpoints
After transaction creation, after callback state lookup, before consume, before token/session commit, after commit.

## Metrics
Wrong-session commits = 0; replay accepts = 0; unknown/expired accepts = 0; successful concurrent flows >= baseline; orphan transactions age out deterministically.

## Retry policy
No callback retry after a consumed state. One clean restart of the test environment is allowed for infrastructure failure. Maximum two implementation iterations before escalation.

## Failure path
Any ambiguous state/session binding rejects the callback and records an audit-safe reason. No partial session mutation is allowed.

## Stop conditions
All verification cases pass or a blocking identity/transaction ambiguity remains.

## Definition of Done
Current evidence documented; transaction binding implemented; race matrix passes; replay/expiry/issuer/session tests pass; no credentials logged; independent verification complete.