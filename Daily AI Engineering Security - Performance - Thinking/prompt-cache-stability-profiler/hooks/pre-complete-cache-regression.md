# Hook — Pre-complete Cache Regression Check

## Trigger
Before completing a change that modifies agent system prompts, tool schemas, skills/plugins, hooks, conversation serialization, or cache breakpoint placement.

## Preconditions
Sanitized baseline and current request dumps exist; static segment paths are configured.

## Action
Run the cache stability profiler, compare declared-static segment fingerprints, and fail when accidental drift exceeds policy.

## Script or command
`python scripts/cache_stability_profiler.py compare --baseline baseline.json --current current.json --static system tools --fail-on-drift`

## Expected result
Exit 0 when all declared-static segments match; exit 2 when drift is detected; exit 1 for malformed input/internal error.

## Failure behavior
Block completion and emit only segment/path/hash metadata, never raw prompt content.

## Blocks completion
Yes for unexplained declared-static drift. Intentional changes require an explicit baseline update reviewed separately.
