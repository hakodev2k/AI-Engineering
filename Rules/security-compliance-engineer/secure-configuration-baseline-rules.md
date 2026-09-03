# Secure Configuration Baseline Rules

## Purpose
Maintain approved security configuration baselines and detect unauthorized drift.

## Scope
Applies to operating systems, cloud services, containers, databases, network devices, endpoints, and security tooling.

## MUST
- Baselines MUST identify required settings, applicability, ownership, and validation methods.
- Baseline changes MUST be version controlled and reviewed for security and compliance impact.
- Material drift MUST be detected, investigated, and remediated or formally accepted.
- Exceptions MUST identify the exact setting, affected assets, risk, and expiry.

## MUST NOT
- Vendor defaults MUST NOT be assumed compliant without assessment.
- Baseline checks MUST NOT ignore unmanaged or newly deployed assets.
- Noncompliant settings MUST NOT be hidden by changing thresholds solely to improve reporting.

## SHOULD
- Enforce baselines through configuration management and policy-as-code where practical.
- Align baselines with recognized hardening guidance while preserving project-specific requirements.

## Exceptions
Exceptions require documented technical necessity, compensating controls, owner, deadline, and risk approval.

## Verification
Compare deployed configuration against the approved baseline, inspect drift reports, sample exceptions, and test automated enforcement.