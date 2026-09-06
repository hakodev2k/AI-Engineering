# Hook: Post Stream Event Check

## Trigger
After normalizing each provider stream event.
## Preconditions
Monotonic timestamp and event kind available; task start/deadlines recorded.
## Action
Update transport clock for every event; update semantic clock only for configured semantic kinds; evaluate semantic and overall budgets.
## Script/command
For offline validation: `python scripts/semantic_progress_watchdog.py "$TRACE" --semantic-timeout-ms 30000 --overall-timeout-ms 300000`.
## Expected result
Progressing traces exit 0; stalled traces exit 2 with reason/timestamp.
## Failure behavior
Malformed/non-monotonic traces exit 3 and block performance verification.
## Blocking
Yes for verification; runtime integration should route a stall to bounded recovery rather than silently continue.