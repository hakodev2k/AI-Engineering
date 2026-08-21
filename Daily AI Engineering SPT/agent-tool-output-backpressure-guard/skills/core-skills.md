# Core Skills

## Skill 1 — Establish an Output Baseline

**Purpose:** Measure tool-output volume before changing capture behavior.  
**Trigger:** A runtime shows high disk/memory/context growth, slow resume, or repeated verbose tool results.  
**Inputs:** Representative session logs, tool IDs, runtime duration, disk/RSS measurements.  
**Preconditions:** Read-only access to logs/session artifacts; no destructive cleanup before evidence capture.  
**Required context:** Which tools run, which outputs are correctness-critical, where session/history is stored.  
**Tools:** `scripts/session_bloat_audit.py`, OS disk/RSS metrics, provider usage telemetry when available.

### Procedure
1. Record session-file size, temp-output size, peak RSS, resume p50/p95, and model-visible output bytes.
2. Run the audit script on representative session files.
3. Rank largest inline records and repeated payloads.
4. Classify sources: shell stdout, stderr, web/API result, subagent transcript, test/build log, renderer/session replay.
5. Record whether large artifacts are duplicated across temp storage, transcript, and parent context.
6. Produce a baseline table; do not propose optimization until at least one dominant source is identified.

**Decisions:** Optimize only when measured output is material relative to configured context/storage budget.  
**Constraints:** Never delete evidence during baseline collection.  
**Expected output:** Baseline metrics plus top output producers and duplication paths.  
**Metrics:** bytes/tool, bytes/session, duplicate overhead, peak RSS, resume latency.  
**Verification:** Re-run measurements on the same fixtures to confirm repeatability.  
**Failure handling:** If logs are malformed, preserve them and record the parsing gap.  
**Stop conditions:** Stop diagnosis when one or more sources explain the material majority of excess growth or evidence is insufficient.

## Skill 2 — Apply Bounded Capture Without Losing Diagnostic Value

**Purpose:** Introduce backpressure while preserving useful evidence.  
**Trigger:** Baseline identifies unbounded or excessive output.  
**Inputs:** `config/output-policy.json`, tool stream, session counter, tool/session identity.  
**Preconditions:** A host can route tool stdout/stderr through a capture adapter.  
**Required context:** Expected maximum normal output and commands whose full output is required for correctness.  
**Tools:** `scripts/output_backpressure.py`.

### Procedure
1. Set soft limits from normal p95 output, not arbitrary intuition.
2. Set hard limits above normal p99 but below machine-risk thresholds.
3. Preserve bounded head and tail previews.
4. When soft limits are crossed, persist content as a content-addressed artifact and inject only metadata/reference into active session state.
5. When hard byte/rate/session limits are crossed, return a deterministic violation reason.
6. Mark clipped output explicitly; never represent it as complete.
7. If verification requires omitted data, retrieve the artifact deliberately rather than broadening the global inline budget.
8. Measure new session size, RSS, latency, and diagnostic success rate.

**Decisions:** Prefer reference-only mode for large outputs; use hard-stop behavior for runaway streams.  
**Constraints:** Do not silently drop data; do not automatically raise limits after failure.  
**Expected output:** Bounded capture metadata, artifact reference when needed, explicit clipping state.  
**Metrics:** bytes avoided, artifact count, clipped rate, false-block rate, diagnostic retrieval rate.  
**Verification:** Large-output fixtures remain bounded and head/tail terminal evidence is retained.  
**Failure handling:** Accounting or persistence errors fail closed if policy requires it.  
**Stop conditions:** Stop after configured maximum remediation attempts or when target budgets are met.

## Skill 3 — Convert Session History to Reference-First Replay

**Purpose:** Prevent old large tool results from dominating resume/deserialization/rendering.  
**Trigger:** Resume latency, session bloat, or renderer memory grows with historic tool results.  
**Inputs:** Session representation, artifact store, audit report.  
**Preconditions:** Tool result references can be resolved on demand.  
**Required context:** Which fields the model/UI actually requires on resume.  
**Tools:** Session audit script plus host serializer/replay adapter.

### Procedure
1. Identify oversized inline records and repeated payloads.
2. Store full payload once using SHA-256 content addressing.
3. Replace inline payload with digest, byte count, preview, media type, and stable retrieval locator.
4. On resume, deserialize only references/previews.
5. Retrieve the full artifact only when a later step explicitly needs it.
6. Ensure missing artifacts produce a visible `artifact_missing` failure, not silent empty output.
7. Benchmark resume and peak RSS before/after.

**Decisions:** Retain full artifact only when its diagnostic/business value exceeds storage policy; otherwise keep the bounded preview plus explicit truncation record.  
**Constraints:** Do not reference-delete artifacts still reachable from retained sessions.  
**Expected output:** Reference-first session records and lazy replay behavior.  
**Metrics:** inline bytes/session, resume p95, peak RSS, artifact fetches/resume.  
**Verification:** Resume succeeds on large-history fixtures without eagerly loading artifact bodies.  
**Failure handling:** Missing referenced data blocks claims that depend on it.  
**Stop conditions:** Stop when budget and correctness gates pass.

## Skill 4 — Detect Runaway Output Loops

**Purpose:** Catch fast-growing streams before they exhaust disk/memory.  
**Trigger:** High output velocity or repeated lines from interactive/non-interactive mismatch.  
**Inputs:** Sliding-window byte counters, optional line fingerprints.  
**Preconditions:** Streaming capture is observable.  
**Required context:** Normal output velocity by workload class.  
**Tools:** `output_backpressure.py`, host metrics.

### Procedure
1. Measure baseline bytes/second for representative commands.
2. Configure soft and hard rate thresholds.
3. Track bytes inside a bounded sliding window.
4. At soft threshold, emit warning/telemetry and switch to artifact/reference mode.
5. At hard threshold, stop capture or terminate the tool only if the host policy explicitly authorizes tool cancellation.
6. Preserve head/tail evidence and reason code.
7. Do not blindly retry the same command; diagnose interactive prompt loops, verbose flags, recursive logging, or repeated exception printing first.

**Expected output:** Early `RATE_HARD_LIMIT` or warning signal with evidence.  
**Metrics:** time-to-detect, bytes written before detection, recurrence rate.  
**Verification:** Infinite-output fixture trips within configured window.  
**Failure handling:** Maximum two remediation attempts by default.  
**Stop conditions:** Stop retrying when the same output signature reappears without a changed hypothesis.