# Canary and Shadow Rollouts

## Purpose
Reduce release risk by exposing new AI behavior to controlled production traffic while measuring quality, safety, latency, and operational impact before broad rollout.

## When to use
Use for model changes, prompt revisions, routing logic, retrieval changes, agent policies, or infrastructure updates with meaningful uncertainty.

## Inputs
Candidate release, baseline release, traffic segmentation, success metrics, abort thresholds, telemetry, rollback controls.

## Preconditions
Traffic can be segmented and the candidate can be isolated from irreversible effects when needed.

## Context to inspect
Routing architecture, tenant boundaries, high-risk users, tool side effects, model capacity, provider quotas, observability, and incident procedures.

## Core knowledge
A canary serves real requests to a limited cohort; shadowing duplicates requests for observation without affecting user-visible outcomes. Shadow execution must suppress side effects and protect sensitive data.

## Procedure
1. Define cohort size and exclusion criteria.
2. Establish baseline metrics and abort thresholds.
3. Choose shadowing for uncertain behavior with unsafe side effects.
4. Validate no duplicate writes or external actions occur in shadow mode.
5. Start with minimal traffic.
6. Compare candidate and baseline by critical segments.
7. Monitor semantic quality, safety, latency, errors, token usage, and cost.
8. Pause expansion after each step long enough to observe delayed failures.
9. Abort and roll back on threshold violation.
10. Expand gradually only after evidence remains stable.

## Decision points
Use shadow mode when user impact or side effects cannot be safely canaried. Exclude high-risk workflows until evidence is stronger.

## Common failure patterns
Canarying only infrastructure metrics, duplicating tool calls in shadow mode, using too-large initial cohorts, and expanding before delayed effects appear.

## Verification
Confirm routing percentages, cohort membership, side-effect isolation, and candidate-vs-baseline metrics from production telemetry.

## Expected output
A staged rollout record with cohorts, observations, thresholds, decisions, and final disposition.

## Stop conditions
Stop expansion when critical thresholds fail, observability is insufficient, or the candidate cannot be isolated safely.