# Migration Strategy and 6Rs

## Purpose
Select an appropriate migration treatment for each workload instead of defaulting to lift-and-shift or modernization.

## When to use
Use after discovery and before wave planning when deciding whether to rehost, replatform, refactor/re-architect, repurchase, retain, or retire workloads.

## Inputs
Assessment data, business roadmap, application lifecycle, technical debt, cloud target capabilities, cost model, compliance constraints, dependency map, deadlines, and team capacity.

## Preconditions
Discovery must be sufficiently complete to understand business criticality, dependencies, data, and support status.

## Context to inspect
Inspect workload architecture, change cadence, operational pain, licensing, portability, vendor roadmaps, scaling characteristics, data gravity, latency, security controls, and retirement opportunities.

## Core knowledge
Migration treatment is a portfolio decision balancing time, risk, value, and future operating cost. Rehost minimizes change but can preserve inefficiency. Replatform introduces bounded change. Refactoring can unlock elasticity and maintainability but raises delivery risk. Repurchase shifts capability to SaaS. Retain and retire are legitimate outcomes.

## Procedure
1. Define decision criteria and scoring dimensions.
2. Establish business deadlines and non-negotiable constraints.
3. Evaluate each migration unit against the six treatments.
4. Estimate change surface, testing burden, rollback complexity, and operational readiness.
5. Compare near-term migration cost with post-migration run cost and strategic value.
6. Identify workloads whose lifecycle makes modernization wasteful.
7. Identify workloads whose architecture makes rehost operationally dangerous or uneconomic.
8. Record assumptions and evidence.
9. Select a provisional treatment and fallback treatment.
10. Review cross-workload dependencies that may constrain choices.
11. Obtain owner agreement and record decisions.
12. Revisit treatment when discovery or pilot evidence changes materially.

## Decision points
Prefer rehost when speed dominates and the target can safely support current behavior. Prefer replatform when managed services remove meaningful toil with bounded code change. Refactor when business value and lifecycle justify the risk. Repurchase when commodity capability is cheaper to consume than own.

## Common failure patterns
Calling every migration a modernization; selecting treatment by technology fashion; ignoring licensing; refactoring near end-of-life systems; underestimating testing; failing to price steady-state operations; retaining workloads without an explicit reason.

## Verification
Every migration unit has a documented treatment, rationale, assumptions, expected benefits, risk level, fallback, and owner approval. Portfolio totals fit schedule, budget, and engineering capacity.

## Expected output
A defensible workload treatment matrix that feeds target architecture, wave planning, and financial forecasts.

## Stop conditions
Escalate when business lifecycle is unknown, treatment requires unsupported product changes, regulatory constraints are unresolved, or cost/risk estimates are too uncertain for commitment.