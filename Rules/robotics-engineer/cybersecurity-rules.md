# Cybersecurity Rules
## Purpose
Prevent compromise from becoming unauthorized observation, control, or unsafe physical action.
## Scope
Robot compute, networks, remote access, updates, credentials, and service interfaces.
## MUST
- Apply least privilege to identities, processes, devices, and remote operators.
- Authenticate consequential control and administrative interfaces and protect them in transit where threat model requires.
- Store secrets outside source code and rotate compromised credentials through an approved process.
- Maintain supported dependencies and evaluate vulnerabilities by exploitability and physical/operational impact.
- Define secure recovery for compromised or untrusted robot state.
## MUST NOT
- Ship default credentials or unauthenticated privileged remote control.
- Disable security controls merely to unblock deployment.
## SHOULD
- Segment safety/control networks from untrusted networks and minimize exposed services.
## Exceptions
Security exceptions require threat analysis, compensating controls, expiry, owner, and approval.
## Verification
Use configuration review, dependency scanning, network inspection, access tests, secret scanning, and adversarial testing.