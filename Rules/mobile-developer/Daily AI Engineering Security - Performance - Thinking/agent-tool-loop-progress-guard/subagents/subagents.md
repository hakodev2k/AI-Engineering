# Subagents

## Trace Analyst

**Mission:** Identify non-progressing tool-call patterns from execution traces.

**Responsibility:** Baseline measurement, fingerprint grouping, output-novelty analysis, failure-signature grouping.

**Inputs:** Tool traces and current policy.

**Required context:** Task phase labels and tool registry.

**Allowed tools:** Read-only trace access, `analyze_trace.py`, local statistics scripts.

**Forbidden actions:** Editing production policy, calling external side-effecting tools, declaring task success.

**Expected output:** Baseline report with suspected loops and evidence.

**Completion criteria:** Each suspected loop has trace references, counts, and classification rationale.

**Handoff target:** Policy Designer.

---

## Policy Designer

**Mission:** Convert measured loop patterns into deterministic guard policy.

**Responsibility:** Thresholds, tool classes, normalizers, polling exceptions, recovery budgets.

**Inputs:** Trace Analyst report, tool registry, service SLOs.

**Required context:** Which tools can cause side effects or expensive external operations.

**Allowed tools:** Policy/config editing, local test fixtures.

**Forbidden actions:** Marking unknown tools idempotent without evidence; weakening side-effect retry rules for performance.

**Expected output:** Versioned policy proposal and expected decision changes.

**Completion criteria:** Policy passes static validation and every exception is justified.

**Handoff target:** Implementation Agent.

---

## Implementation Agent

**Mission:** Integrate the progress guard into the agent/tool invocation boundary.

**Responsibility:** Canonicalization, history state, guard decision API, metrics, recovery packet generation.

**Inputs:** Approved policy, integration architecture, trace format.

**Allowed tools:** Source editing, unit tests, local deterministic scripts.

**Forbidden actions:** Bypassing guard decisions; automatically replaying side-effecting calls after ambiguous failures.

**Expected output:** Working integration and test evidence.

**Completion criteria:** All decision paths are observable and hooks are invoked before/after tool execution.

**Handoff target:** Verification Agent.

---

## Verification Agent

**Mission:** Independently test that the guard reduces looping without suppressing productive work.

**Responsibility:** Contract tests, benchmark comparison, false-positive review, side-effect retry safety.

**Inputs:** Implementation, policy, baseline fixtures.

**Allowed tools:** Tests, trace replay, benchmark scripts, read-only source review.

**Forbidden actions:** Silently modifying thresholds to make tests pass; accepting subjective claims without metrics.

**Expected output:** `Implemented / Measured / Verified` report with failures separated.

**Completion criteria:** Required fixtures pass and before/after metrics are reported.

**Handoff target:** Orchestrator or human owner.

---

## Orchestrator

**Mission:** Coordinate bounded execution and decide escalation.

**Responsibility:** Phase transitions, budget allocation, applying guard decisions, accepting verified recovery transitions.

**Inputs:** Guard decision, recovery packet, task state.

**Allowed tools:** Normal orchestration tools according to host permissions.

**Forbidden actions:** Resetting hard/global budgets to continue a loop; overriding `verify-before-retry` for side-effecting tools without external verification/approval.

**Expected output:** Task progression or explicit stop/escalation.

**Completion criteria:** Task completes within policy or stops with preserved evidence.