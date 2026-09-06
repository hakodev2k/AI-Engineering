# Workflow: Saga Compensation Safety Gate

## Trigger
A distributed workflow gains or changes side effects, retries, idempotency, orchestration, or compensation behavior; or an incident exposes partial-success recovery risk.

## Entry conditions
Target workflow identified; repository readable; no production mutation required for investigation.

## Inputs
Repository, acceptance criteria, `config/policy.yaml`, draft saga plan.

## Context
Load entry point and direct dependencies first; expand only to persistence, messaging, outbound clients, retries, and tests that evidence the workflow.

## Stages
1. **Explore** — Repository Explorer maps side effects, boundaries, failure windows, receipts, idempotency, and compensations.
2. **Plan** — Create a plan matching `schemas/saga-plan.schema.json`.
3. **Validate** — Run `python scripts/validate_saga.py <plan> --simulate --out .saga/plan-validation.json`.
4. **Implement** — Implementation Agent makes the smallest safe change.
5. **Test** — Run project tests covering success, duplicate delivery, ambiguous outcome, downstream failure, compensation, and repeated compensation where relevant.
6. **Review** — Inspect diff and approval boundaries.
7. **Verify** — Independent Verification Agent reruns deterministic validation and failure-path tests.
8. **Complete** — only status `verified` is success.

## Produced artifacts
Validated saga plan, `.saga/plan-validation.json`, test output, verification report.

## Checkpoints
No side effect lacks idempotency/reconciliation; compensation exists for reversible effects; retry counts are bounded; dangerous compensations have approval.

## Retry rules
Transient tool/environment failure: max 2 retries with evidence preserved. Deterministic validation/test failure: no blind retry. Implementation/test-fix loop: max 3 cycles, then escalate and stop.

## Approval points
Explicit human approval before destructive compensation, irreversible external action, schema/infrastructure/secret/production configuration change, breaking API contract, security weakening, or large dependency upgrade.

## Failure paths
Unknown external outcome -> reconcile before replay. Compensation failure -> preserve state and retry at most policy limit. Permission failure -> stop without privilege escalation. Business invariant failure -> blocked.

## Definition of Done
Saga plan is complete and valid; relevant tests pass; ambiguous outcomes are reconciled; retries/compensations are bounded and idempotent; required approvals exist; independent verifier reports `verified`; remaining risks are documented and non-blocking.
