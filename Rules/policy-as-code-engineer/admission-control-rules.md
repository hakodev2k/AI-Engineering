# Admission Control Rules

## Purpose
Protect runtime platforms by rejecting unsafe workloads and configuration before they enter protected environments.

## Scope
Applies to cluster admission, workload deployment, runtime manifests, platform resources, and policy-controlled configuration creation or mutation.

## MUST
- Admission policies MUST define whether each control is validating, mutating, or advisory.
- Blocking controls MUST have deterministic rejection reasons that identify the violated requirement without exposing sensitive data.
- Policies MUST validate security-sensitive fields after all relevant mutation has occurred.
- New blocking controls MUST be evaluated against representative existing workloads before broad enforcement.
- Availability behavior of the admission policy service MUST be explicitly defined for each risk class.

## MUST NOT
- Mutating policy MUST NOT silently weaken requested security settings.
- Fail-open behavior MUST NOT be used for high-risk admission decisions without explicit risk approval.
- Emergency bypasses MUST NOT be permanent or untracked.

## SHOULD
- New controls SHOULD begin in audit or dry-run mode when safe deployment requires impact discovery.
- Admission policies SHOULD minimize platform-specific coupling beyond the controlled resource contract.

## Exceptions
Require scope, reason, owner, expiry, compensating control, and approval appropriate to the risk.

## Verification
Test allowed and rejected manifests, mutation ordering, unavailable-policy-engine behavior, bypass paths, audit records, and representative production configuration before enforcement.