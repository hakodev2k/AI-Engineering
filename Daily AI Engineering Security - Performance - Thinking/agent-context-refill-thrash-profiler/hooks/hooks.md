# Hooks

## Pre-task instrumentation validation
**Trigger:** long-running or compaction-capable agent task starts.

**Action:** verify host can emit `turn`, `source`, `tokens`, compaction markers, static fingerprints and artifact IDs.

**Command:** validate one synthetic trace with `python scripts/context_refill_profiler.py tests/pass.jsonl --policy config/policy.json`.

**Expected result:** exit 0.

**Failure behavior:** do not claim context optimization metrics; fix instrumentation first.

## Post-compaction refill check
**Trigger:** after configured number of turns following each compaction.

**Action:** profile accumulated trace and enforce refill/source/duplicate budgets.

**Command:** `python scripts/context_refill_profiler.py trace.jsonl --policy config/policy.json --output refill-report.json`.

**Expected result:** exit 0 and status `PASS`.

**Failure behavior:** pause further automatic optimization/compaction decisions, inspect attributed source, run bounded mitigation workflow.

## Pre-compaction required-state check
**Trigger:** immediately before context compaction.

**Action:** ensure required tool/file state that may leave verbatim context has durable artifact IDs and a recovery path.

**Expected result:** zero missing required references.

**Failure behavior:** fail closed; preserve state or establish references before compaction.

## Post-change regression hook
**Trigger:** compaction/injection/retrieval policy changes.

**Action:** run pass/fail fixtures and representative task replay; compare quality plus token metrics.

**Expected result:** policy thresholds pass; fail fixture remains detectable; task suite does not regress.

**Failure behavior:** reject change and restore previous policy.

## Final verification hook
**Trigger:** before declaring a context optimization complete.

**Action:** verify baseline exists, before/after reports exist, task suite passes, required references are preserved, and retry count remained bounded.

**Failure behavior:** status remains Implemented or Measured, never Verified.
