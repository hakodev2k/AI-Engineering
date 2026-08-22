# Queue Visibility Timeout & Lease Renewal Protection Workflow

## Trigger
Use when a queue worker can run near or beyond its visibility timeout/lock duration, when duplicate delivery appears, or before changing queue concurrency, timeout, retry, renewal, or settlement behavior.

## Entry conditions
Repository is accessible, queue provider is identifiable, and production mutation is not required for investigation.

## Inputs
Task/incident description, repository root, provider, queue configuration, handler timing evidence, logs/metrics, tests.

## Context
`config/lease-policy.yaml`, receive/handler/renew/settle code, idempotency mechanism, provider ownership contract.

## Stages
1. **Explore** — Queue Behavior Explorer maps receive → ownership → renewal → handler → settlement/dead-letter paths.
2. **Plan** — define smallest safe change, acceptance criteria, and tests. Approval is required if production settings, destructive replay, purge, or infrastructure changes are proposed.
3. **Implement** — applying agent follows `skills/lease-safe-processing.md` and `rules/queue-lease-safety.md`.
4. **Deterministic checks** — run unit tests plus `python scripts/lease_guard.py --message-id smoke --output lease-result.json` from package root.
5. **Failure injection** — exercise ownership loss and renewal rejection; neither path may settle success.
6. **Independent verify** — Lease Verifier inspects evidence and diff.
7. **Complete or recover** — complete only on evidence-based pass.

## Responsible agents
Explore: Queue Behavior Explorer. Implementation: repository coding agent. Verification: Lease Verifier.

## Produced artifacts
Explorer evidence, implementation diff, test/build output, lease simulation result, verification decision, remaining-risk note.

## Checkpoints
- Ownership primitive identified before implementation.
- Idempotency strategy verified before side-effecting changes.
- Approval checkpoint before production configuration or destructive queue action.
- Independent verification after implementation.

## Retry rules
Transient test/tool failures: maximum 3 retries with backoff 2s, 5s, 10s; preserve previous output. Renewal logic failure: maximum 2 code-fix/retest cycles. Permission/configuration failures are not retryable without human action. Repeated identical failures stop the workflow.

## Failure paths
Lease semantics unknown → stop and gather provider contract. Build/test failure → preserve output and return to implementation up to 2 cycles. Lease-loss path still settles → block immediately. Production-only verification required → stop before mutation and request approval.

## Stop conditions
Stop on lease ownership ambiguity, missing idempotency for irreversible side effects, exhausted retry budget, missing approval, or any evidence that settlement can occur after lease loss.

## Definition of Done
- Ownership and timeout semantics are documented with evidence.
- Required change exists and is scoped.
- Slow-handler renewal passes.
- Lease-loss and renewal-rejection tests prove no success settlement.
- Duplicate delivery is idempotency-safe.
- Build/tests pass.
- Verification status is `pass`.
- No approval-required action remains unapproved.
- Remaining risks are explicitly documented.
