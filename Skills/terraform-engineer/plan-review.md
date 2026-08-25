# Plan Review

## Purpose
Review Terraform plans as change artifacts and detect unintended infrastructure impact before apply.

## When to use
Use for every material infrastructure change, especially production, migrations, imports, and provider upgrades.

## Inputs
Saved plan, configuration diff, requirements, policy results, environment metadata.

## Context to inspect
Resource addresses, create/update/delete/replace actions, sensitive values, unknowns, lifecycle rules, dependencies, provider version changes.

## Core knowledge
A plan is environment- and state-specific and can become stale. Replacement often hides behind ForceNew attributes. Unknown values and computed fields require judgment rather than automatic approval.

## Procedure
1. Confirm plan was generated from the intended commit, workspace, backend, and credentials.
2. Compare every action with the requested change.
3. Investigate deletes and replacements first.
4. Inspect identity keys, network/security changes, IAM, data stores, and public exposure.
5. Separate expected computed noise from meaningful drift.
6. Check policy and cost signals.
7. Require a fresh plan after material code/state changes.
8. Record approval evidence for high-risk changes.

## Decision points
Reject plans whose blast radius exceeds the change intent. Require staged rollout for changes affecting shared or stateful infrastructure.

## Common failure patterns
Approving by resource count, overlooking replacements, applying stale plans, ignoring unknown values, and reviewing code without reviewing provider-generated actions.

## Verification
The reviewed saved plan matches the apply artifact and contains only understood actions; post-apply plan converges to no unexpected changes.

## Expected output
An explicit approve/reject decision with risks and required safeguards.

## Stop conditions
Stop on unexplained destroy/replace, wrong environment, stale plan, policy failure, or missing owner approval for high-impact changes.