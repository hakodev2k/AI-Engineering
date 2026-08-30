# Release Safety Rules

## Purpose
Prevent trust-and-safety regressions during deployment of detectors, policy logic, reviewer tooling, product features, and enforcement infrastructure.

## Scope
Applies to production releases that can affect abuse exposure, detection, moderation, enforcement, reporting, appeals, or safety telemetry.

## MUST
- Safety-relevant releases MUST identify affected controls, expected behavior changes, test evidence, monitoring, rollback method, and accountable owner.
- High-impact changes MUST use staged rollout, canarying, feature flags, or equivalent containment where technically feasible.
- Release validation MUST include representative abusive, legitimate, ambiguous, and regression cases.
- Changes to public behavior, enforcement semantics, or policy mappings MUST be reviewed for backward compatibility and user impact.
- Production deployment of high-risk safety changes MUST require authorized human approval.
- Rollback procedures MUST be tested or otherwise demonstrated viable before broad exposure when rollback is part of the safety plan.

## MUST NOT
- MUST NOT deploy an irreversible enforcement migration without an approved recovery or remediation strategy.
- MUST NOT bypass safety tests or monitoring merely to meet a launch deadline.
- MUST NOT combine many independent high-risk changes into one rollout when doing so prevents attribution or safe rollback.
- MUST NOT declare rollout success before defined guardrails and operational metrics have been checked.

## SHOULD
- Releases SHOULD separate detector model changes from policy threshold changes when independent control improves diagnosis and rollback.
- High-risk releases SHOULD avoid periods with reduced incident-response coverage.
- Configuration changes SHOULD receive the same risk discipline as code changes when consequences are equivalent.

## Exceptions
Emergency fixes MAY use accelerated review during an active incident. They MUST remain narrowly scoped, explicitly approved, monitored, and followed by normal validation after containment.

## Verification
Inspect release plans, CI results, test sets, approvals, feature-flag configuration, rollout telemetry, rollback evidence, and post-release guardrail checks. Confirm production actions stayed within the approved scope.