# Skill: Telemetry Contract Design
Purpose: define stable, reusable signal semantics before implementation.
Trigger: new service, new user journey, instrumentation redesign or repeated ambiguity.
Inputs: architecture, SLOs, incident questions, existing telemetry and ownership.
Preconditions: decision goal and service boundary are known.
Procedure: map critical operations; identify success/failure/latency/resource signals; define names, units, event meaning, dimensions, correlation fields, owner, retention and expected volume; reject duplicate or ambiguous fields; review privacy/cardinality/cost; publish contract.
Decision rule: if a field has no operational consumer or clear question, SHOULD omit it.
Output: approved telemetry contract using `templates/telemetry-contract.md`.
Quality: stable semantics, bounded dimensions, explicit ownership and evidence plan.
Stop: unresolved privacy, ownership or semantic conflict -> escalate.
