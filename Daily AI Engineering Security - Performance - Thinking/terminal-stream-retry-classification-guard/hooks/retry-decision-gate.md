# Hook — Retry Decision Gate

## Trigger
After every normalized model-stream/transport outcome and before issuing another attempt or changing transport.

## Preconditions
Event kind is normalized; current attempt, cumulative retry wait, transport and configured budgets are available.

## Action
Call the centralized classifier and obey its action instead of allowing another layer to independently retry.

## Script/command
`python scripts/retry_classifier.py <event> --attempt <n> --cumulative-wait <seconds> --max-attempts <n> --max-wait <seconds> --transport <websocket|https> [--retry-after <seconds>]`

## Expected result
JSON with `action` = STOP, RETRY, or FALLBACK; bounded delay and updated counters. Known terminal states always return STOP with zero delay.

## Failure behavior
Classifier input/error (exit 2) blocks automatic retry and surfaces the outcome for explicit handling. RETRY (CLI exit 10) is only a scheduling signal; the host must use the returned bounded delay and preserve the logical turn ID.

## Blocks completion
Yes when an implementation attempts to retry a STOP result or exceeds attempt/wall-clock budgets. Such a run cannot be marked Verified.
