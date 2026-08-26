# Availability and SLO

## Purpose
Align cache design and operations with explicit service reliability objectives.

## Scope
SLIs, SLOs, error budgets, dependency objectives, and recovery targets.

## MUST
- Cache availability and latency expectations MUST derive from the consuming service's reliability requirements.
- Critical cache dependencies MUST define measurable SLIs and failure thresholds.
- Architecture MUST account for whether cache failure consumes the service error budget directly or through origin overload.
- Recovery objectives MUST be tested for material failure scenarios.

## MUST NOT
- Vendor or platform uptime claims MUST NOT substitute for end-to-end SLO evidence.
- Redundancy MUST NOT be declared sufficient without considering shared failure domains.
- Error budgets MUST NOT be ignored during risky cache migrations or topology changes.

## SHOULD
- Use user-visible service outcomes as the primary reliability lens.
- Review SLO assumptions as traffic and cache criticality change.

## Exceptions
Require explicit business acceptance of reduced objectives and documented mitigation.

## Verification
Review SLI definitions, dashboards, error-budget history, dependency maps, failover tests, and recovery measurements.