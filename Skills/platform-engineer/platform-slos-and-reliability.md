# Platform SLOs and Reliability

## Purpose
Define measurable reliability expectations for platform capabilities and use them to guide engineering priorities.

## When to use
Use for shared services whose failures affect multiple development teams or production delivery.

## Inputs
User journeys, incident history, business impact, telemetry, dependency SLOs, and maintenance constraints.

## Context to inspect
Availability data, latency distributions, failure modes, support tickets, dependency contracts, and recovery procedures.

## Core knowledge
SLOs should represent user-visible outcomes. Error budgets balance reliability investment against change velocity.

## Procedure
1. Identify critical platform capabilities and users.
2. Define measurable SLIs.
3. Set realistic SLO targets from impact and evidence.
4. Establish error-budget policy.
5. Align alerts with meaningful budget burn.
6. Track dependency contribution to failures.
7. Prioritize reliability work when budget policy triggers.
8. Review targets as usage evolves.

## Decision points
Avoid extreme targets without justified business value; higher reliability carries engineering and cost trade-offs.

## Common failure patterns
SLOs based on infrastructure uptime only, arbitrary 100% targets, no error-budget action, and hidden dependency failures.

## Verification
SLIs are queryable, historical performance is known, alerts reflect burn, and teams understand actions when budgets are exhausted.

## Expected output
Documented SLIs, SLOs, error budgets, alerts, and reliability decision policy.

## Stop conditions
Stop when user impact cannot be measured or target ownership is absent.