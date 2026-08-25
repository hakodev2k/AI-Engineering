# Workflow: Bind and Authorize MCP Tasks

## Trigger
Tasks extension enablement or task authorization defect.

## Goal
Make ownership explicit, durable, least-privilege, and independently verifiable.

## Inputs
Task endpoints, auth model, current task store, representative principals.

## Baseline
Record which endpoints currently check authentication only, binding, or task ID only; run cross-principal negative tests.

## Stages
1. Observe endpoint/auth flow.
2. Measure baseline authorization coverage.
3. Diagnose missing ownership propagation.
4. Form a normalized ownership tuple hypothesis.
5. Implement keyed binding at task creation.
6. Gate each task operation with binding validation.
7. Measure again with same/cross-principal tests.
8. Independent Task Security Verifier reviews.

## Responsible agent
Implementation owner; verifier must be separate for high-risk changes.

## Tools
Reference script, unit/integration tests, redacted traces.

## Outputs
Binding implementation, coverage evidence, before/after test results, risks.

## Checkpoints
After ownership model approval and before deployment.

## Metrics
Endpoint binding coverage, cross-principal denials, missing-auth denials, false-denial rate.

## Retry policy
At most 2 implementation/test iterations. Never retry by weakening authorization.

## Stop conditions
All negative tests pass; two attempts fail; ownership semantics remain ambiguous; or a credential exposure is detected.

## Failure path
Deny affected operations, disable unsafe task access if necessary, escalate to security owner.

## Verification
Independent verifier reproduces negative tests and checks persistence/logs for secrets.

## Definition of Done
Baseline recorded, all task operations covered, binding persisted safely, negative tests pass, TTL cleanup defined, verifier returns VERIFIED.