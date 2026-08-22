# Integration Guide

## Integration objective
Insert a structured operational checkpoint around any compaction, summary replacement, agent handoff, or session restore boundary. The checkpoint is not a replacement for narrative summarization; it is a small machine-checkable companion that preserves execution invariants.

## Host lifecycle

### 1. Before compaction
1. Collect current task state from authoritative sources.
2. Build `.agent-state/checkpoint.json` using the schema implied by `config/policy.json` and the example fixture.
3. Increment `meta.generation`.
4. Run:

```bash
python scripts/context_checkpoint_guard.py .agent-state/checkpoint.json --policy config/policy.json
```

Do not start compaction unless validation passes. Hosts that cannot defer platform-managed compaction should capture checkpoints periodically before the expected threshold.

### 2. During compaction
Allow the model/platform to summarize narrative context. Do not require the summary to duplicate large logs, source files, or tool output already referenced by durable evidence IDs.

### 3. After compaction
Re-inject a compact operational block containing:
- task ID/objective/constraints;
- current and completed stages;
- next action;
- facts with evidence pointers;
- unresolved assumptions;
- changed files;
- test outcomes;
- active resource IDs/status;
- pending approvals;
- retry counters and stop conditions;
- blockers/failures.

Then reconcile dynamic items against authoritative current state. A valid old checkpoint is necessary but not sufficient when resources or repository state can change externally.

## Checkpoint shape
Use JSON so deterministic hooks can validate it. A recommended shape is:

```json
{
  "task": {"id":"T-1","objective":"...","constraints":["..."]},
  "state": {"completed_stages":[],"current_stage":"implement","next_action":"run targeted tests","failures":[]},
  "evidence": {"facts":[{"statement":"...","evidence":"git:abc123"}],"assumptions":[]},
  "execution": {"changed_files":[],"tests":[],"active_resources":[]},
  "control": {"pending_approvals":[],"retry_counters":{},"stop_conditions":["..."]},
  "meta": {"generation":1,"created_at":"2026-08-21T21:00:00+07:00"}
}
```

## Evidence pointers
Prefer stable references over copied content:
- `git:<sha>` or `file:<path>@<sha>`
- `test:<run-id>`
- `tool:<call-id>`
- `issue:<id>`
- `resource:<opaque-id>`

If evidence cannot be re-opened later, label the fact provisional rather than pretending the pointer is durable.

## Secrets
Never serialize credential values into checkpoints. Store resource names or secret-manager handles only. Customize `forbidden_key_fragments` for organization-specific names.

## Approval integration
For high-risk actions, the checkpoint may record approval metadata such as approval ID, scope, status, and expiry, but not signatures/tokens. On resume, resolve the approval against the authoritative approval system; stale checkpoint text cannot authorize an action.

## Retry integration
Any loop that existed before compaction must expose its counter and maximum in `control.retry_counters`/`control.stop_conditions`. This prevents compaction from resetting attempts and creating unbounded loops.

## Testing integration
Add `tests/test_context_checkpoint_guard.py` to CI. Also maintain scenario-level replay tests that force compaction/handoff between implementation and verification stages.

## Customization
- Add required fields to `config/policy.json` for domain-specific invariants.
- Tighten `max_checkpoint_bytes` after measuring representative tasks.
- Add active-resource types such as browser session, cloud deployment, PR, database transaction, subagent/team, build job, or remote shell.
- Keep optional narrative fields outside the required-field list so stylistic changes do not break execution.

## Rollout
1. Observe-only: generate checkpoints and measure missing fields without blocking.
2. Gate resume for test/sandbox tasks.
3. Enable high-risk action gate.
4. Enable full post-compaction resume gate after false-blocking cases are resolved.
5. Track continuity errors, duplicate work, recovery calls, and checkpoint size over time.
