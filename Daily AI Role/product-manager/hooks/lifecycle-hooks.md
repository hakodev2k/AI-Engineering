# Lifecycle Hooks

## on-intake
Reject feature-only framing. Require problem, target user, requester, urgency, and evidence status.

## before-discovery
Check whether the question can be answered from existing reliable evidence before commissioning new research.

## before-prioritization
Require comparable opportunity records and explicit confidence levels.

## before-roadmap-change
Check dependency impact, committed external dates, displaced work, and required stakeholder communication.

## before-launch
Require measurable launch criteria, instrumentation, rollback/containment ownership where relevant, and approval completion.

## after-launch
Create a review checkpoint with baseline, target, observed metrics, confounders, and next decision.

## on-failure
Capture root cause, lesson, process change, owner, and prevention check.

Hooks should be deterministic, idempotent where practical, and should not silently mutate business commitments.