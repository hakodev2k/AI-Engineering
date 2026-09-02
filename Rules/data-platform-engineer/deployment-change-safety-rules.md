# Deployment and Change Safety Rules

## Purpose
Control production change risk for shared data infrastructure whose failures can affect many workloads or corrupt persistent state.

## Scope
Applies to platform code, infrastructure, configuration, schemas, runtimes, dependencies, policies, and production maintenance operations.

## MUST
- Production changes MUST have a reviewed diff, stated impact, validation plan, rollout strategy, observability, and rollback or forward-fix plan appropriate to risk.
- High-risk changes MUST use staged rollout, canary, shadow, or equivalent blast-radius reduction when technically feasible.
- Destructive data operations, irreversible migrations, security-control weakening, infrastructure destruction, and breaking platform contracts MUST require explicit human approval.
- Deployment automation MUST fail closed when required validation or approval gates are missing.
- Post-deployment verification MUST inspect consumer-visible and platform health signals, not only deployment status.

## MUST NOT
- MUST NOT force push or rewrite shared production history as a routine recovery technique.
- MUST NOT disable tests, policy gates, or security controls merely to unblock a release.
- MUST NOT combine unrelated high-risk changes when separation would materially improve rollback or diagnosis.

## SHOULD
- Prefer small reversible changes and progressive exposure.
- SHOULD schedule changes according to operational readiness and support coverage rather than convenience alone.

## Exceptions
Exceptions require urgency, reason, blast radius, compensating controls, approval, and retrospective review.

## Verification
Review pull requests, CI/CD gates, approval records, rollout telemetry, change audit logs, rollback tests, and post-deployment validation evidence.