# Configuration Hardening Rules

## Purpose
Reduce attack surface by enforcing secure configuration baselines.

## Scope
Applies to operating systems, services, applications, cloud resources, databases, middleware, and security tooling.

## MUST
- Security-relevant configuration MUST have an approved baseline appropriate to system risk.
- Unused services, ports, features, and default accounts MUST be disabled or removed where practical.
- Default credentials and insecure default settings MUST be changed before production use.
- Configuration drift affecting security MUST be detectable and remediated.
- Baseline changes MUST be reviewed and tested before broad rollout.

## MUST NOT
- MUST NOT weaken security controls solely to resolve deployment or compatibility issues without approved risk handling.
- MUST NOT rely on undocumented manual configuration for critical security settings when reproducible management is feasible.
- MUST NOT assume vendor defaults are appropriate for the deployment context.

## SHOULD
- Prefer policy-as-code, immutable configuration, and automated compliance checks.
- Prefer centralized baseline ownership and versioning.

## Exceptions
Exceptions require documented technical need, compensating controls, owner approval, and review date.

## Verification
Use configuration scanners, policy checks, file/config diffing, hardening benchmarks, runtime inspection, and periodic audits.