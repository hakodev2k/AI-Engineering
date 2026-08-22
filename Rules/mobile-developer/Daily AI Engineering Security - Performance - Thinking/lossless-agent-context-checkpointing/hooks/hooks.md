# Hooks

## Hook 1 — `pre-task-context-budget`

**Trigger:** task/session start or model switch.

**Action:** resolve effective context window for the active model; load checkpoint policy; calculate soft/checkpoint/hard-stop token boundaries and recovery reserve.

**Command/script:** host-specific telemetry adapter followed by `python scripts/context_checkpoint.py budget --limit <tokens> --used <tokens> --policy config/checkpoint-policy.json`.

**Expected result:** JSON decision with `continue`, `prepare-checkpoint`, `checkpoint-now`, or `hard-stop`.

**Failure behavior:** use conservative model limit; mark telemetry uncertain; checkpoint earlier. Never assume a larger limit.

---

## Hook 2 — `post-large-tool-output`

**Trigger:** tool output exceeds configured inline character budget or is expensive/necessary to reproduce.

**Action:** classify output; persist durable output outside conversation; compute SHA-256; retain only bounded excerpt + artifact reference.

**Command/script:** artifact-store adapter plus host SHA-256 implementation. `context_checkpoint.py artifact` can generate metadata from a local file.

**Expected result:** artifact record including path, size, SHA-256, purpose, producer.

**Failure behavior:** if artifact is required for continuation/verification and persistence fails, keep the original recoverable source and block intentional eviction.

---

## Hook 3 — `pre-compaction-checkpoint`

**Trigger:** manual/automatic compaction is requested or checkpoint threshold is crossed.

**Action:** build checkpoint from current observable state, then validate required fields and size.

**Command/script:** `python scripts/context_checkpoint.py build --input <state.json> --output <checkpoint.json> --policy config/checkpoint-policy.json`

**Expected result:** candidate checkpoint JSON.

**Failure behavior:** allow one correction pass; if still invalid, block compaction and enter recovery/escalation.

---

## Hook 4 — `pre-compaction-verify`

**Trigger:** checkpoint candidate exists.

**Action:** independently validate schema, artifact references/hashes, goal, constraints, next action, and verification-state consistency.

**Command/script:** `python scripts/verify_checkpoint.py <checkpoint.json> --policy config/checkpoint-policy.json`

**Expected result:** exit code 0 and `verified: true`.

**Failure behavior:** do not compact. Emit finite blocking errors. Maximum one correction attempt.

---

## Hook 5 — `post-compaction-resume-verify`

**Trigger:** platform compaction/resume completes.

**Action:** reload latest verified checkpoint; compare resume packet against goal, constraints, changed files, blockers, and next actions; verify artifacts lazily when referenced.

**Command/script:** `python scripts/verify_checkpoint.py <checkpoint.json> --policy config/checkpoint-policy.json --resume-state <resume-state.json>`

**Expected result:** `resume-ok`.

**Failure behavior:** freeze optional writes and enter recovery workflow. Do not let the model guess missing operational state.

---

## Hook 6 — `pre-subagent-handoff`

**Trigger:** coordinator delegates to a model/agent with a different context window.

**Action:** resolve destination model limit, calculate destination budget, create a handoff checkpoint if destination cannot safely consume current context.

**Command/script:** `context_checkpoint.py budget` using **destination** model window.

**Expected result:** bounded handoff packet plus verified checkpoint reference.

**Failure behavior:** reject delegation until a safe packet exists or choose a model with sufficient context.

---

## Hook 7 — `final-verification`

**Trigger:** task completion.

**Action:** create final checkpoint, verify tests/artifacts, mark verification status accurately, capture final token/recovery metrics.

**Command/script:** build + verify scripts.

**Expected result:** final verified checkpoint suitable for audit/restart.

**Failure behavior:** task may be implemented but must not be reported as verified until blocking evidence is resolved.

## Hook ordering

```text
pre-task-context-budget
  -> normal work
  -> post-large-tool-output (as needed)
  -> pre-compaction-checkpoint
  -> pre-compaction-verify
  -> platform compaction
  -> post-compaction-resume-verify
  -> normal work / recovery
  -> final-verification
```

## Safety invariant
No hook may reduce required recovery reserve, suppress a validation failure, or delete the last recoverable copy of a required artifact merely to make compaction succeed.