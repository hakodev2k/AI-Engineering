# Timeout Budget Investigation

## Purpose
Find where an end-to-end request budget is lost across HTTP boundaries and distinguish true downstream slowness from retries, queueing, DNS/connect/TLS delay, or missing cancellation propagation.

## When to use
Use for requests that exceed their caller SLA, hang after caller cancellation, or show inconsistent timeout behavior across services.

## Inputs
- Entry endpoint or background operation
- Expected end-to-end deadline
- Relevant service/client code
- Logs/traces when available

## Preconditions
Repository can be read and the target call chain is identifiable.

## Allowed tools
Repository search, test runner, tracing/log queries, deterministic scripts in this package. Production mutation is not allowed.

## Process
1. Identify the request entry point and its externally visible SLA.
2. Trace every synchronous and asynchronous downstream HTTP call in execution order.
3. Record configured client timeout, per-call timeout, cancellation token, retry count, and any deadline header.
4. Compute the maximum theoretical duration including retry attempts and backoff.
5. Mark any child timeout that can exceed its parent remaining budget.
6. Mark calls that do not receive the caller cancellation token.
7. Check whether retries can start when remaining time is below `minimum_downstream_budget_ms`.
8. Correlate traces/logs with the call graph and separate facts from hypotheses.
9. Run `python scripts/timeout_budget_gate.py --root <repo> --policy config/policy.yaml --out timeout-budget-report.json`.
10. Produce findings with file, line, evidence, risk, and recommended remediation.

## Expected output
A bounded call-chain model plus confirmed violations and unresolved hypotheses.

## Verification
Every confirmed finding must point to code or runtime evidence. The theoretical worst-case duration must be reproducible from configuration.

## Failure handling
If traces are unavailable, report static conclusions separately and reduce confidence. Do not invent latency evidence.

## Stop conditions
Stop when the entry SLA, downstream timeout chain, cancellation propagation, and retry budget are all known or when a required artifact is inaccessible.
