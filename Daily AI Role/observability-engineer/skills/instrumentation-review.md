# Skill: Instrumentation Review
Trigger: code or configuration adds/changes production telemetry.
Inputs: diff, telemetry contract, deployment model and verification plan.
Procedure: verify semantic naming, units, status/error mapping, correlation propagation, deployment/version context, no-data behavior, sensitive-field handling, dimension bounds and expected volume. Review exception paths and async/background boundaries. Require evidence from controlled traffic.
Decision: approve only when emitted data matches contract; otherwise request bounded corrections.
Output: review findings with severity, evidence and owner.
Failure: after two failed correction loops, escalate to service owner or security/platform owner.
