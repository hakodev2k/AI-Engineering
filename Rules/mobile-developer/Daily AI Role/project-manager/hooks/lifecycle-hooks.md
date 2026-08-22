# Lifecycle Hooks

## on-intake
Create project ID, objective, sponsor, PM owner, source links, target outcome and initial constraints. Idempotent: do not duplicate an existing project ID.

## before-baseline
Run project-plan validation, dependency review, risk review and approval check. Fail closed on missing sponsor, scope, target, owners or blocking decisions.

## on-change-request
Record requester, reason, affected baseline, impact on scope/schedule/cost/risk and required approver before applying any baseline change.

## before-status-publish
Refresh milestone, RAID and dependency state; reject unsupported green status.

## before-handoff
Run Definition of Done and ensure residual risks/issues have owners and dates.

## after-material-failure
Create a failure-learning record: root cause, contributing system conditions, lesson, process improvement, prevention owner and verification date.
