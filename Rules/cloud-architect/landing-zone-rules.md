# Landing Zone Rules

## Purpose
Establish a governed cloud foundation that supports secure, scalable, and repeatable workload deployment.

## Scope
Applies to account/subscription/project structure, organizational hierarchy, policy baselines, shared services, and environment boundaries.

## MUST
- Landing zones MUST define ownership, environment separation, policy inheritance, identity boundaries, network boundaries, logging, and billing controls.
- Production and non-production workloads MUST have enforceable separation appropriate to risk.
- Guardrails MUST be codified and version controlled where the platform supports policy-as-code.
- Shared services MUST have explicit ownership, availability expectations, and dependency documentation.

## MUST NOT
- MUST NOT place unrelated workloads into one administrative boundary solely for convenience.
- MUST NOT rely on undocumented manual configuration as the primary control mechanism.
- MUST NOT weaken baseline controls to accelerate one workload without explicit risk approval.

## SHOULD
- Prefer repeatable templates over bespoke environment creation.
- Keep foundational controls independent from individual application release cycles.

## Exceptions
Any exception MUST state business need, risk, compensating controls, expiry or review date, and approver.

## Verification
Inspect hierarchy, policies, IAM, logging, network boundaries, infrastructure code, and exception records against the documented landing-zone design.