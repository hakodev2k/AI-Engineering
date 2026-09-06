# Platform Self-Service Automation

## Purpose
Turn common API platform operations into safe self-service workflows that reduce tickets while preserving governance.

## When to use
Use for API onboarding, route creation, credentials, quotas, documentation publication, or environment provisioning that currently depends on manual platform-team work.

## Inputs
Current workflows, policy requirements, platform APIs, ownership model, audit requirements, failure history.

## Context to inspect
Inspect ticket patterns, manual approvals, CI/CD, identity, infrastructure-as-code, exception handling, and audit logs.

## Core knowledge
Self-service should encode paved-road policy and validation, not simply expose privileged infrastructure controls. Operations must be repeatable, reviewable, idempotent, and recoverable.

## Procedure
1. Rank repetitive platform requests by volume and risk.
2. Map current workflow, decisions, and approvals.
3. Separate automatable policy from judgment requiring review.
4. Define declarative inputs and validation.
5. Implement least-privilege execution identity.
6. Make operations idempotent and concurrency-safe.
7. Produce previews/diffs before high-impact changes.
8. Record audit evidence and ownership.
9. Provide rollback or compensating actions.
10. Measure adoption, failure rate, lead time, and support reduction.

## Decision points
Automate stable, deterministic policy first. Keep exceptional high-risk decisions behind explicit approval rather than creating hidden bypasses.

## Common failure patterns
Automation with broad credentials, mutable manual state outside source control, non-idempotent workflows, and self-service that omits rollback.

## Verification
Run repeated requests, invalid inputs, concurrent changes, permission tests, and rollback scenarios.

## Expected output
A paved-road workflow that teams can safely execute without platform-team intervention.

## Stop conditions
Stop when automation would require uncontrolled production privileges or policy decisions are not yet deterministic.