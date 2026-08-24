# Operating System Baseline Rules

## Purpose
Keep Linux hosts supportable, reproducible, secure, and operationally consistent.

## Scope
Applies to server distributions, images, packages, kernel baselines, repositories, and host-level defaults.

## MUST
- Hosts MUST use an approved, supported distribution and release with a defined security-maintenance window.
- The intended OS, kernel, package repositories, architecture, and baseline configuration MUST be declared in version-controlled automation or equivalent controlled configuration.
- Baseline drift affecting security, reliability, or supportability MUST be detectable.
- End-of-life dates and upgrade ownership MUST be tracked before production adoption.
- Exceptions from the baseline MUST record the dependency or workload requiring them and the resulting operational risk.

## MUST NOT
- Production hosts MUST NOT depend on untracked manual package installation or configuration.
- Unsupported or end-of-life releases MUST NOT remain in production without explicit risk acceptance and a dated remediation plan.
- Untrusted package repositories MUST NOT be enabled to bypass dependency or availability problems.

## SHOULD
- Fleets SHOULD minimize unnecessary distribution and kernel variants.
- Immutable or replace-over-repair host patterns SHOULD be preferred where workload architecture supports them.
- Baseline changes SHOULD be staged through representative non-production systems before broad rollout.

## Exceptions
An exception requires documented reason, affected hosts, duration, compensating controls, validation evidence, owner, and approval proportional to production risk.

## Verification
Review inventory against approved baselines, compare package and kernel state to declared configuration, run drift/configuration checks, inspect repository definitions, and verify lifecycle records and exception expiry dates.