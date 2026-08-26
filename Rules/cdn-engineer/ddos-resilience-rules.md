# DDoS Resilience Rules

## Purpose
Maintain service availability under volumetric and application-layer abuse.

## Scope
Applies to CDN absorption, rate controls, origin shielding, emergency controls, capacity, and attack response.

## MUST
- Critical services MUST define expected CDN and origin behavior under attack.
- Rate controls MUST identify protected resource, aggregation key, threshold rationale, and failure mode.
- Origin exposure that permits CDN bypass MUST be treated as a resilience risk.
- Emergency mitigation procedures MUST identify authorized operators and rollback criteria.
- Attack conclusions MUST use traffic, saturation, mitigation, and application evidence.

## MUST NOT
- MUST NOT set global blocking thresholds from normal averages alone.
- MUST NOT expose origin addresses unnecessarily through DNS, headers, or public configuration.
- MUST NOT execute broad production blocks without human authorization except pre-approved automated controls.

## SHOULD
- Test controls with safe simulations and historical traffic distributions.
- Maintain provider escalation paths and current operational contacts.
- Design graceful degradation for expensive endpoints.

## Exceptions
Emergency incident actions may bypass normal change windows under incident authority, but MUST be documented and reviewed afterward.

## Verification
Review bypass exposure, rate-policy tests, attack dashboards, origin saturation metrics, mitigation logs, runbooks, and controlled resilience exercises.