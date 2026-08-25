# Application Security Incident Readiness Rules

## Purpose
Ensure application teams can contain, investigate, remediate, and safely recover from security incidents affecting application controls or data.

## Scope
Applies to account takeover, authorization bypass, injection, credential compromise, data exposure, malicious dependency, and other application-layer incidents.

## MUST
- Critical applications MUST identify security contacts, containment levers, relevant telemetry, credential/key rotation paths, and rollback or disablement options.
- Incident investigation MUST preserve relevant evidence and timestamps while minimizing unnecessary exposure of sensitive data.
- Containment actions MUST consider attacker persistence, token/session invalidation, compromised credentials, downstream integrations, and affected tenants/users.
- Emergency fixes MUST receive focused security verification before or immediately after deployment according to urgency and risk.
- Root cause and contributing control failures SHOULD be identified or bounded by evidence before declaring remediation complete.
- Material incidents MUST result in regression protection or systemic corrective action where practical.

## MUST NOT
- MUST NOT destroy or rewrite relevant evidence merely to restore service faster unless explicitly required for safety and documented.
- MUST NOT assume rotating one secret fully contains an incident without evaluating sessions, derived credentials, and persistence paths.
- MUST NOT disclose sensitive incident details beyond authorized audiences.

## SHOULD
- SHOULD rehearse high-impact containment paths and maintain operational runbooks.
- SHOULD favor reversible containment when it sufficiently reduces immediate harm.

## Exceptions
Emergency deviations require contemporaneous or retrospective documentation, accountable approval, and follow-up verification.

## Verification
Review runbooks, logging coverage, kill switches, revocation procedures, tabletop exercises, incident records, regression tests, and post-incident corrective actions.