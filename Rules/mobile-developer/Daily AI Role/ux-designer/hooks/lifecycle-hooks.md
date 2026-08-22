# Lifecycle Hooks

## intake
Deterministically reject work items missing user/problem/outcome/owner. Label missing evidence as `assumption`; never convert assumptions into facts.

## before-design
Verify current flow, constraints, known evidence, affected states, accessibility context, and decision authority. If a critical dependency is unknown, mark blocked rather than guessing.

## before-review
Freeze the review candidate/version, list open questions, and assign independent review lanes. Do not allow reviewers to silently edit the source of truth.

## before-handoff
Check state coverage, content behavior, error/recovery logic, accessibility findings, rationale, dependencies, and unresolved risk.

## after-failure
Create a failure-learning record when rework, invalid evidence, missed critical state, or implementation mismatch materially affected delivery.

Hooks should be idempotent: rerunning them on unchanged inputs should not create new decisions or mutate artifacts unexpectedly.
