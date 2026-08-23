# Dashboard Rules
## Purpose
Provide fast, trustworthy views for operations and diagnosis.
## Scope
Service, release, incident, capacity, and executive dashboards.
## MUST
- State dashboard purpose, audience, time window, units, and important query assumptions.
- Include deployment/version markers where releases can explain changes.
- Link critical panels to source queries or definitions.
## MUST NOT
- Use misleading axes, aggregations, or incomplete denominators.
- Present stale or broken panels as operational truth.
## SHOULD
- Organize service dashboards around traffic, errors, latency, saturation, and user outcomes where relevant.
## Exceptions
Specialized dashboards may focus narrowly when scope is explicit.
## Verification
Validate panel queries against raw samples, freshness, units, filters, and known events.