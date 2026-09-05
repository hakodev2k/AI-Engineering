# Reliability Objective Rules

## Purpose
Translate network reliability expectations into measurable objectives that guide engineering trade-offs.

## Scope
Availability, reachability, latency, loss, recovery time, and other service-level indicators owned or influenced by networking.

## MUST
- Critical network services MUST define measurable reliability indicators tied to user or system impact.
- Objectives MUST specify measurement source, evaluation window, and ownership.
- Reliability decisions MUST consider current objective performance and known risk rather than availability anecdotes.
- Chronic objective misses MUST trigger investigation and corrective prioritization.
- Error-budget or equivalent risk tolerance MUST not be silently consumed by discretionary changes.

## MUST NOT
- MUST NOT define objectives solely from what is easy to measure when it fails to represent service impact.
- MUST NOT reset or exclude inconvenient data without documented rationale.
- MUST NOT claim an objective is met without reproducible measurement.

## SHOULD
- Use objectives to balance reliability work against change velocity.
- Review indicators when architecture or user expectations materially change.

## Exceptions
Exceptions require measurement limitation, alternative evidence, owner, and review date.

## Verification
Inspect SLI definitions, dashboards, objective reports, incident history, and prioritization decisions.