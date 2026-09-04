# Change Rollout Rules

## Purpose
Reduce production risk when agent behavior changes because prompts, models, tools, policies, memory, or orchestration are modified.

## Scope
Applies to production changes that can alter agent decisions, reliability, authority, latency, cost, or external side effects.

## MUST
- Behavior-affecting prompts, models, tools, policies, and workflow definitions MUST have identifiable versions or equivalent release traceability.
- Material changes MUST be validated in a non-production environment before production exposure.
- Consequential behavior changes MUST use a staged, canary, limited-cohort, or equivalent bounded rollout unless an approved emergency procedure applies.
- Every material rollout MUST define rollback or safe-disable behavior before deployment.
- Rollouts MUST monitor reliability, safety, task-success, latency, cost, and side-effect metrics relevant to the change.
- Breaking tool or state-schema changes MUST include a compatibility or migration strategy.
- Production changes that broaden authority, alter high-risk actions, or weaken controls MUST require explicit human approval.

## MUST NOT
- Untested behavior changes MUST NOT be released broadly to production.
- Multiple major behavior variables MUST NOT be changed together when doing so prevents attribution and rollback, unless the combined change is inseparable and documented.
- Rollout success MUST NOT be declared solely from absence of alerts when expected success metrics are unavailable.

## SHOULD
- Releases SHOULD preserve a known-good configuration that can be restored quickly.
- Canary cohorts SHOULD represent the risk profile of the intended production workload.

## Exceptions
Emergency rollout requires documented incident context, bounded exposure, accountable approval, enhanced monitoring, and a follow-up validation plan.

## Verification
Inspect release diffs, version metadata, evaluation evidence, canary configuration, approval records, monitoring results, and rollback tests or drills.