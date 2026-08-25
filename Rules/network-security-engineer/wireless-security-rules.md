# Wireless Security
## Purpose
Protect wireless access from unauthorized use, interception, and lateral movement.
## Scope
Enterprise Wi-Fi, guest wireless, authentication, controllers, and radio security.
## MUST
- Enterprise wireless MUST use approved authentication and encryption appropriate to risk.
- Guest and untrusted wireless MUST be isolated from protected internal networks.
- Administrative access to wireless infrastructure MUST follow privileged-access controls.
- Rogue and unauthorized access points MUST have a defined investigation process.
## MUST NOT
- Shared long-lived credentials MUST NOT protect sensitive enterprise wireless where stronger identity is feasible.
- Guest access MUST NOT inherit internal trust.
## SHOULD
- Wireless policy SHOULD support certificate-backed device/user identity where practical.
## Exceptions
Require documented constraints, compensating controls, approval, and review date.
## Verification
Inspect SSID policy, authentication, encryption, segmentation, controller logs, and wireless security scans.