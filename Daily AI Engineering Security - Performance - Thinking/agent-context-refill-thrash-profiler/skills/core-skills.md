# Core Skills

## Skill 1 — Measure post-compaction refill
**Purpose:** establish a token baseline before mitigation.

**Trigger:** any long-running agent session with compaction, context-limit warnings, repeated summarization, or unexplained token growth.

**Inputs:** context-contribution trace, context-window size, policy thresholds.

**Preconditions:** each contribution has turn, source and token count; compaction turns are marked.

**Required context:** model context window, orchestration rules, static instruction sources, artifact-reference semantics.

**Tools:** token accounting emitted by host; `scripts/context_refill_profiler.py`.

**Procedure:**
1. Capture at least one full interval spanning a compaction and three subsequent turns.
2. Label contributions as system, project_instruction, tool_result, file_read, memory, history_summary or other.
3. Fingerprint byte-identical static payloads before serialization.
4. Mark recoverable tool/file state with durable `artifact_id`.
5. Run the profiler and store the report.
6. Rank sources by post-compact token contribution.
7. Record refill ratio, refill velocity, duplicate-static ratio, attribution coverage and compaction density.

**Decisions:** optimize only a source that is both material and safely reducible. If required state lacks durable references, fix references before reducing content.

**Constraints:** never estimate an improvement without a baseline; never hide required state merely to pass a token budget.

**Expected output:** machine-readable report plus ranked source attribution.

**Metrics:** post-compact refill tokens, duplicate-static tokens, attribution coverage, compactions/20 turns.

**Verification:** rerun against the same trace and confirm deterministic output.

**Failure handling:** if attribution is below policy minimum, stop optimization and instrument missing sources.

**Stop conditions:** stop when trace is incomplete, context window is unknown, or required artifacts cannot be identified.

## Skill 2 — Reduce redundant refill safely
**Purpose:** cut duplicated/static context without losing correctness-critical state.

**Trigger:** baseline shows budget violation or duplicate-static ratio above threshold.

**Inputs:** profiler report, static payload fingerprints, artifact references, task verification suite.

**Preconditions:** baseline is captured and failing source is identified.

**Procedure:**
1. Choose the highest-cost reducible source.
2. For unchanged static instructions, replace repeat verbatim injection with digest/reference or hierarchical lazy loading when the host supports it.
3. For large tool/file results, preserve `artifact_id`, metadata and bounded summary; reload exact content only when needed.
4. Keep security, user constraints and active task requirements pinned.
5. Change one policy dimension per experiment.
6. Replay representative traces.
7. Compare token metrics and verification-suite results.
8. Accept only if token targets improve without correctness regression.

**Decisions:** if a payload is required for immediate reasoning and no retrieval path exists, retain it. If a summary changes semantics, revert.

**Constraints:** no silent deletion; no lossy compression of security boundaries or irreversible-operation approvals.

**Expected output:** approved mitigation with before/after metrics.

**Metrics:** token reduction, refill ratio, task pass rate, artifact-reference loss count.

**Verification:** independent verifier checks both budget and task outcomes.

**Failure handling:** revert mitigation, capture failed case, test next hypothesis; maximum two mitigation iterations per source in one run.

**Stop conditions:** target met; two failed iterations; quality regression; missing required artifact.

## Skill 3 — Detect and recover from compact-loop thrashing
**Purpose:** prevent a session from endlessly compacting without useful progress.

**Trigger:** more than policy maximum compactions in 20 turns or post-compact refill exceeds threshold repeatedly.

**Procedure:**
1. Freeze further automatic compaction for diagnostic checkpoint if host supports it.
2. Persist active plan, facts, constraints and artifact IDs outside the model context.
3. Attribute the refill by source.
4. Disable only redundant reinjection paths, never required safety instructions.
5. Start a bounded clean continuation referencing the persisted checkpoint.
6. Verify task state and artifact accessibility before resuming execution.

**Expected output:** recovered session or explicit escalation record.

**Failure handling:** if safe continuation cannot be proven, stop and require human review instead of repeatedly compacting.

**Stop conditions:** one successful recovery attempt or one failed recovery attempt; never loop recovery indefinitely.
