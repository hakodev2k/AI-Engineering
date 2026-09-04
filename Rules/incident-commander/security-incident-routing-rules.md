# Security Incident Routing Rules

## Purpose
Ensure incidents with possible security implications receive appropriate containment, confidentiality, and specialist ownership.

## Scope
Applies to suspected compromise, unauthorized access, credential exposure, malicious activity, sensitive-data exposure, or integrity violations.

## MUST
- Escalate suspected security impact to the designated security response function without waiting for complete proof.
- Restrict sensitive incident details to authorized channels when disclosure could increase risk.
- Preserve relevant forensic evidence before destructive remediation when feasible.
- Coordinate containment actions with security owners when they may affect evidence, access, or attacker visibility.
- Treat credential rotation, access revocation, and security-control changes as explicit high-risk actions requiring accountable approval.

## MUST NOT
- Publicly disclose exploit details, credentials, indicators, or sensitive customer information without authorization.
- Destroy forensic evidence merely to restore convenience.
- Disable security controls solely to accelerate recovery.

## SHOULD
- Separate operational restoration from forensic investigation when both can proceed safely in parallel.

## Exceptions
Immediate containment may precede forensic preservation when continued compromise creates greater risk; document the trade-off and approval.

## Verification
Inspect escalation timestamps, restricted-channel use, evidence preservation, approval records, containment actions, and security-owner participation.