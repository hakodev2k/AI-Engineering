# Incident Containment Rules

## Purpose
Ensure security incidents can rapidly reduce trust, revoke access, limit blast radius, and preserve evidence without uncontrolled destructive action.

## Scope
Applies to suspected credential compromise, device compromise, workload compromise, policy bypass, malicious administration, lateral movement, and Zero Trust control failures.

## MUST
- Incident procedures MUST identify how to revoke or restrict affected user identities, workload identities, sessions, tokens, devices, certificates, privileges, and network paths.
- Containment actions MUST be scoped to the smallest effective blast radius consistent with incident severity and available evidence.
- Critical containment actions MUST preserve sufficient logs, timestamps, configuration state, and other evidence for later investigation when doing so does not materially increase immediate risk.
- Emergency policy changes MUST be attributable, documented, monitored, and reviewed after stabilization.
- High-impact containment that can cause broad production outage, data loss, or irreversible change MUST require accountable human approval unless an established emergency procedure explicitly authorizes immediate action.
- Incident responders MUST have a documented method to distinguish temporary containment from permanent remediation.
- Recovery MUST verify identity, policy, device, workload, and resource state before restoring normal access.

## MUST NOT
- Security controls MUST NOT be globally disabled merely to simplify incident troubleshooting.
- Compromised identities or devices MUST NOT regain access solely because the immediate alert has stopped.
- Destructive changes MUST NOT be executed when a reversible containment option achieves the required security objective, unless approved.
- Emergency exceptions MUST NOT remain after the incident without formal review and new justification.

## SHOULD
- Containment playbooks SHOULD include pre-approved reversible actions for common high-severity scenarios.
- Identity and policy systems SHOULD support rapid targeted revocation.
- Post-incident review SHOULD identify architectural changes that reduce future blast radius or detection time.

## Exceptions
Exceptions require incident context, rationale, risk, scope, accountable owner, evidence preserved, and retrospective approval if emergency conditions prevented prior approval.

## Verification
Review incident playbooks, revocation capabilities, emergency-access design, policy rollback, logging, tabletop exercises, and completed incident records. Test targeted revocation and recovery in representative non-production scenarios.