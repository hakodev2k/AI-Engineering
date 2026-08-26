# Reliability and SLOs

## Purpose
Define measurable reliability expectations for shared ML platform capabilities.

## Scope
Availability, latency, durability, job completion, recovery, and service dependencies.

## MUST
- Critical platform services MUST have user-relevant SLIs and explicit reliability targets.
- SLOs MUST define measurement windows, exclusions, ownership, and escalation behavior.
- Reliability changes MUST be evaluated against dependent workload requirements and error-budget impact.
- Durable ML artifacts MUST have recovery objectives consistent with business impact.

## MUST NOT
- Availability MUST NOT be inferred from process uptime when users can still fail.
- Teams MUST NOT claim an SLO without a reproducible measurement source.

## SHOULD
- Error budgets SHOULD influence release pace and reliability investment.

## Exceptions
Temporary target relaxation requires owner approval, user-impact communication, and restoration criteria.

## Verification
Review SLI queries, SLO reports, dependency tests, recovery exercises, incident records, and error-budget decisions.