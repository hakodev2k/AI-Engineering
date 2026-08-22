# Technical Debt Prioritization

## Purpose
Evaluate technical debt as product risk and opportunity cost, enabling rational investment without treating all cleanup as equally valuable.

## When to use
Use when debt affects delivery speed, incidents, security, performance, operability, dependency upgrades, or future product options.

## Inputs
Engineering evidence, incident history, delivery friction, maintenance cost, roadmap, risk, and remediation estimates.

## Context to inspect
Inspect affected capabilities, recurrence, workaround cost, blast radius, upcoming changes, security exposure, and whether debt is localized or systemic.

## Core knowledge
Technical debt matters through its economic and risk effects. Some debt is intentional and acceptable; other debt compounds through repeated change cost or production risk.

## Procedure
1. Describe the debt in observable terms.
2. Identify current and future product impact.
3. Quantify recurring cost or risk where possible.
4. Determine whether upcoming roadmap work increases exposure.
5. Compare remediation options and partial improvements.
6. Prioritize severe security/reliability debt appropriately.
7. Decide whether to fix now, bundle with related work, or monitor.
8. Define success evidence for remediation.
9. Record accepted debt and revisit triggers.
10. Remove resolved items from tracking.

## Decision points
Fix immediately when risk is intolerable; bundle when remediation naturally aligns with planned change; defer when impact is low and monitoring is sufficient.

## Common failure patterns
Calling any disliked code debt, prioritizing by engineer frustration alone, ignoring compounding effects, endless rewrite proposals, and accepting debt without revisit conditions.

## Verification
The priority rationale connects technical condition to measurable product, operational, security, or delivery consequences.

## Expected output
A prioritized debt decision with impact, remediation approach, evidence, and revisit triggers.

## Stop conditions
Escalate when debt represents critical security or compliance exposure or remediation requires major architectural investment outside product authority.