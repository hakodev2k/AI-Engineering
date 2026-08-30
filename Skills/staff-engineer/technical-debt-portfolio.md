# Technical Debt Portfolio

## Purpose
Manage technical debt as a portfolio of business and engineering risks rather than an undifferentiated backlog of cleanup work.

## When to use
Use when debt spans teams, repeatedly affects delivery or incidents, or leaders need evidence-based prioritization of remediation investments.

## Inputs
Debt items, incident history, change failure data, delivery friction, dependency age, security findings, ownership, roadmap impact.

## Preconditions
Debt can be tied to measurable consequences or credible future risks.

## Context to inspect
Hotspot code, unsupported dependencies, brittle deployment paths, recurring defects, manual operations, scaling constraints, ownership gaps, and roadmap blockers.

## Core knowledge
Technical debt is context-dependent. Prioritize by interest paid: incidents, slowed change, elevated risk, operational cost, and blocked options. Some debt is rational and should remain.

## Procedure
1. Gather material debt from teams and operational evidence.
2. Rewrite each item as a concrete consequence or risk.
3. Estimate frequency, impact, and remediation cost.
4. Identify debt clusters with shared root causes.
5. Rank by expected interest and strategic constraint.
6. Choose paydown, containment, monitoring, or acceptance.
7. Integrate remediation with feature or platform work where efficient.
8. Assign owners and review triggers.
9. Remove items whose rationale no longer holds.

## Decision points
Pay down debt when expected ongoing cost exceeds remediation cost or when it blocks strategic options. Accept debt when consequences are bounded and transparent.

## Common failure patterns
Cleanup wish lists, prioritizing age instead of impact, refactoring without outcome metrics, no owner, and labeling disliked code as debt.

## Verification
Confirm prioritized items have evidence, remediation outcomes are measurable, and completed work reduces the stated cost or risk.

## Expected output
A ranked debt portfolio with evidence, treatment decisions, owners, and measurable expected benefits.

## Stop conditions
Stop when remediation requires major product trade-offs or destructive changes without business ownership.