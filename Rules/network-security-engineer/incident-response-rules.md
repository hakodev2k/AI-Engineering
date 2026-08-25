# Network Security Incident Response
## Purpose
Contain and investigate network-related security incidents without destroying evidence or causing uncontrolled outages.
## Scope
Intrusions, suspicious traffic, route abuse, DDoS, compromised devices, and policy bypass.
## MUST
- Response actions MUST distinguish observation, containment, eradication, and recovery.
- Evidence MUST preserve timestamps, source context, and chain of handling where required.
- Containment MUST consider blast radius and critical service dependencies.
- High-risk blocking or isolation actions MUST use authorized incident procedures.
## MUST NOT
- Logs or configurations MUST NOT be altered merely to make symptoms disappear.
- Attribution MUST NOT be asserted beyond available evidence.
## SHOULD
- Responders SHOULD capture volatile network evidence before disruptive actions when safe.
## Exceptions
Immediate safety or outage containment may precede full evidence capture when authorized.
## Verification
Review incident timeline, telemetry, packet/flow evidence, change records, approvals, and recovery validation.