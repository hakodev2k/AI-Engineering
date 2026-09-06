# Cross-Functional AI Research Planning

## Purpose
Coordinate research with product, design, engineering, data science, safety, legal, and domain specialists so studies reflect actual system behavior and findings arrive in time to change decisions.

## When to use
Use when planning research programs, major AI launches, model migrations, agent capabilities, high-risk features, or multi-team initiatives.

## Inputs
Roadmap, technical milestones, research questions, system dependencies, stakeholder decisions, risks, release gates, and available evidence.

## Context to inspect
Inspect engineering architecture at the level needed to understand variability, evaluation plans, model release cadence, design prototypes, policy constraints, analytics, and decision dates.

## Core knowledge
AI research depends on configuration details that traditional UX research may not need: model version, prompts, retrieval, tools, permissions, latency, and evaluation state. Cross-functional alignment prevents studies from testing obsolete or nonrepresentative systems.

## Procedure
1. Identify decisions and latest dates when evidence can affect them.
2. Map stakeholders and required domain expertise.
3. Inventory existing evidence from research, evaluations, analytics, incidents, and support.
4. Identify system dependencies that could change during the study.
5. Define ownership for prototypes, model configuration, instrumentation, recruitment, and risk review.
6. Sequence formative, evaluative, and post-launch research around milestones.
7. Establish configuration freeze or version-recording practices for critical studies.
8. Define escalation criteria for severe findings.
9. Review evidence at decision checkpoints, not only at project completion.
10. Maintain a research backlog tied to unresolved decisions and risks.

## Decision points
Run research early when problem framing is uncertain; later when fidelity is required; in parallel with model evaluation when joint behavior matters. Delay a study rather than test a configuration known to be irrelevant to the decision.

## Common failure patterns
Research after decisions are locked, missing model metadata, duplicated studies across teams, unclear risk ownership, treating research as design validation, and ignoring evaluation evidence from engineering.

## Verification
Confirm each planned study has a decision, owner, system version strategy, evidence gap, delivery date, and escalation path.

## Expected output
A cross-functional research plan linking decisions, studies, dependencies, milestones, owners, evidence sources, and risks.

## Stop conditions
Stop when no stakeholder owns the decision, the target configuration is undefined, or required safety/legal/domain review cannot occur before participant exposure.