# Dependency and Provider Incident Rules

## Purpose
Manage incidents originating from external model providers, APIs, libraries, data services, or infrastructure dependencies.

## Scope
Applies to third-party AI providers and any external dependency capable of changing AI behavior or availability.

## MUST
- Investigation MUST identify dependency version, endpoint, region, configuration, and observed provider behavior when relevant.
- Provider status claims MUST be corroborated with local telemetry and request evidence where available.
- Fallback or failover behavior MUST preserve required security, privacy, safety, and contract guarantees.
- Material provider changes that alter model behavior or data handling MUST be treated as controlled production changes.
- Incident communication MUST distinguish provider-confirmed facts from local hypotheses.
- Critical dependencies MUST have documented escalation and fallback expectations appropriate to their risk.

## MUST NOT
- Responders MUST NOT assume an external provider caused an incident solely because timing coincides with a provider event.
- Failover MUST NOT route protected data to an unapproved provider.
- Emergency provider switching MUST NOT silently change public or compliance-critical behavior without authorization.

## SHOULD
- Preserve provider request IDs and correlation metadata.
- Test fallback paths periodically for critical AI capabilities.

## Exceptions
If no compliant fallback exists, controlled degradation or feature disablement is preferable to an unsafe provider substitution.

## Verification
Review provider telemetry, request IDs, dependency configuration, failover tests, data-processing constraints, and incident timeline.