# Workflow: Agent Idempotency Replay Safety Gate

## Trigger
A retryable API, webhook, queue consumer, background job, or agent tool can cause durable/external side effects, or duplicates are observed.

## Entry conditions and inputs
Known operation/entry point, intended business effect, repository access, retry source, acceptance criteria, and safe test environment.

```text
Trigger -> Pre-task gate -> Explore -> Risk model -> Plan -> Approval gate (if needed)
        -> Implement -> Build/Test -> Independent replay verification -> Diff review -> Complete
```

## Stages
1. **Pre-task gate — owner: orchestrator.** Run the checks in `hooks/pre-task.md`. Stop if repository/test target is unsafe or ambiguous.
2. **Explore — owner: Repository Explorer.** Execute `skills/investigate-replay-safety.md`; produce side-effect/retry evidence.
3. **Plan — owner: orchestrator.** Choose stable replay identity, atomic protection, failure semantics, tests, and edit boundary.
4. **Approval checkpoint.** Stop before schema/database migration, breaking contract, production/config/security/destructive action. Resume only with explicit approval scoped to the proposed action.
5. **Implement — owner: Implementation Agent.** Execute `skills/implement-idempotency.md`.
6. **Test — owner: Implementation Agent.** Build and run unit/integration tests; preserve commands/output.
7. **Verify — owner: Verification Agent.** Independently run replay/concurrency checks and inspect all side effects.
8. **Final gate — owner: Verification Agent.** Execute `hooks/final-verification.md`; produce schema-conformant result.

## Produced artifacts
Investigation result JSON, replay-risk scan, implementation diff, test/build evidence, replay evidence, and final verdict.

## Retry rules
Transient tool/environment failures: maximum 2 retries with original output preserved. Test/build failures caused by implementation: maximum 2 fix-test cycles. Validation/business-rule/permission failures are not blindly retried. After limits, status is `blocked` or `unsafe` and evidence is escalated.

## Failure paths
Unknown remote side effect after timeout -> stop and classify unresolved. Missing permission -> stop; do not elevate. Unsafe test target -> stop. Required approval absent -> `needs-approval`. Repeated test failure -> `unsafe` or `blocked`.

## Definition of Done
All side effects inventoried; stable replay identity proven; atomic duplicate protection evidenced; build/tests pass; sequential and concurrent replay checks pass; no unintended diff; required approvals recorded; final contract says `safe`; no unresolved high/critical risk remains.
