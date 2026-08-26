# DNS Change Safety Rules

## Purpose
Prevent authentication and routing outages caused by unsafe email-related DNS changes.

## Scope
TXT, MX, CNAME, SPF, DKIM, DMARC, return-path, tracking-domain, and related DNS changes.

## MUST
- Material DNS changes MUST record current state, intended state, dependency impact, verification steps, and rollback plan before execution.
- TTL behavior and propagation time MUST be considered in cutover and rollback planning.
- Authentication changes MUST be staged so old and new valid configurations overlap where protocol semantics allow.
- DNS ownership and delegation boundaries MUST be verified before changes.
- Production-impacting DNS changes MUST require authorized human approval.

## MUST NOT
- MUST NOT delete working records before replacement behavior is verified when an overlap strategy is available.
- MUST NOT weaken authentication policy merely to simplify a migration.
- MUST NOT make unrelated DNS changes in the same emergency change without explicit need.

## SHOULD
- Use infrastructure-as-code or reviewed change records where available.
- Lower TTL in advance only when the operational benefit justifies additional query load and cache behavior.

## Exceptions
Emergency changes require incident justification, minimal scope, live verification, rollback readiness, and post-change review.

## Verification
Compare authoritative DNS before and after, resolve from multiple paths, inspect representative messages, validate authentication, and confirm dependent services and monitoring remain healthy.