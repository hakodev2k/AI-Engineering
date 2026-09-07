# Workload Identity Rules

## Purpose
Provide strong, lifecycle-bound identities for workloads across compute environments.

## Scope
Applies to virtual machines, containers, serverless functions, jobs, CI workers, and platform services.

## MUST
- Workload identities MUST be uniquely attributable to a workload or narrowly defined workload group.
- Credential issuance MUST bind identity to verifiable runtime or platform attributes.
- Workload credentials MUST be short-lived where the platform supports automatic renewal.
- Identity deletion or workload retirement MUST revoke future credential issuance.

## MUST NOT
- MUST NOT embed long-lived cloud credentials in images, source code, or deployment manifests.
- MUST NOT allow one workload identity to impersonate unrelated workloads by default.
- MUST NOT trust mutable labels alone when stronger attestation is available.

## SHOULD
- Prefer platform-native workload federation over secret distribution.
- Identity naming and ownership SHOULD support incident investigation and entitlement review.

## Exceptions
Static credentials require documented platform limitation, restricted scope, protected storage, rotation plan, monitoring, approval, and expiry.

## Verification
Inspect identity bindings, issuance policies, runtime attestation, credential TTLs, secret scans, and tests proving one workload cannot obtain another workload's credentials.