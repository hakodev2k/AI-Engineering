# Hook: Pre-Context Browser Observation

## Trigger
Before a browser DOM snapshot, screenshot, accessibility tree, or equivalent observation is appended to model-visible context.

## Preconditions
Observation metadata can be serialized as one JSONL event; per-event and task budgets are configured.

## Action
Feed the candidate event and recent admitted observation history to `scripts/observation_budget.py`.

## Expected result
The report classifies the candidate as unique/duplicate and within/over budget. Duplicate non-required full observations should be referenced rather than re-appended; oversized non-required full observations should be replaced by a targeted/delta request.

## Failure behavior
Profiler failure does not justify deleting required evidence. Fall back to normal observation admission, record the failure, and block any claim of token optimization until measurement is restored.

## Blocking
Blocks optimization claims, not correctness-critical browser execution. `required_full=true` is always eligible for explicit budget escalation.
