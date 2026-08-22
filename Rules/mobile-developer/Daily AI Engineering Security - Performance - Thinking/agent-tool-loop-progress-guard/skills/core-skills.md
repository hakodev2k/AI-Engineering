# Core Skills

## Skill 1 — Establish Tool-Loop Baseline

**Purpose:** Measure existing tool-loop behavior before changing orchestration.

**Trigger:** Agent traces show high tool count, repeated commands, long exploration, iteration-cap exhaustion, or suspicious retry patterns.

**Inputs:** Structured tool trace, tool registry, phase labels, timestamps, token/latency data when available.

**Preconditions:** Trace must preserve tool name, arguments, status, and output or output digest.

**Required context:** Expected task goal and known tool semantics.

**Tools:** `scripts/analyze_trace.py`, trace store, benchmark fixture.

**Procedure:**
1. Validate trace shape.
2. Classify tools by side-effect risk.
3. Canonicalize each call.
4. Count exact fingerprint repeats.
5. Count strategy-family repeats.
6. Compare consecutive output digests.
7. Identify repeated failures and zero-novelty success loops.
8. Record baseline calls, duration, repeated-call ratio, unique-output ratio, and hard-cap incidents.
9. Store the baseline before policy tuning.

**Decisions:** Distinguish legitimate polling, progressive search, test-fix-retest, and non-progress loops.

**Constraints:** Do not infer safety of a side-effecting tool from a successful prior call.

**Expected output:** Baseline report with top loop families and candidate thresholds.

**Metrics:** duplicate ratio, near-duplicate ratio, no-novelty ratio, latency per task, tool calls per completed task.

**Verification:** Re-running analysis on the same trace yields identical classifications.

**Failure handling:** Invalid trace fails closed with a line/event reference.

**Stop conditions:** Baseline has at least one full representative trace or analysis reports insufficient evidence.

---

## Skill 2 — Canonicalize and Fingerprint Tool Calls

**Purpose:** Detect semantically repetitive calls despite inconsequential argument differences.

**Trigger:** Before every guarded tool invocation.

**Inputs:** Tool name, arguments, tool metadata, phase.

**Procedure:**
1. Normalize tool name casing only when registry semantics permit it.
2. Sort object keys recursively.
3. Normalize whitespace in command-like string fields.
4. Remove explicitly configured volatile fields such as request IDs or timestamps from comparison only; retain them in audit data.
5. Apply tool-specific normalizers from policy.
6. Generate an exact SHA-256 fingerprint.
7. Generate a strategy-family fingerprint using configured family keys.
8. Return both fingerprints plus normalized arguments.

**Decisions:** If no safe normalizer exists, use strict canonical JSON rather than aggressive semantic collapsing.

**Constraints:** Never remove fields that can change side effects or scope.

**Expected output:** Stable fingerprint record.

**Metrics:** fingerprint collision incidents, normalization overrides, exact-to-family repeat ratio.

**Verification:** Equivalent fixtures map to expected fingerprints; materially different calls do not.

**Failure handling:** Fall back to strict canonical JSON and mark `normalization_degraded=true`.

**Stop conditions:** Fingerprints produced or call rejected as malformed.

---

## Skill 3 — Evaluate Progress Before Tool Execution

**Purpose:** Decide whether another tool call is likely productive enough to justify execution.

**Trigger:** Every tool call after the first call in a phase; mandatory after a warning threshold.

**Inputs:** Candidate fingerprint, recent history, output digests, phase budget, evidence targets, tool class.

**Procedure:**
1. Calculate exact-repeat count.
2. Calculate family-repeat count.
3. Check prior output novelty for the family.
4. Check repeated error signature.
5. Check remaining phase/global budgets.
6. Check whether the candidate targets a missing evidence item.
7. Check polling exception policy.
8. Return `allow`, `warn`, `require-strategy-change`, `block`, or `verify-before-retry`.

**Decisions:** A repeated call may be allowed when it has a time-based polling contract, new scope, changed input artifact, or explicit evidence gap.

**Constraints:** Host-side decision wins over model preference.

**Expected output:** Guard decision with reason code and counters.

**Metrics:** warned calls, blocked calls, override rate, estimated calls avoided.

**Verification:** Decision fixtures produce deterministic results.

**Failure handling:** For read-only tools, conservative allow-with-warning may be configured; for side-effecting ambiguous retries, fail to `verify-before-retry`.

**Stop conditions:** Decision emitted.

---

## Skill 4 — Recover from a Detected Loop

**Purpose:** Preserve useful work and redirect the agent rather than only terminating it.

**Trigger:** `require-strategy-change` or `block` decision.

**Inputs:** Goal, phase, recent call family, collected evidence, failures, budgets, unresolved evidence targets.

**Procedure:**
1. Summarize observable evidence already collected.
2. List repeated calls/failures by fingerprint.
3. State why current strategy is non-progressing.
4. List unresolved evidence targets.
5. Recommend a materially different strategy: synthesize now, narrow scope, inspect a different source, edit/test, ask for human approval, or stop.
6. Reset only counters allowed by policy after the orchestrator records the strategy change.
7. Continue under a smaller recovery budget.

**Constraints:** Do not invent conclusions from missing evidence. Do not reset hard/global budgets.

**Expected output:** Recovery packet and next-action options.

**Metrics:** recovery success rate, loops recurring after recovery, additional calls until completion.

**Verification:** A recovered trace must show a new strategy fingerprint before the guarded family is retried.

**Failure handling:** Second loop in recovery phase triggers hard stop/escalation.

**Stop conditions:** Task completes, recovery budget expires, or human decision is required.

---

## Skill 5 — Benchmark Guard Effectiveness

**Purpose:** Prove that the guard reduces wasted work without harming completion quality.

**Trigger:** Before production rollout and after policy changes.

**Inputs:** Paired baseline/guarded traces or deterministic replay fixtures.

**Procedure:**
1. Run baseline fixtures.
2. Run guarded fixtures under identical task inputs.
3. Compare tool-call count, repeated-call count, elapsed time, token estimate, completion status, and false blocks.
4. Inspect every hard block.
5. Reject policy if quality/completion regresses beyond configured threshold.
6. Publish measured results separately from implementation status.

**Expected output:** Benchmark comparison and release recommendation.

**Stop conditions:** Metrics are sufficient for release decision or benchmark is invalidated by uncontrolled differences.