# Core Skills

## Skill 1 — Approval Liveness Baseline
**Purpose:** establish measurable approval behavior before changing orchestration.

**Trigger:** a tool/agent workflow can pause for human or policy approval.

**Inputs:** approval event stream, policy, agent topology, runtime timestamps.

**Preconditions:** events carry a stable request ID and timezone-aware timestamp.

**Required context:** which actions require approval, which client should surface it, parent/subagent ownership, current timeout behavior.

**Tools:** runtime logs/event stream, `scripts/approval_watchdog.py`, policy file.

**Procedure:**
1. Capture at least 20 representative approval requests or all requests from a reproducible incident.
2. Record `requested`, `surfaced`, optional `acknowledged`, and terminal decision events.
3. Run the watchdog with the current policy.
4. Calculate request-to-surface and request-to-terminal latency.
5. Classify every non-terminal request as waiting, surface-timeout, decision-timeout, orphaned, or routing-defective.
6. Preserve the raw event evidence but redact sensitive command payloads.

**Decisions:** if request IDs are not stable, fix correlation first; if the UI cannot emit surfaced events, instrument the transport boundary instead.

**Constraints:** do not disable approval checks to make the baseline pass.

**Expected output:** baseline JSON report plus p50/p95 timing and defect counts.

**Metrics:** surfaced ratio, terminal ratio, p95 surface latency, p95 decision latency, orphan rate.

**Verification:** every baseline request is accounted for exactly once.

**Failure handling:** if timestamps or IDs are missing, stop and mark instrumentation incomplete.

**Stop conditions:** enough evidence exists to identify the first broken boundary, or instrumentation is insufficient.

## Skill 2 — Approval State Machine Integration
**Purpose:** make approval state explicit and machine-verifiable.

**Trigger:** integrating a host, app-server client, subagent controller, or UI approval channel.

**Inputs:** request ID, agent ID, parent agent ID, approval route, timestamps, decisions.

**Preconditions:** the runtime can emit or adapt approval lifecycle events.

**Required context:** permission policy and safe fallback semantics.

**Tools:** watchdog, host event adapter, structured logs.

**Procedure:**
1. Emit `requested` before the gated action waits.
2. For subagents, bind the request to a parent/controller route.
3. Emit `surfaced` only after a decision-capable UI/consumer actually receives the request.
4. Emit `acknowledged` when the decision surface confirms user/operator interaction, if supported.
5. Emit exactly one terminal event: `approved`, `denied`, `expired`, or `cancelled`.
6. Reject terminal events for unknown request IDs.
7. Reject second terminal decisions and events after terminal state.
8. Run watchdog continuously or at task checkpoints.

**Decisions:** use separate surface and decision deadlines; treat delivery retries separately from approval retries.

**Constraints:** timeout never means approval; missing UI never means deny unless policy explicitly executes the deny fallback and records it.

**Expected output:** auditable per-request lifecycle.

**Metrics:** unmatched event count, duplicate terminal count, timeout count, recovery latency.

**Verification:** adversarial fixtures produce expected violation codes.

**Failure handling:** quarantine ambiguous requests and cancel/deny safely according to policy.

**Stop conditions:** all active requests are terminal or explicitly escalated.

## Skill 3 — Deadlock Diagnosis and Recovery
**Purpose:** recover stalled agents without weakening permission controls.

**Trigger:** no forward progress while one or more gated actions are pending.

**Inputs:** watchdog report, task progress timestamp, parent/subagent graph, UI/transport health.

**Preconditions:** approval request correlation is available.

**Procedure:**
1. Confirm the task is blocked on an approval rather than a long-running tool.
2. Locate the earliest unresolved request.
3. Determine whether it missed the surface deadline or only the decision deadline.
4. For `SURFACE_TIMEOUT`, retry delivery at most `max_surface_retries`; never retry the gated side effect.
5. For `MISSING_PARENT_ROUTE`, cancel the child request and rebind only after the controller route exists.
6. For `DECISION_TIMEOUT`, execute configured safe fallback (`deny_and_escalate` by default).
7. Resume the agent only after the request has a terminal event.
8. Verify no duplicate side effect occurred during recovery.

**Expected output:** incident classification, bounded recovery action, terminal state, verification evidence.

**Metrics:** mean time to detect, mean time to recover, repeated-side-effect count.

**Verification:** recovery leaves no unresolved request and preserves the original permission policy.

**Failure handling:** after bounded delivery retries, stop the affected workflow and escalate to a human/operator channel.

**Stop conditions:** request reaches terminal state or workflow is safely stopped.
