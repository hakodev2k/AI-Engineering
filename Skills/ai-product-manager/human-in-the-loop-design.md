# Human-in-the-Loop Design

## Purpose
Design human review, approval, correction, and escalation where AI outputs or actions require oversight.

## When to use
Use for high-impact decisions, low-confidence outputs, regulated workflows, irreversible actions, or cases where expert judgment remains necessary.

## Inputs
Task risk, AI error modes, reviewer skills, throughput needs, latency limits, review costs, escalation paths, quality targets.

## Context to inspect
Current manual workflow, reviewer capacity, queue behavior, disagreement patterns, audit needs, user expectations, and automation opportunities.

## Core knowledge
Human review is not automatically safe or scalable. Reviewers can rubber-stamp outputs, become overloaded, or miss subtle errors. Effective oversight requires clear decision boundaries and usable evidence.

## Procedure
1. Classify tasks by consequence and reversibility.
2. Define which cases are auto-approved, reviewed, blocked, or escalated.
3. Specify evidence reviewers need to make a decision.
4. Design review interfaces that reduce anchoring and expose uncertainty.
5. Set service levels and queue limits.
6. Define reviewer guidance and escalation rules.
7. Measure override, disagreement, error, and turnaround rates.
8. Feed confirmed failures into product and evaluation improvements.
9. Reassess automation thresholds as evidence improves.

## Decision points
Use mandatory review where consequences are high. Use selective review where confidence and risk can be reliably stratified.

## Common failure patterns
Reviewing everything forever, hidden reviewer workload, rubber-stamping, ambiguous ownership, and using human review to mask poor model quality.

## Verification
Test representative decisions with reviewers and confirm escalation, audit, and override paths function as intended.

## Expected output
A review policy with routing rules, reviewer requirements, SLAs, metrics, and escalation paths.

## Stop conditions
Stop when review capacity, accountability, or evidence quality is insufficient for the proposed risk level.