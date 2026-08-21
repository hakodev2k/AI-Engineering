# Integration Guide — Lossless Agent Context Checkpointing

> File name intentionally follows the package convention requested by the scheduled job: `guide-intergration.md`.

## 1. Integration goal

Add a durable operational-state layer around an existing coding agent, AI workflow, or multi-agent orchestrator. The layer is independent of the model provider’s own compaction mechanism.

It solves a specific problem: transcript compaction may reduce tokens, but the application still needs a small, explicit, verifiable record of what must survive across compaction, restart, resume, or model handoff.

The package does **not** replace OpenAI Responses compaction, Claude Code `/compact`, or another platform feature. It adds a pre/post protocol:

```text
measure budget
  -> checkpoint observable task state
  -> externalize large durable outputs
  -> verify checkpoint
  -> invoke provider/platform compaction
  -> validate resume state
  -> continue or recover
```

## 2. Required components

Integrate these files:

- `config/checkpoint-policy.json` — thresholds and invariants.
- `scripts/context_checkpoint.py` — budget calculation, artifact metadata, checkpoint building.
- `scripts/verify_checkpoint.py` — checkpoint/artifact/resume validation.
- `hooks/hooks.md` — lifecycle attachment points.
- `workflows/workflows.md` — orchestration and recovery loops.
- `examples/task-state.example.json` — input contract example.

Python scripts use only the standard library and require Python 3.10+ because of modern type syntax.

## 3. Storage layout

Recommended runtime storage per task:

```text
.agent-state/
  <task-id>/
    checkpoints/
      cp-0001.json
      cp-0002.json
    artifacts/
      <sha256>-tool-output.json
      <sha256>-build.log
    events/
      context-metrics.jsonl
```

Do not commit `.agent-state/` when it may contain private repository state or logs. Add it to `.gitignore` unless the storage is intentionally sanitized.

A production service may replace local files with object storage, a database, or a workflow-state backend. Preserve the same invariants: immutable verified checkpoints, stable artifact references, content hashes, and bounded recovery.

## 4. Context budget adapter

The package cannot know every provider/model window automatically. The host must resolve the effective context limit for the **active** model.

Call:

```bash
python scripts/context_checkpoint.py budget \
  --model gpt-5.6-sol \
  --limit 262144 \
  --used 185000 \
  --policy config/checkpoint-policy.json
```

The exact numeric limit above is only an integration example. In production, use provider/runtime metadata for the actual model instead of hard-coding the example.

Expected actions:

- `continue`
- `prepare-checkpoint`
- `checkpoint-now`
- `hard-stop`

For multi-agent systems, run this independently for every agent after model selection. Never use the coordinator’s limit for a smaller-window subagent.

## 5. Build a checkpoint

Your runtime should maintain an observable task-state object. Start from `examples/task-state.example.json`.

```bash
python scripts/context_checkpoint.py build \
  --input runtime/task-state.json \
  --output .agent-state/feature-123/checkpoints/cp-0007.json \
  --policy config/checkpoint-policy.json
```

The builder validates required fields and checkpoint-size budget before writing the output atomically.

### Fields to maintain continuously

- `goal`
- `constraints`
- `facts`
- `assumptions_to_verify`
- `decisions`
- `changed_files`
- `tests_and_commands`
- `artifacts`
- `blockers`
- `next_actions`
- `verification_status`
- `failed_approaches`

Do not reconstruct these only when the context is already full. Update them at meaningful events.

## 6. Externalize large tool output

For a durable local artifact:

```bash
python scripts/context_checkpoint.py artifact \
  --path .agent-state/feature-123/artifacts/build.log \
  --purpose "Build output required for final verification" \
  --producer "dotnet build" \
  --media-type text/plain
```

Copy the emitted artifact object into the task-state `artifacts` list.

### What should be externalized

Strong candidates:
- build/test logs;
- patches/diffs too large for the operational tail;
- database query plans;
- benchmark output;
- static-analysis reports;
- large JSON API/tool responses;
- screenshots or binary outputs needed later;
- expensive research/tool outputs that are difficult to reproduce.

### What should not be externalized blindly

- secrets;
- credentials/tokens;
- unnecessary PII;
- ephemeral output with no continuation or verification value.

Apply your organization’s data policy before persistence.

## 7. Verify before compaction

```bash
python scripts/verify_checkpoint.py \
  .agent-state/feature-123/checkpoints/cp-0007.json \
  --policy config/checkpoint-policy.json
```

Only proceed to provider/platform compaction if the process exits `0`.

A verified checkpoint should be treated as immutable. If state changes, create `cp-0008.json`; do not mutate `cp-0007.json` in place.

## 8. Invoke provider/platform compaction

After verification succeeds, call the native mechanism appropriate for the runtime.

Examples:
- OpenAI Responses API compaction;
- a coding-agent `/compact` command;
- host-specific conversation summarization;
- a new session seeded from the verified checkpoint.

Keep the application instructions functionally equivalent across resume unless an intentional policy/task change is recorded.

Do not parse or depend on provider-private opaque compaction internals. Treat the application checkpoint as the readable durability layer.

## 9. Preserve an operational tail

After checkpoint creation, retain a bounded recent tail containing:
- commands just run;
- errors just observed;
- most recent file edits;
- immediate next action;
- short references to newly externalized artifacts.

The tail should not become another full transcript. Its purpose is local continuity between checkpoint and compaction/resume.

## 10. Resume validation

After compaction or restart, materialize a bounded `resume-state.json` and run:

```bash
python scripts/verify_checkpoint.py \
  .agent-state/feature-123/checkpoints/cp-0007.json \
  --policy config/checkpoint-policy.json \
  --resume-state runtime/resume-state.json
```

A sensitive tool/action should require `resume-ok` before execution.

If validation fails:
1. stop optional writes;
2. load the latest verified checkpoint;
3. verify artifacts;
4. compare current repository/runtime state;
5. hydrate only required artifacts;
6. retry recovery once;
7. try one older verified checkpoint if necessary;
8. escalate instead of guessing.

## 11. Provider-specific integration notes

### OpenAI Responses
Use the checkpoint protocol before calling the Responses compaction endpoint. Official guidance recommends monitoring context usage and compacting after major milestones rather than waiting until the maximum window. Keep the returned compaction item opaque and pass it according to the API contract; retain your own application-readable checkpoint separately.

### Coding agents with manual `/compact`
Wrap or precede the manual action with the pre-compaction checkpoint and verification hooks. If the product cannot intercept `/compact`, expose a `checkpoint-and-compact` workflow command to users/agents and treat direct `/compact` as a less-safe fallback.

### Multi-agent orchestration
Each delegated agent gets:
- its own active-model limit;
- its own budget decision;
- a bounded handoff packet;
- a reference to the shared verified task checkpoint;
- only the artifacts required for its responsibility.

## 12. Token metrics

For every checkpoint event, record:

```json
{
  "task_id": "feature-123",
  "checkpoint_id": "cp-0007",
  "model": "gpt-5.6-sol",
  "context_limit": 262144,
  "used_before": 185000,
  "reserve_before": 77144,
  "checkpoint_approx_tokens": 2100,
  "operational_tail_tokens": 6400,
  "used_after_resume": 18500,
  "compaction_status": "success",
  "resume_status": "success"
}
```

The numeric values are examples, not model specifications.

Key production indicators:
- tokens per completed task;
- checkpoint size;
- context ratio at checkpoint;
- reserve at compaction;
- compaction failure rate;
- resume validation failure rate;
- full-history fallback rate;
- recovery success rate;
- quality/regression rate after resume.

## 13. Regression tests

Run:

```bash
python -m unittest tests/test_checkpoint_contract.py -v
```

Add host-specific tests for:
- real artifact storage;
- model-switch limits;
- context-telemetry parsing;
- provider compaction failure;
- task-state reconstruction;
- security/secret redaction;
- recovery from corrupted/missing artifacts.

## 14. Adoption strategy

### Phase 1 — Observe
Log per-model context usage and detect large tool outputs. Do not change agent behavior yet.

### Phase 2 — Checkpoint
Generate/verify checkpoints at milestones and compare them with what users need to resume work.

### Phase 3 — Gate compaction
Require a verified checkpoint before compaction when your host can enforce it.

### Phase 4 — Externalize artifacts
Move large durable tool outputs out of transcript context and track token reduction.

### Phase 5 — Recovery drills
Simulate a lost/failed compacted session and prove that the checkpoint + artifacts can restore work without full-history replay.

## 15. Definition of integrated

Integration is complete only when:
- active model limits are resolved per agent;
- recovery reserve is enforced;
- checkpoints are created before high-risk compaction thresholds;
- checkpoints pass deterministic verification;
- durable large tool output is externalized with hashes;
- post-compaction resume validation gates sensitive continuation;
- recovery is bounded and tested;
- metrics show token reduction without a higher task-error/regression rate.