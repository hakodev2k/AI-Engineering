# Engineering Strategy

## Purpose
Translate product and business direction into an executable engineering strategy that balances delivery, architecture, reliability, security, cost, and team capability.

## When to use
Use during annual or quarterly planning, major product shifts, platform investment decisions, or when engineering work lacks a coherent direction.

## Inputs
Business goals, product roadmap, architecture state, operational metrics, staffing, budget, technical debt, delivery history, and known risks.

## Context to inspect
Review current commitments, system constraints, incidents, bottlenecks, dependencies, team topology, skill gaps, and previous strategic decisions before proposing change.

## Core knowledge
Strategy is a set of choices, not a project list. Strong engineering strategy links measurable outcomes to technical capabilities, explicitly identifies what will not be prioritized, and accounts for uncertainty and organizational capacity.

## Procedure
1. Clarify business outcomes and planning horizon.
2. Assess current engineering capabilities and constraints.
3. Identify the few technical problems that materially limit outcomes.
4. Define strategic themes and measurable success criteria.
5. Evaluate options by impact, risk, reversibility, cost, and opportunity cost.
6. Sequence investments around dependencies and learning milestones.
7. Define ownership and decision boundaries.
8. Reserve capacity for reliability, security, and debt where evidence justifies it.
9. Communicate explicit trade-offs and non-goals.
10. Review leading indicators regularly and adapt when assumptions fail.

## Decision points
Prefer reversible experiments when uncertainty is high. Commit to foundational investment when repeated evidence shows a structural constraint. Do not fund platform work without identifiable consumers or outcomes.

## Common failure patterns
Roadmaps disguised as strategy, too many priorities, technology-first planning, ignoring staffing constraints, no success metrics, and treating technical debt as an undifferentiated backlog.

## Verification
Verify each strategic theme maps to a business or engineering outcome, has an accountable owner, measurable indicators, realistic capacity, and explicit trade-offs.

## Expected output
A concise engineering strategy with outcomes, priorities, sequencing, owners, metrics, risks, assumptions, and non-goals.

## Stop conditions
Escalate when business priorities conflict without an accountable decision maker, required financial constraints are unknown, or the strategy depends on unavailable capabilities.