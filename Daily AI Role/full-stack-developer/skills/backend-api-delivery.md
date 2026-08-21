# Skill: Backend API Delivery
Purpose: implement secure, observable, contract-stable server behavior.
Trigger: endpoint, command/query, business-rule, or integration change.
Inputs: capability contract, domain rules, auth model, data constraints, SLOs.
Procedure: define request/response/error contract; enforce authentication/authorization; validate at trust boundary; isolate domain logic; make side effects explicit; design idempotency where retries are plausible; handle cancellation/timeouts; emit structured telemetry; test happy, invalid, unauthorized, concurrency and dependency-failure paths.
Decisions: preserve backward compatibility by default; introduce versioning only when compatibility cannot be safely maintained.
Outputs: API/service behavior, tests, contract notes, telemetry and rollout requirements.
Stop: unknown permission model, unbounded side effect, or incompatible contract without approved migration plan.