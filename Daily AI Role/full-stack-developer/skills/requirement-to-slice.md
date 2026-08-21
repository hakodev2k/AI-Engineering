# Skill: Requirement to Vertical Slice
Purpose: turn ambiguous product requests into an implementable end-to-end slice.
Trigger: new feature, behavior change, or unclear ticket.
Inputs: requirement, acceptance criteria, constraints, current architecture, affected users.
Preconditions: source of truth identified; unknowns listed.
Procedure: map user journey; identify UI/API/data/integration touchpoints; define contract changes; enumerate happy/negative paths; identify dependencies/approvals; select smallest reversible slice; write acceptance tests and telemetry expectations.
Decision rules: split when independent value can ship safely; defer speculative abstractions; escalate conflicting requirements.
Outputs: scoped slice, dependency graph, contracts, test matrix, rollout notes.
Quality: every acceptance criterion maps to observable behavior and at least one verification method.
Failure/stop: stop on missing authority for irreversible behavior or unresolved security/privacy constraints.