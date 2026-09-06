# Change Management Rules

## Purpose
Control model-risk changes introduced by new versions, prompts, retrieval logic, tools, data, infrastructure, or operating procedures.

## Scope
Applies to material changes affecting model behavior, controls, dependencies, or deployment context.

## MUST
- Material changes MUST be classified by risk impact before release.
- Changes affecting safety, security, public contracts, decision authority, or regulated behavior MUST receive explicit review and approval.
- Regression evaluation MUST target previously identified failure modes and critical controls.
- Change records MUST identify version, rationale, evidence, reviewer, rollback plan, and release conditions.
- Production changes MUST preserve traceability to the evaluated configuration.

## MUST NOT
- Teams MUST NOT bypass model-risk review by labeling behavioral changes as configuration-only changes.
- High-risk changes MUST NOT be deployed without a validated rollback or containment strategy unless explicitly approved.

## SHOULD
- Changes SHOULD be released progressively where staged exposure reduces uncertainty.
- Evaluation deltas SHOULD be compared against the prior production baseline.

## Exceptions
Urgent changes require documented incident context, bounded scope, compensating monitoring, approver, and post-change review.

## Verification
Inspect Git history, configuration diffs, release records, evaluation results, approvals, and rollback evidence.