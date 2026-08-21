# SLO, SLI, and Error Budget Engineering

## Purpose
Define measurable reliability targets that connect user experience, operational risk, and engineering priorities. This skill prevents vague goals such as “five nines everywhere” and creates a repeatable basis for release and reliability decisions.

## When to use
Use when launching a service, revising reliability targets, evaluating chronic incidents, planning reliability work, or deciding whether feature velocity should be slowed. Do not use SLOs as contractual SLAs unless legal and commercial requirements explicitly require that mapping.

## Inputs
User journeys, service architecture, historical telemetry, business impact, incident history, latency/error distributions, dependencies, traffic profile, and existing commitments.

## Preconditions
The critical user-visible behaviors and telemetry sources must be understood well enough to measure success and failure.

## Context to inspect
Request paths, async workflows, dependency boundaries, synthetic checks, dashboards, alert rules, incident records, traffic seasonality, regional behavior, and existing SLAs.

## Core knowledge
SLIs quantify service behavior. SLOs define desired SLI performance over a window. Error budgets represent acceptable unreliability and create an objective mechanism for balancing reliability with delivery. Prefer user-centered indicators such as successful request ratio, durable processing completion, and latency thresholds over infrastructure-only metrics.

## Procedure
1. Identify the most important user journeys and failure modes.
2. Define candidate SLIs from observable events.
3. Validate that each SLI reflects user experience rather than implementation detail.
4. Select measurement windows and aggregation rules.
5. Establish SLO targets using business impact, historical capability, dependency limits, and cost.
6. Calculate the implied error budget.
7. Define how budget consumption affects release and reliability priorities.
8. Add dashboards showing current compliance and burn rate.
9. Review alerting so it detects material budget consumption rather than every anomaly.
10. Reassess targets after significant architecture, workload, or business changes.

## Decision points
Use tighter targets only when user harm justifies the cost. Use multiple SLOs when availability and latency have different failure modes. Avoid inheriting a downstream provider’s SLA as your own SLO without accounting for architecture and fallback behavior.

## Common failure patterns
Choosing arbitrary targets, using CPU as an SLI, ignoring low-volume critical workflows, averaging latency, excluding dependency failures from the user view, and creating SLOs without operational consequences.

## Verification
Confirm the SLI can be computed reproducibly, historical data produces plausible results, burn calculations match manual samples, and engineers can explain what action occurs when budget is consumed.

## Expected output
Documented SLIs, SLOs, measurement windows, error-budget policy, dashboards, and alerting aligned to user impact.

## Stop conditions
Escalate when legal SLAs conflict with feasible service capability, telemetry cannot measure the critical journey, or target changes require product or executive risk acceptance.