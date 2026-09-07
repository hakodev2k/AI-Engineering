# Human-in-the-Loop Approval

## Purpose
Create meaningful approval gates for ambiguous, high-impact, or irreversible actions.

## When to use
Use for financial, administrative, destructive, external communication, sensitive disclosure, or similar actions.

## Inputs
Risk, reversibility, intent, authorization, payload, resources, audit needs.

## Context to inspect
Inspect timing, displayed details, mutation, expiry, approver authority.

## Core knowledge
Approvers must see material action and approved parameters must not silently change; excessive confirmation causes fatigue.

## Procedure
1. Classify impact/reversibility.
2. Define thresholds/approvers.
3. Present target/consequence/parameters.
4. Bind approval to payload.
5. Expire on context/time changes.
6. Revalidate authorization.
7. Prevent hidden follow-ups.
8. Record evidence.
9. Test races/mutation.
10. Review fatigue.

## Decision points
Increase approval strength with impact.

## Common failure patterns
Generic confirmation, changed arguments, no expiry, wrong approver, fatigue.

## Verification
Material changes invalidate approval; unapproved execution fails.

## Expected output
Risk-based tamper-resistant approval flow.

## Stop conditions
Escalate high-impact actions lacking bound authorization.