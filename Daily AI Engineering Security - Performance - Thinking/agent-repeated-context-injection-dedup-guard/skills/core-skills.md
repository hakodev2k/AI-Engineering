# Core Skills

## Skill 1 — Baseline Context Injection Profiling

### Purpose
Quantify host-generated context before changing admission behavior.

### Trigger
Run when long sessions show unexpected context growth, frequent compaction, rising first-token latency, or repeated reminders/rules/hooks.

### Inputs
- representative JSONL event export in the package event schema;
- source classification for each event;
- current policy file;
- task/session identifier that contains no secret payload.

### Preconditions
- capture path is read-only;
- user messages and raw current tool results are classified separately from host-generated attachments;
- secret-bearing payloads have already passed the platform's security redaction boundary.

### Required context
Know which host component produced each event and its logical identity, e.g. `rules/python-security`, `file:src/api.cs`, `hook:test-summary`.

### Tools
`context_metrics.py`, standard JSON tooling, platform token-count API when available.

### Procedure
1. Capture a representative session without changing behavior.
2. Assign each host-generated event `source`, `logical_key`, `turn`, and `content`.
3. Count baseline tokens using the provider token counter when available; otherwise record the estimator as approximate.
4. Group tokens by source and logical key.
5. Calculate repeat frequency, exact-repeat bytes, repeat interval, and growth per turn.
6. Identify the top three repeat producers.
7. Preserve the baseline artifact for after-change comparison.

### Decisions
- If repeated host-generated tokens are <10% of context, do not optimize merely to hit a target.
- If one producer contributes >25% of repeated tokens, fix that producer first.
- If duplicate content is correctness-critical or `always_include`, exclude it from suppression candidates.

### Constraints
Do not infer improvement from shorter visible chat alone. Measure serialized model input or a faithful host-context export.

### Expected output
A baseline report containing total injected tokens, duplicate tokens, duplicate ratio, per-source breakdown, and candidate logical keys.

### Metrics
Tokens/turn, duplicate-token ratio, unique logical keys, versions/key, p95 repeated payload size, context growth/turn.

### Verification
Re-running the profiler on the same immutable event file yields the same result.

### Failure handling
If source identity cannot be determined, classify the event as `unknown` and treat it as non-deduplicable until integration is corrected.

### Stop conditions
Stop diagnosis when a reproducible dominant producer is identified or when the evidence shows repetition is not the meaningful bottleneck.

---

## Skill 2 — Safe Context Admission Design

### Purpose
Convert append-only attachments into versioned context admission without losing required information.

### Trigger
Run after the baseline demonstrates material repeated host-generated context.

### Inputs
Baseline report, policy, event-source semantics, task-quality fixtures.

### Preconditions
Every suppressible item has a stable `logical_key`; required/safety-sensitive sources can be marked `always_include`.

### Procedure
1. Define the trust and correctness boundary for each source.
2. Set `deduplicate=false` for user, safety, authz, current tool result, and recovery-error sources.
3. Normalize only representation differences that do not alter meaning.
4. Fingerprint `(source, logical_key, normalized-content)`.
5. Include the first occurrence.
6. Suppress exact duplicates only inside the configured freshness window.
7. Include changed content as a new version immediately.
8. Bound ledger entries and payload size.
9. Record decisions without copying suppressed payloads into telemetry.
10. Run quality and required-context fixtures before enforcement.

### Decisions
- Prefer exact deduplication to semantic deduplication by default.
- Add semantic similarity only after a separate false-positive evaluation; it is not required by this package.
- If the source cannot expose stable identity, keep it included and fix integration rather than guessing.

### Constraints
Never deduplicate user messages or security/authorization decisions.

### Expected output
A configured admission policy and deterministic event decisions.

### Metrics
Suppressed tokens, false suppression count, changed-version inclusion rate, ledger size, processing latency.

### Verification
Every duplicate fixture is suppressed, every changed-version fixture is included, and every required event is included.

### Failure handling
Fail open for correctness-sensitive unknown sources: include the event and emit a classification warning.

### Stop conditions
Stop rollout if any required event is suppressed or golden task quality regresses.

---

## Skill 3 — Token Reduction Verification

### Purpose
Prove that lower context cost does not silently lower task quality.

### Trigger
Run after implementing or changing deduplication policy.

### Inputs
Same-session baseline events, guarded decisions, golden-context tests, production-like replay samples.

### Procedure
1. Replay the exact same input event stream through baseline and guarded builders.
2. Measure baseline and guarded tokens.
3. Compare admitted logical keys and versions.
4. Assert required-context coverage is 100%.
5. Run golden agent tasks using both contexts where reproducible evaluation is available.
6. Compare answer correctness, tool-selection correctness, and recovery behavior.
7. Record Implemented, Measured, and Verified independently.

### Decisions
A 30% token reduction is not success if quality regresses. Prefer smaller savings with zero known correctness loss.

### Metrics
Tokens/task, cost/task, time-to-first-token, duplicate ratio, quality pass rate, tool-call error rate, compaction frequency.

### Verification
The same fixture and policy produce deterministic admission results; quality gates pass before enforcement.

### Failure handling
On regression, disable suppression for the implicated source/logical key and re-run once. Maximum remediation attempts: 2 before escalation.

### Stop conditions
Stop when target reduction and quality gates pass, or after two failed remediation attempts with evidence for escalation.
