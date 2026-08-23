# Steady State Rules
## Purpose
Define measurable normal behavior before disruption.
## Scope
User outcomes, SLOs, service health, and dependencies.
## MUST
- Define observable steady-state indicators before fault injection.
- Establish a valid baseline close enough to the experiment to support comparison.
## MUST NOT
- Use deployment success or host uptime alone as service steady state.
- Continue when baseline is already materially unhealthy unless explicitly testing that condition.
## SHOULD
- Prefer user-visible success, latency, and error indicators.
## Exceptions
Degraded-mode experiments require the degraded baseline to be explicit.
## Verification
Review baseline queries, SLOs, dashboards, and pre-run health.