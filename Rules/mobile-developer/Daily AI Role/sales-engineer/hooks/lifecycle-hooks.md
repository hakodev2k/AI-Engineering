# Lifecycle Hooks

## On engagement start
Validate required input fields, create a source-of-truth record, classify urgency and approval risks, and assign the matching workflow.

## Before external claim
Check evidence source, date, scope, environment, and whether the wording exceeds the source. Block unsupported certainty.

## Before demo/POC
Check approved data, access, environment ownership, success criteria, rollback/cleanup, and stop conditions.

## Before customer delivery
Run fit-gap review, security/trust review when relevant, and verify all open questions have owners.

## On blocker
Record blocker, dependency owner, customer impact, workaround status, next review point, and escalation threshold.

## On failure
Capture root cause, customer impact, corrected statement/result, lesson, reusable process change, and prevention check.

Hooks should be idempotent: repeated execution updates the same engagement record rather than creating duplicate obligations.