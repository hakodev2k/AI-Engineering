# Core Skills

## Skill 1 — Context Budget Accounting

### Purpose
Prevent a long-running agent from reaching a context state where compaction or recovery can no longer execute safely.

### Trigger
Run at task start, after every large tool response, after model/subagent changes, and when context usage crosses the soft threshold.

### Inputs
- active model identifier;
- effective context-window size;
- estimated current input tokens;
- reserved output tokens;
- recovery reserve;
- upcoming tool-call estimate when known.

### Preconditions
The runtime can estimate token usage or obtain platform-reported context usage.

### Procedure
1. Resolve the context limit for the **active agent/model**, never the coordinator by default.
2. Compute `usable = context_limit - reserved_output - recovery_reserve`.
3. Compute `usage_ratio = current_input / context_limit`.
4. Compare against soft/checkpoint/hard-stop thresholds.
5. If a large tool call may cross the checkpoint threshold, checkpoint first.
6. At hard-stop threshold, prohibit optional large-context operations and initiate recovery/checkpoint flow.
7. Record the measurement and decision.

### Decisions
- `< soft`: continue.
- `soft..checkpoint`: reduce unnecessary context and prepare checkpoint.
- `checkpoint..hard-stop`: checkpoint now, then compact.
- `>= hard-stop`: do not attempt ordinary continuation; use recovery path.

### Constraints
Do not infer context limits from another model or agent. Do not assume prompt cache changes the correctness limit.

### Output
A budget decision containing model, limit, usage, reserve, ratio, action, and timestamp.

### Metrics
Checkpoint-before-overflow rate; hard-limit incidents; token reserve at compaction time.

### Verification
Recalculate after every model switch and compare configured limit with runtime-reported limit when available.

### Failure handling
If the active model limit is unknown, use the smaller of configured conservative defaults and runtime-reported values; mark the budget as uncertain and checkpoint earlier.

### Stop condition
Budget action is determined and logged.

---

## Skill 2 — Operational Checkpoint Construction

### Purpose
Serialize only task-critical observable state needed to continue work after compaction, restart, or model handoff.

### Trigger
At a major milestone, checkpoint threshold, before model/subagent switch, before compaction, or before a potentially huge tool call.

### Inputs
Current goal, constraints, confirmed facts, unresolved assumptions, decisions, changed files, commands/tests, external artifacts, blockers, next actions, verification state.

### Procedure
1. Assign `task_id` and monotonic `checkpoint_id`.
2. Capture the active model and creation time.
3. Write the goal in one concrete statement.
4. Preserve hard constraints verbatim where correctness depends on wording.
5. Record confirmed facts separately from assumptions still requiring verification.
6. Record decisions with short rationale and reversal condition; do not store private chain-of-thought.
7. Record changed files and their status.
8. Record commands/tests and outcomes.
9. Externalize large tool outputs; store stable path/URI, media type, size, and SHA-256.
10. Record blockers and next executable actions.
11. Record verification status as `unverified`, `partial`, or `verified` with evidence references.
12. Validate required fields and size budget.

### Decisions
If a field is unknown, store an explicit empty collection or status rather than silently omitting it. If a large artifact cannot be persisted, stop compaction unless the artifact is proven unnecessary.

### Constraints
No secrets. No hidden reasoning transcript. No binary blobs. No unverifiable claims marked as facts.

### Output
A versioned JSON checkpoint plus references to external artifacts.

### Metrics
Checkpoint size, missing-field count, externalized bytes, resume success rate.

### Verification
Run deterministic validator and artifact hash verification before compaction.

### Failure handling
Keep the current context intact, emit validation errors, fix once, and stop if still invalid.

### Stop condition
Checkpoint validates with zero blocking errors.

---

## Skill 3 — Lossless Tool Artifact Externalization

### Purpose
Prevent important tool outputs from disappearing when chat/tool messages are truncated or compacted.

### Trigger
When tool output is large, structured, binary, likely to be truncated, expensive to reproduce, or required for later verification.

### Procedure
1. Classify output as ephemeral or durable.
2. Remove secrets before persistence or reject persistence if redaction would invalidate the artifact.
3. Persist durable output outside model context.
4. Compute SHA-256.
5. Record artifact metadata and a compact human-readable purpose.
6. Replace raw context payload with the artifact reference plus only the minimal operational excerpt.
7. Verify retrievability before evicting raw context.

### Output
Artifact reference object.

### Verification
Read artifact metadata; confirm location exists and hash matches when supported.

### Failure handling
Do not evict the only recoverable copy.

---

## Skill 4 — Resume Integrity Validation

### Purpose
Detect summary/checkpoint drift before an agent continues destructive or expensive work.

### Trigger
After compaction, session resume, model switch, or subagent handoff.

### Procedure
1. Load the latest verified checkpoint.
2. Validate schema and hashes.
3. Confirm goal and constraints are present.
4. Confirm changed-file/test state is internally consistent.
5. Confirm the next action is executable from available context.
6. Rehydrate only required artifacts.
7. Compare resumed runtime state with checkpoint invariants.
8. If mismatch exists, stop and recover from artifacts/history rather than guessing.

### Expected output
`resume-ok` or a blocking discrepancy report.

### Metrics
Resume success rate, missing-artifact rate, mismatch rate, full-history rereads avoided.

### Stop condition
All blocking invariants pass or the workflow enters recovery.