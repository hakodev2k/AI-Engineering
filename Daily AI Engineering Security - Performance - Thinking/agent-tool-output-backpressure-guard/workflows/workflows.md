# Workflows

## Workflow 1 — Measure → Diagnose → Bound → Measure Again

**Trigger:** Output storage, session size, resume latency, model context, or memory is materially growing.  
**Goal:** Reduce resource pressure without losing required evidence.  
**Inputs:** Representative sessions, tool logs, policy template, machine metrics.  
**Baseline:** bytes/tool, bytes/session, duplicate bytes, peak RSS, resume p50/p95, model-visible tool-output tokens if available.  
**Context:** Tool classes, session format, artifact storage, correctness-critical output requirements.

### Stages
1. **Observe — Output Baseline Investigator:** capture current metrics and audit session bloat.
2. **Cause:** identify largest producer, duplication path, replay path, or runaway rate.
3. **Hypothesis — Output Budget Planner:** choose one bounded intervention.
4. **Implement — Integration Agent:** apply only the chosen change.
5. **Measure — Independent Performance Verifier:** run identical fixtures and collect the same metrics.
6. **Better?** Pass only if target resource metrics improve without diagnostic/correctness regression.
7. **Verify:** run contract tests and independent review.

**Tools:** `session_bloat_audit.py`, `output_backpressure.py`, OS metrics, runtime telemetry.  
**Outputs:** Before/after report, versioned policy, regression results.  
**Checkpoints:** Baseline complete; hypothesis explicit; budget test pass; verifier pass.  
**Metrics:** inline bytes, artifact bytes, duplicate bytes, resume latency, peak RSS, clipped-result rate.  
**Retry policy:** Maximum 2 implementation hypotheses per incident unless a human explicitly authorizes a new investigation cycle.  
**Stop conditions:** Budget target met and verification passes; or two hypotheses fail; or required evidence cannot be preserved.  
**Failure path:** Restore prior policy, retain evidence, report blocking metric/quality regression.  
**Definition of Done:** Measured improvement plus no silent output loss.

## Workflow 2 — Runaway Stream Containment

**Trigger:** Output-rate or byte hard limit fires.  
**Goal:** Prevent disk/memory exhaustion while retaining enough evidence to diagnose the producer.  
**Inputs:** Tool identity, stream counters, previews, policy.

### Stages
1. Capture bounded head/tail and counters.
2. Persist captured content once when policy allows.
3. Emit `RATE_HARD_LIMIT`, `PER_TOOL_HARD_LIMIT`, or `SESSION_HARD_LIMIT`.
4. Host decides whether it is authorized to cancel the producer; the output guard does not infer process ownership.
5. Inspect previews for interactive prompt loops, recursive logging, repeated exceptions, verbose builds/tests, or unexpected binary data.
6. Change producer/config only when a concrete hypothesis exists.
7. Retry at most twice.
8. If the same signature recurs, stop and escalate instead of widening budgets.

**Outputs:** Incident record and bounded artifact/reference.  
**Verification:** Next run remains within both rate and byte budgets.  
**Definition of Done:** Producer is bounded and diagnostic evidence is preserved.

## Workflow 3 — Reference-First Session Migration

**Trigger:** Historical sessions contain oversized/duplicated inline tool output or resume is slow/OOM-prone.  
**Goal:** Keep full artifacts retrievable while making active history small and lazy.

### Stages
1. Audit session and enumerate oversized records.
2. Back up session metadata before transformation.
3. Compute digest and persist each large payload once.
4. Replace inline body with digest, bytes, preview, artifact locator, and completeness state.
5. Re-run audit; duplicate overhead should drop materially.
6. Resume with lazy loading enabled.
7. Measure resume p50/p95 and peak RSS.
8. Explicitly retrieve selected full artifacts and verify digest.

**Retry policy:** One automatic retry for transient artifact I/O; then block.  
**Stop conditions:** Missing artifact, digest mismatch, session corruption, or target metrics met.  
**Failure path:** Restore backup; never leave ambiguous references.  
**Verification:** Artifact SHA matches and contents are retrievable on demand.

## Workflow 4 — Policy Regression Gate

**Trigger:** Runtime/provider upgrade, serializer change, new tool/server, or output-policy change.  
**Goal:** Prevent reintroduction of eager embedding/unbounded capture.

### Stages
1. Run small normal-output fixture.
2. Run soft-limit fixture and confirm reference mode.
3. Run hard-limit fixture and confirm reason code.
4. Run repeated-payload session fixture and audit duplication.
5. Run large-history replay benchmark in target harness.
6. Compare against stored thresholds.

**Metrics:** maximum captured bytes, session inline bytes, duplicate overhead, resume latency, peak RSS.  
**Retry policy:** One fix/retest cycle for deterministic failures; otherwise block release.  
**Stop conditions:** Any hard budget is exceeded or a clipped result lacks explicit metadata.  
**Definition of Done:** All deterministic gates pass and target-runtime benchmark stays within approved thresholds.