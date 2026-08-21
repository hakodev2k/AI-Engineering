# Engineering Rules

## MUST

1. MUST classify every tool as read-only/idempotent, repeatable-with-care, or side-effecting before loop policy is applied.
2. MUST canonicalize tool name and arguments before duplicate comparison.
3. MUST record an output digest for every completed tool call when output is available.
4. MUST distinguish exact repeat, near-duplicate strategy repeat, repeated failure, and productive repeat.
5. MUST enforce per-phase and global tool-call budgets.
6. MUST require an explicit strategy change after the warning threshold is reached.
7. MUST block a repeated call when the configured hard threshold is reached unless a deterministic exception rule allows it.
8. MUST preserve collected evidence in a recovery packet before a hard loop stop.
9. MUST emit metrics for calls attempted, warned, blocked, avoided, and recovered.
10. MUST treat a changed output digest as possible new information, not automatic proof of progress.
11. MUST require verification before retrying a tool after ambiguous transport failure when the tool can have side effects.
12. MUST use bounded retry counts.
13. MUST include the policy version in guard decisions.
14. MUST make block reasons observable to the orchestrator.
15. MUST allow legitimate polling only through an explicit polling policy with interval and maximum attempts.

## MUST NOT

1. MUST NOT automatically replay side-effecting tools after timeout or ambiguous failure.
2. MUST NOT rely only on raw JSON/string equality for duplicate detection.
3. MUST NOT treat a successful exit code as progress when the returned information is unchanged.
4. MUST NOT let the model override hard safety/performance limits merely by asking to continue.
5. MUST NOT use unlimited retries or unlimited polling.
6. MUST NOT discard useful evidence when stopping a loop.
7. MUST NOT suppress a tool call solely because the same tool name was previously used; arguments, phase, output novelty, and purpose matter.
8. MUST NOT apply identical thresholds to all tool classes.
9. MUST NOT classify newly discovered tools as harmless/idempotent by default.
10. MUST NOT claim performance improvement without before/after measurements.

## SHOULD

1. SHOULD warn before blocking benign read-only exploration.
2. SHOULD compare normalized command/search structure, not only exact arguments.
3. SHOULD reset local repetition counters after measurable phase progress.
4. SHOULD track evidence coverage so the agent knows what information is still missing.
5. SHOULD expose a recommended next action when a call is blocked.
6. SHOULD keep the guard deterministic and lightweight enough to run before every tool invocation.
7. SHOULD tune thresholds using traces from the target workload.
8. SHOULD maintain separate policies for exploration, implementation, test, and deployment phases.
9. SHOULD record false-positive overrides for later policy tuning.
10. SHOULD use idempotency keys or postcondition verification when external systems support them.

## Observable enforcement

| Rule | Check |
|---|---|
| Tool classification | Every registered tool has a class in policy/config |
| Canonical comparison | Decision log includes canonical fingerprint |
| Output novelty | Completed call log includes output digest and novelty status |
| Bounded loop | Per-family count never exceeds configured hard threshold |
| Strategy change | Warning decision records required change marker |
| Side-effect retry safety | Ambiguous side-effect failure returns `verify-before-retry` |
| Recovery | Hard block emits recovery packet path/content |
| Measurement | Benchmark report contains baseline and guarded metrics |