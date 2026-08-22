# AI PR Review Agent

Reusable package for evidence-based pull request review.

## Runtime status

This is a **reference-only review workflow**. It contains no executable validator and requires no installation. The host must provide the PR diff, repository instructions, acceptance criteria, build/test results, and a way to publish or record findings.

## Problem
Reduce noisy AI reviews by forcing context gathering, risk classification, evidence collection, and verification.

## Workflow
Trigger -> Collect diff -> Understand context -> Review -> Verify.

Follow `workflows/review-flow.md`, apply `rules/review-safety.md`, use `skills/pr-review.md`, and delegate independent checking according to `subagents/verification-agent.md`. Rehearse the workflow on a closed or synthetic change before integrating it with a live review system.

## Safety
No merge, deployment, secret modification, or security bypass actions are allowed.

## Definition of Done
- Findings include evidence.
- Risks are classified.
- Verification status is recorded.
- Every finding identifies a file/location, impact, evidence, and actionable remediation.
- Repository-native checks are recorded as passed, failed, or not run; absence of evidence is never reported as pass.
