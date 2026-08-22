# Retry and Flakiness Rules

## Purpose
Prevent retries from converting unreliable tests into misleading green builds.

## Scope
Applies to test retries, reruns, quarantine, flaky-test classification, and reliability metrics.

## MUST
- A retried pass after an initial failure MUST remain observable as reliability evidence.
- Flaky tests MUST have ownership, classification, and a remediation or removal decision.
- Retry policy MUST distinguish infrastructure transients from product assertions.
- Quarantined critical coverage MUST have replacement risk controls.

## MUST NOT
- MUST NOT treat retry success as equivalent to first-attempt success in reliability reporting.
- MUST NOT add retries solely to improve pass rate.
- MUST NOT leave flaky tests indefinitely without accountable follow-up.

## SHOULD
- Track first-attempt pass rate and flake frequency by test and cause.
- Prefer fixing synchronization, isolation, or environment causes before increasing retry count.

## Exceptions
Temporary retry expansion during a known transient incident requires bounded duration, owner, evidence, and rollback criteria.

## Verification
Review CI attempt histories, quarantine lists, flake metrics, issue ownership, and root-cause evidence.