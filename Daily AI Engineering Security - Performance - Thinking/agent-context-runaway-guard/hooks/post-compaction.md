# Hook: Post-compaction Headroom Gate

## Trigger
Immediately after an automatic or manual compaction/context-reduction step.

## Preconditions
A JSON/JSONL representation of the resulting context and reviewed budget config are available.

## Action
Profile the resulting context, then enforce post-compaction utilization, headroom, payload, duplicate, and frequency budgets.

## Commands
```bash
python scripts/profile_context.py context-after.jsonl --context-window 258400 --estimated-input-tokens <provider-count> --compactions <count> --turns <count> > profile-after.json
python scripts/check_budget.py --profile profile-after.json --budget config/budget.example.json --phase post
```
Omit `--estimated-input-tokens` only when actual provider usage is unavailable; the profiler then uses a rough character estimate that must not be presented as exact billing usage.

## Expected result
Exit code 0 from the budget checker and required-facts regression test passes in the host project.

## Failure behavior
Do not immediately compact again. Diagnose the retained payload. Permit at most one revised compaction attempt for the incident; otherwise create a verified fresh-context handoff or escalate.

## Blocking
Yes for automated continuation when headroom is below minimum or required facts were lost.
