# Security and Abuse Rules

## Purpose
Prevent legitimate sending infrastructure from becoming an abuse channel or credential-amplification mechanism.

## Scope
Account compromise, API abuse, spoofing, tenant abuse, credential security, anomalous sending, and emergency containment.

## MUST
- Sending credentials and administrative access MUST use least privilege and strong authentication controls.
- Systems MUST detect material anomalies in volume, recipient distribution, sender identity, and authentication state.
- Suspected compromise MUST support rapid containment of the affected credential, tenant, or stream without disabling unrelated critical mail where feasible.
- Abuse investigations MUST preserve relevant evidence and distinguish compromise from legitimate volume changes.
- High-risk access or secret rotation in production MUST require authorized human control according to incident procedures.

## MUST NOT
- MUST NOT disable authentication, suppression, or abuse controls merely to restore throughput.
- MUST NOT expose recipient lists, message content, or credentials beyond the minimum investigation need.
- MUST NOT resume compromised traffic before the entry path is removed or bounded by compensating controls.

## SHOULD
- Use per-application or per-tenant credentials and quotas where isolation improves containment.
- Regularly exercise credential-revocation procedures.

## Exceptions
Emergency deviations require incident commander or equivalent approval, bounded scope, monitoring, expiry, and documented follow-up.

## Verification
Review access policies, credential inventory, audit logs, anomaly alerts, abuse runbooks, incident exercises, and evidence from recent access changes.