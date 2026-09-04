# SLO and Error Budget Rules

## Purpose
Define measurable service expectations for AI systems and connect reliability decisions to explicit error budgets.

## Scope
Applies to service-level indicators, objectives, error budgets, burn rates, and reliability review.

## MUST
- Every production SLO MUST define the user-visible behavior it represents, the SLI formula, target, evaluation window, and accountable owner.
- SLOs MUST be based on measurable events rather than subjective health labels.
- Availability, latency, and quality SLOs MUST be separated when they represent distinct failure modes.
- Error-budget consumption MUST influence release and remediation decisions according to a documented policy.
- Changes to SLI definitions or targets MUST be versioned and reviewed.

## MUST NOT
- Internal component uptime MUST NOT substitute for a user-facing SLO when the component can be healthy while user requests fail.
- Planned exclusions MUST NOT be added retrospectively merely to improve reported compliance.
- Quality proxies MUST NOT be used as SLOs without validation and clear limitations.

## SHOULD
- Use burn-rate alerting for important SLOs.
- Review SLO usefulness after major architecture or product changes.

## Exceptions
A new service may begin with provisional SLOs if they are explicitly labeled, time-bounded, and scheduled for recalibration using production evidence.

## Verification
Review SLO definitions, raw event queries, burn-rate calculations, exclusion rules, historical incidents, and error-budget decision records.