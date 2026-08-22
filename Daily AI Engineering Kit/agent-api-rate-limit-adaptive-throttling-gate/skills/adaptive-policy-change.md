# Adaptive Policy Change

## Purpose
Apply a bounded, evidence-based rate-limit policy change without creating retry storms or masking permanent failures.

## When to use
Use after investigation has confirmed throttling or burst pressure and a code/config change is justified.

## Inputs
Confirmed finding, current policy, provider limits, affected call path, tests, and acceptance criteria.

## Preconditions
A reproducible failure pattern exists. The change does not require production quota changes or bypassing controls.

## Process
1. Snapshot current retry, timeout, and concurrency behavior.
2. Keep permanent errors non-retryable.
3. Prefer `Retry-After` when valid; otherwise exponential backoff with jitter.
4. Cap attempts at 4 and total wait at 90 seconds unless a stricter project limit exists.
5. Reduce concurrency on throttling and increase only after a sustained success window.
6. Avoid multiplying retries across nested HTTP/client/job layers.
7. Update configuration before adding provider-specific code unless provider semantics require it.
8. Add or update tests for success, 429 recovery, non-retryable errors, retry exhaustion, and delay caps.
9. Run tests and inspect the diff for unrelated changes.
10. Hand off to an independent verifier.

## Expected output
Smallest safe implementation/config diff plus test evidence.

## Verification
All deterministic tests pass; retries remain bounded; permanent errors stop immediately; concurrency never leaves configured min/max bounds.

## Failure handling
If a change increases total request volume, retry amplification, or latency beyond the budget, revert the candidate and preserve evidence.

## Stop conditions
Stop for provider quota changes, production configuration changes, or a proposed bypass of rate-limit controls until explicit approval exists.
