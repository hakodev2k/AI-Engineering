# Rollout Planning Skill

## Purpose
Convert a feature-flag change into a bounded progressive rollout plan with explicit success metrics, rollback criteria, ownership, expiry, and approval boundaries.

## When to use
Use before enabling a new feature, risky behavior change, model/provider change, performance optimization, migration path, or production configuration behind a feature flag.

## Inputs
Feature intent, flag key, environment, target population, expected risk, relevant telemetry, repository/config context, owner, and rollback mechanism.

## Preconditions
- The flag already exists or creation is separately approved.
- The agent can inspect relevant code/config and observability definitions.
- The agent does not have authority to silently enable production flags.

## Required context
Flag evaluation sites, default behavior, fallback path, affected services, user/tenant segmentation, error/latency metrics, business acceptance criteria, and known dependencies.

## Allowed tools
Repository search/read, test/build tools, observability query tools in read-only mode, rollout validator, feature-flag provider read APIs.

## Constraints
- Never treat flag presence as proof that rollback is safe.
- Never use a 100% first stage when canary rollout is required.
- Do not invent thresholds without evidence; mark unknown thresholds as an open question and stop before execution.
- Production activation and full rollout require human approval when policy says so.

## Process
1. Locate every flag evaluation entry point and identify the default/off path.
2. Confirm the fallback behavior remains functional and testable.
3. Identify affected users, tenants, regions, services, databases, queues, and external dependencies.
4. Select the smallest useful initial cohort.
5. Define staged exposure with explicit percentages/targets and minimum observation durations.
6. Define measurable success criteria for every stage.
7. Define abort thresholds for required metrics such as error rate and latency.
8. Define rollback trigger and exact rollback action.
9. Set owner and expiry/removal date.
10. Save the plan using `templates/rollout-plan.yaml`.
11. Run `scripts/validate_rollout.py` against `config/policy.yaml`.
12. If blocked, fix the plan without weakening policy. If approval is required, stop at the approval checkpoint.
13. Hand the validated plan to the rollout workflow and verifier.

## Expected output
A complete rollout plan, validation result, affected-component list, facts, assumptions, open questions, and approval requirements.

## Verification
The validator returns `passed` or `approval_required`; every stage has success criteria; required metrics have abort thresholds; rollback is concrete; owner and expiry are present.

## Failure handling
Unknown telemetry or rollback behavior blocks production progression. Validation failure may be corrected and retried twice. Permission failure stops; do not broaden permissions automatically.

## Stop conditions
Missing rollback path, unknown environment, missing required metrics, unbounded target cohort, unsafe default behavior, or required approval not yet granted.
