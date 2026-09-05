# Hook: Pre Change

## Trigger
Before editing logging, tracing, telemetry, serializers, exception handling, or request/response capture.

## Preconditions
Repository readable and policy present.

## Action
1. Identify affected sinks and current redaction utilities.
2. Validate that fixtures/samples are synthetic or sanitized.
3. Run the scanner on any existing representative output to establish baseline evidence.
4. Stop if evidence acquisition requires production secrets or elevated access.

## Expected result
Known baseline exposure state and safe test boundary.

## Failure behavior
Invalid policy or unsafe fixture source blocks execution. Transient tool failure retries at most twice.

## Blocking
Yes.