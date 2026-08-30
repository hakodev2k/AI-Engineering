# Remote Execution Rules

## Purpose
Ensure remote build execution is correct, isolated, secure, observable, and operationally reliable.

## Scope
Applies to remote workers, schedulers, execution sandboxes, CAS interactions, action dispatch, retries, and fallback behavior.

## MUST
- Remote actions MUST execute from declared inputs in an isolated execution environment.
- Worker platform properties MUST be part of scheduling and compatibility decisions.
- Retry policy MUST distinguish infrastructure failure from deterministic action failure.
- Remote execution MUST expose queue time, execution time, transfer time, worker failures, and fallback rates.
- Fallback to local execution MUST preserve action semantics and MUST NOT hide systemic remote failures.

## MUST NOT
- MUST NOT retry deterministic compiler or test failures as if they were transient infrastructure faults.
- MUST NOT schedule an action on a worker whose platform or toolchain is incompatible with its declared requirements.
- MUST NOT permit remote workers to publish arbitrary undeclared outputs as trusted build results.

## SHOULD
- Worker pools SHOULD isolate materially different trust, platform, or resource classes.
- Large-input transfer SHOULD be reduced through deduplication and locality-aware scheduling where supported.

## Exceptions
Exceptions to worker isolation or scheduling constraints MUST document necessity, security impact, reliability impact, and approval.

## Verification
Inspect worker configuration, sandbox policy, scheduling properties, retry classification, remote/local parity tests, and operational metrics for queueing, failures, and fallback.