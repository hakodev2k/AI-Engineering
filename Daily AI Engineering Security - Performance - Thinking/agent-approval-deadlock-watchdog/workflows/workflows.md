# Workflows

## Workflow 1 — Detect and Recover Approval Deadlock
**Trigger:** agent has no progress and a permission-gated action may be pending.

**Goal:** classify the wait, safely terminate ambiguity, and restore forward progress without weakening controls.

**Inputs:** approval event stream, policy, current time, agent topology, last-progress timestamp.

**Baseline:** capture unresolved-request count, longest pending age, p95 request-to-surface and request-to-decision latency from a representative run.

**Context:** permission policy, expected approval surface, parent/subagent relationships.

### Stages
1. **Observe — Evidence Analyst:** collect events and task progress timestamps.
2. **Correlate — Evidence Analyst:** run `approval_watchdog.py`; identify unresolved request IDs and violation codes.
3. **Locate boundary — Evidence Analyst:** determine whether failure is before surface, after surface, parent-route, or terminal correlation.
4. **Hypothesis — Runtime Integrator:** choose one bounded cause to test: delivery loss, route loss, UI disconnect, state misclassification, or operator delay.
5. **Recover — Runtime Integrator:** retry only approval delivery up to policy maximum; otherwise deny/cancel and escalate.
6. **Resume — Runtime Integrator:** resume work only after a terminal decision event exists.
7. **Verify — Independent Verification Agent:** confirm no duplicate side effect, no implicit approval, and no unresolved request remains.

**Tools:** watchdog script, structured runtime logs, test harness, agent topology inspection.

**Outputs:** classification, recovery event trail, before/after metrics, verification result.

**Checkpoints:** after correlation; before recovery; before agent resume; final verification.

**Metrics:** unresolved count; mean/p95 pending age; MTTR; delivery retry count; duplicate-side-effect count.

**Retry policy:** approval-delivery retry maximum = `max_surface_retries`; no side-effect retry until prior execution status is proven.

**Stop conditions:** request terminal + workflow resumes, or safe cancellation/escalation completes. Never loop indefinitely.

**Failure path:** if correlation or side-effect status cannot be proven, stop affected workflow and require operator review.

**Verification:** watchdog passes on the post-recovery stream; verifier confirms safety policy unchanged.

**Definition of Done:** deadlock classified; ambiguous request resolved safely; metrics captured; no permission bypass; no duplicate side effect.

## Workflow 2 — Integrate Approval Liveness into an Agent Host
**Trigger:** new or existing host supports permission-gated tools, MCP, plan transitions, or subagents.

**Goal:** make approval lifecycle observable and bounded before production use.

**Inputs:** host architecture, permission modes, event interfaces, UI/transport routes.

**Baseline:** run current host through fixtures: normal approve, normal deny, hidden surface, slow decision, orphan result, duplicate terminal, subagent missing route.

### Stages
1. Define canonical lifecycle states and request ID generation.
2. Instrument request emission before wait.
3. Instrument actual decision-surface delivery.
4. Instrument optional acknowledgement and exactly-one terminal decision.
5. Add parent route metadata for subagent requests.
6. Run watchdog fixtures.
7. Measure surface/decision latency separately.
8. Independently verify fallback semantics.

**Responsible agents:** Runtime Integrator implements; Independent Verification Agent validates.

**Outputs:** adapter, policy, event schema implementation, regression evidence.

**Checkpoints:** schema review; fail-closed review; fixture pass; release gate.

**Retry policy:** implementation/test loop maximum 3 cycles; beyond that escalate architecture defect rather than weaken thresholds.

**Stop conditions:** all mandatory fixtures pass or integration is blocked with documented evidence.

**Definition of Done:** every gated action is correlated; no unbounded wait; all timeout paths fail closed; telemetry is non-sensitive; verifier signs off on evidence.
