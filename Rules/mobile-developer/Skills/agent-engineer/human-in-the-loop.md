# Human in the Loop

## Purpose
Place meaningful human control around ambiguous, high-impact, or irreversible agent actions.

## When to use
Use for financial, security-sensitive, external communication, destructive, privileged, or policy-sensitive actions.

## Inputs
Action types, risk levels, user roles, approval SLA, evidence needed for review.

## Context to inspect
Authorization model, audit requirements, UX, escalation routes, rollback capabilities, and automation goals.

## Core knowledge
Approval should occur at a decision boundary where a human can understand consequences. Excessive approvals create fatigue; missing approvals create uncontrolled risk.

## Procedure
1. Classify actions by impact and reversibility.
2. Define which classes require approval.
3. Present proposed action, rationale, evidence, and consequences.
4. Make approval explicit and scoped.
5. Revalidate state immediately before execution.
6. Prevent stale approval from authorizing changed actions.
7. Record actor, decision, timestamp, and executed result.
8. Define timeout, rejection, and escalation behavior.
9. Test race conditions and altered payloads.
10. Review approval rates and false-friction regularly.

## Decision points
Use confirmation for low-risk reversible actions; independent approval for high-impact changes; prohibit automation when risk cannot be bounded.

## Common failure patterns
Approval after execution, vague summaries, approval reuse, fatigue, hidden payload changes, and no audit trail.

## Verification
Prove unapproved actions cannot execute and approved actions exactly match what was reviewed.

## Expected output
A risk-based approval policy and enforceable execution gate.

## Stop conditions
Stop when accountable approvers or action consequences cannot be identified.