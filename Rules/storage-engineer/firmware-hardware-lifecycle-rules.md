# Firmware and Hardware Lifecycle Rules

## Purpose
Manage physical storage components and firmware without avoidable outages, incompatibility, or latent risk.

## Scope
Drives, controllers, enclosures, HBAs, firmware, compatibility matrices, spares, and end-of-support.

## MUST
- Hardware and firmware combinations MUST be supported or explicitly risk-accepted.
- Firmware changes MUST review release notes, known issues, compatibility, rollback capability, and redundancy state.
- Failed-media replacement MUST verify target identity and current redundancy before removal.
- End-of-support components in critical service MUST have a remediation or accepted-risk plan.

## MUST NOT
- MUST NOT replace, initialize, or reassign ambiguous hardware identifiers without independent verification.
- MUST NOT perform broad firmware rollout without staged validation where staging is possible.
- MUST NOT ignore predictive failure signals without triage.

## SHOULD
- Maintain tested spare strategy proportional to replacement lead time and failure impact.

## Exceptions
Unsupported emergency operation requires documented risk, monitoring, and exit criteria.

## Verification
Inspect inventories, support matrices, firmware baselines, health telemetry, replacement records, and lifecycle plans.