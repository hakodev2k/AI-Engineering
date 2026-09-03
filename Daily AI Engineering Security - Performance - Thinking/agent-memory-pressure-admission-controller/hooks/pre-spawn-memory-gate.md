# Hook: Pre-spawn Memory Gate

## Trigger
Immediately before launching a material background agent, project worker, browser/computer-use process, local model/tool worker, or other memory-heavy child process.

## Preconditions
Current total/available-memory measurements and a policy with a conservative worker estimate are available.

## Action
Run the deterministic guard using platform-provided measurements:

```bash
python scripts/memory_admission_guard.py \
  --policy config/admission-policy.example.json \
  --total-bytes 17179869184 \
  --available-bytes 8589934592 \
  --json
```

On Linux, omit both explicit memory arguments to read `/proc/meminfo` automatically. If the decision is BLOCK, optionally reclaim eligible workers, await completion, remeasure, and retry at most `max_reclaim_retries` times.

## Expected result
`ADMIT` exits 0 and includes projected headroom; `BLOCK` exits 1 with reason codes. Invalid measurements/configuration exit 2.

## Failure behavior
Do not spawn when BLOCK or ERROR is returned. Queue/reject work with a visible reason. Never silently bypass the gate.

## Blocking
Yes.
