# Technical Debt Portfolio

## Purpose
Manage technical debt as an evidence-based investment portfolio instead of an unprioritized collection of disliked code.

## When to use
Use when debt affects delivery speed, reliability, security, operability, cost, or ability to change critical systems.

## Inputs
Incident data, change lead time, defect patterns, architecture constraints, developer friction, security findings, cost data, and roadmap.

## Context to inspect
Inspect where debt creates measurable recurring cost, which systems are strategic, expected lifetime, migration plans, and whether proposed cleanup addresses root causes.

## Core knowledge
Not all old or imperfect code is debt worth paying. Debt matters when it creates interest: repeated operational cost, change friction, risk, or blocked capabilities.

## Procedure
1. Collect debt candidates with concrete symptoms.
2. Link each candidate to measurable impact or risk.
3. Estimate remediation cost and likely future interest.
4. Identify alternatives such as containment, replacement, automation, or retirement.
5. Prioritize by strategic relevance, exposure, and opportunity timing.
6. Integrate high-value remediation into product or platform planning.
7. Define measurable completion outcomes.
8. Avoid broad rewrites without incremental validation.
9. Track whether remediation reduces the predicted cost or risk.
10. Retire debt items when systems are being decommissioned or evidence no longer supports action.

## Decision points
Pay debt when expected avoided cost or enabled capability justifies investment. Contain or accept debt in stable low-change systems when remediation has poor return.

## Common failure patterns
Calling preferences debt, percentage-based debt budgets without evidence, rewrite enthusiasm, invisible reliability debt, and never deleting obsolete debt items.

## Verification
Verify prioritized items have quantified or clearly evidenced impact, a remediation hypothesis, owner, completion criteria, and post-change measurement.

## Expected output
A ranked technical-debt portfolio tied to engineering and business outcomes.

## Stop conditions
Escalate when remediation requires major product trade-offs, destructive migration, or risk acceptance outside engineering authority.