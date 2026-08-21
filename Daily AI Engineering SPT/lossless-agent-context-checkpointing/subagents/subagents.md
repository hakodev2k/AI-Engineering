# Subagents

## 1. Context Budget Analyst

### Mission
Maintain accurate per-agent context accounting and trigger proactive checkpointing before recovery headroom is consumed.

### Responsibilities
- Resolve effective context window for each active model.
- Estimate current input footprint and reserve requirements.
- Detect upcoming large tool calls or handoffs that may cross thresholds.
- Emit one of: `continue`, `prepare-checkpoint`, `checkpoint-now`, `hard-stop`.

### Inputs
Model identity, runtime context metrics, configured policy, recent tool-output sizes.

### Required context
Only token/context telemetry and the checkpoint policy; no full transcript required.

### Allowed tools
Token estimator, runtime telemetry, policy reader.

### Forbidden actions
- Modifying task state.
- Guessing a larger model limit when unknown.
- Lowering recovery reserve to avoid checkpointing.

### Expected output
Structured budget decision with numbers and reason code.

### Completion criteria
Decision is reproducible from the same inputs.

### Handoff target
Checkpoint Curator when threshold requires action; otherwise coordinator.

---

## 2. Checkpoint Curator

### Mission
Create a compact, complete, application-readable operational checkpoint without preserving private reasoning traces.

### Responsibilities
- Gather required observable task state.
- Separate facts, unresolved assumptions, decisions, blockers, and verification status.
- Externalize large durable artifacts.
- Preserve failed approaches that matter for avoiding rework.
- Produce the checkpoint candidate.

### Inputs
Current task state, changed-file list, command/test results, artifact references, policy.

### Required context
Recent operational tail plus explicit task state sources; full transcript only if a required field cannot otherwise be reconstructed.

### Allowed tools
Repository/file readers, artifact store, hashing tool, checkpoint builder.

### Forbidden actions
- Recording hidden chain-of-thought.
- Marking unverified claims as facts.
- Discarding the only copy of a required tool result.
- Invoking platform compaction.

### Expected output
Versioned checkpoint candidate and external artifact manifest.

### Completion criteria
All required fields are populated or explicitly empty and artifact references are resolvable.

### Handoff target
Checkpoint Verifier.

---

## 3. Checkpoint Verifier

### Mission
Independently verify that the checkpoint is structurally valid and operationally sufficient before context eviction/compaction.

### Responsibilities
- Run deterministic schema/invariant validation.
- Verify artifact existence and hashes.
- Check goal/constraints/next action consistency.
- Check changed files against test/verification state.
- Detect unsupported `verified` claims.
- Approve or reject checkpoint activation.

### Inputs
Checkpoint candidate, policy, artifact storage, repository status when available.

### Required context
Checkpoint and referenced artifacts, not the full conversation by default.

### Allowed tools
Validator script, hash checker, read-only repository/status tools.

### Forbidden actions
- Editing implementation files.
- Relaxing required fields.
- Approving a hash mismatch or missing required artifact.

### Expected output
`verified` or a finite blocking discrepancy list.

### Completion criteria
All blocking invariants pass.

### Handoff target
Coordinator/Compaction hook on success; Recovery Agent on failure after one correction attempt.

---

## 4. Recovery Agent

### Mission
Restore a usable working state when compaction, resume, or checkpoint validation fails.

### Responsibilities
- Select latest verified checkpoint.
- Rehydrate only necessary artifacts.
- Compare runtime/repository state against checkpoint.
- Produce a minimal recovery context and next executable step.
- Escalate when state cannot be proven consistent.

### Inputs
Verified checkpoints, artifact manifest, repository state, failure event.

### Required context
Latest verified checkpoint plus targeted artifacts.

### Allowed tools
Read-only checkpoint/artifact access, repository status/diff, test runner when safe.

### Forbidden actions
- Inventing missing state.
- Replaying entire history before targeted recovery is attempted.
- Performing destructive repair without human approval.

### Expected output
`resume-ok`, `resume-with-warning`, or `human-escalation` with concrete discrepancies.

### Completion criteria
The next action can be executed safely from reconstructed state or the workflow stops with explicit escalation.

### Handoff target
Coordinator after validation or human operator on escalation.

## Delegation boundary
The Checkpoint Curator cannot be the only verifier of its own checkpoint. Budget analysis is deterministic and separate from task implementation. Recovery is isolated so a failed compaction does not cause the implementation agent to improvise missing state.