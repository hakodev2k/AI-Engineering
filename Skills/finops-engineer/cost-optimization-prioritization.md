# Cost Optimization Prioritization

## Purpose
Turn a large backlog of cost opportunities into a rational execution plan based on verified savings, engineering effort, risk, reversibility, and strategic value.

## When to use
Use after cost discovery, provider recommendations, architecture reviews, or when teams have more opportunities than delivery capacity.

## Inputs
Opportunity estimates, workload ownership, implementation effort, SLOs, roadmap, risk, dependencies, commitment implications.

## Context to inspect
Inspect whether savings are gross/net, recurring/one-time, already captured elsewhere, technically feasible, and compatible with roadmap and reliability requirements.

## Core knowledge
The largest theoretical saving is not always the best next action. Favor high-confidence, low-risk, repeatable improvements while reserving deeper architecture work for material unit-economic gains.

## Procedure
1. Normalize opportunity estimates to a common period and cost basis.
2. Remove duplicates and mutually exclusive options.
3. Validate baseline and savings mechanism.
4. Estimate engineering effort and operational risk.
5. Assess reversibility, dependencies, and roadmap fit.
6. Score confidence in realizing savings.
7. Prioritize quick wins, strategic changes, and experiments separately.
8. Assign owners and target dates.
9. Define measurement before implementation.
10. Re-rank using realized results and changed assumptions.

## Decision points
Prefer reversible changes when evidence is weak. Prioritize unit-cost improvements over absolute cuts when growth is intentional. Delay optimization that conflicts with imminent migration.

## Common failure patterns
Summing overlapping opportunities, using provider estimates as guaranteed savings, ignoring engineering labor, optimizing soon-to-be-retired systems, and rewarding teams for cost cuts that harm SLOs.

## Verification
Each prioritized item has validated baseline, owner, measurement plan, and risk assessment; realized savings are tracked separately from opportunity.

## Expected output
A ranked optimization portfolio with confidence, effort, risk, owner, measurement, and expected value.

## Stop conditions
Escalate when an optimization requires architecture or reliability trade-offs without accountable approval.