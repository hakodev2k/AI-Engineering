# Security Hardening Rules

## Purpose
Reduce Linux host attack surface without sacrificing required operability or diagnosability.

## Scope
Applies to host hardening, permissions, security modules, sysctl controls, services, remote access, and security baselines.

## MUST
- Hardening MUST begin from an approved baseline and be adjusted only for documented workload requirements.
- Unnecessary listening services, packages, accounts, and privileged capabilities MUST be removed or disabled.
- Sensitive files MUST have ownership and permissions appropriate to their consumers.
- SELinux, AppArmor, or equivalent mandatory controls MUST remain enforcing where part of the platform baseline unless an approved exception exists.
- Security-relevant configuration changes MUST be validated for both intended protection and service compatibility.

## MUST NOT
- Security controls MUST NOT be disabled globally to resolve a local policy or permission issue.
- World-writable permissions MUST NOT be used as a generic troubleshooting workaround.
- Hardening compliance MUST NOT be claimed solely from a checklist; effective runtime state and exceptions MUST be considered.

## SHOULD
- Use benchmark guidance as input, not as a substitute for threat and workload analysis.
- Prefer narrowly scoped policy adjustments over broad exclusions.
- Automate baseline validation in fleet compliance checks.

## Exceptions
Exceptions require threat impact, business requirement, compensating controls, owner, expiry/review date, and security approval for material weakening.

## Verification
Run configuration and vulnerability scanners, inspect effective permissions and security-module state, enumerate listening services and capabilities, review exceptions, and test critical workloads after hardening changes.