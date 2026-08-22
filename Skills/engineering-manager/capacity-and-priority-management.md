# Capacity and Priority Management

## Purpose
Allocate finite engineering capacity across product delivery, reliability, security, technical debt, support, and capability building using explicit trade-offs.

## When to use
Use during planning, overload, changing priorities, incident-heavy periods, or whenever commitments exceed sustainable capacity.

## Inputs
Roadmap, staffing, historical throughput, operational load, on-call work, strategic priorities, risks, dependencies, and mandatory obligations.

## Context to inspect
Inspect actual interrupt load, leave, onboarding, support burden, hidden maintenance work, specialist bottlenecks, and whether priorities are truly ordered.

## Core knowledge
Nominal headcount is not available capacity. Context switching, dependencies, operational work, and onboarding reduce effective throughput. Too many concurrent priorities increase cycle time.

## Procedure
1. Estimate available capacity from real team conditions.
2. Separate planned work from interrupts and mandatory operations.
3. Rank outcomes rather than labeling everything high priority.
4. Identify specialist and dependency constraints.
5. Limit work in progress to protect flow.
6. Reserve explicit capacity for known operational obligations where evidence supports it.
7. Negotiate scope, sequence, or dates when demand exceeds capacity.
8. Track unplanned work and recurring interruption sources.
9. Rebalance after major incidents, attrition, or priority changes.
10. Remove low-value commitments rather than silently overloading the team.

## Decision points
Favor fewer completed priorities over many partially started initiatives. Add people only for persistent capability or capacity needs; do not expect immediate throughput gains from hiring.

## Common failure patterns
Planning at 100 percent utilization, hidden support work, every stakeholder owning a priority, chronic overtime, excessive parallelism, and assuming engineers are interchangeable.

## Verification
Verify commitments fit realistic capacity, priorities have an explicit order, interrupt assumptions are visible, and overload triggers a trade-off rather than hidden overtime.

## Expected output
A capacity-aware priority plan with explicit allocations, constraints, and trade-offs.

## Stop conditions
Escalate when mandatory commitments exceed safe capacity or leadership refuses necessary trade-offs while maintaining incompatible deadlines.