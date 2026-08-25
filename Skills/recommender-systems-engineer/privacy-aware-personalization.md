# Privacy-Aware Personalization

## Purpose
Deliver personalization while minimizing data collection, retention, and unnecessary exposure of user information.

## When to use
Use when designing features, profiles, logging, retention, or cross-context personalization.

## Inputs
Personalization requirements, data inventory, consent/permission model, retention rules, and architecture.

## Context to inspect
Collected fields, purpose, storage locations, joins, access controls, deletion paths, exports, and derived features.

## Core knowledge
Data minimization, purpose limitation, least privilege, retention control, and deletion propagation should shape recommendation architecture. Derived embeddings and aggregates can still represent user-linked information.

## Procedure
1. Map each personalization signal to a specific product purpose.
2. Remove fields without demonstrated utility.
3. Prefer coarse or on-device/session signals when sufficient.
4. Define retention and deletion behavior for raw and derived data.
5. Restrict feature access to required services and workflows.
6. Avoid logging sensitive raw payloads unnecessarily.
7. Test deletion/consent-state propagation.
8. Review incremental model value against privacy cost.

## Decision points
Use persistent profiles only when long-term value is material; session-scoped state for transient intent; aggregate/anonymized statistics where individual linkage is unnecessary.

## Common failure patterns
Collect-everything design, indefinite retention, derived-data deletion gaps, hidden cross-context joins, and sensitive fields copied into logs.

## Verification
Audit data lineage, access, retention, consent behavior, and deletion across training and serving systems.

## Expected output
A minimized personalization data design with explicit lifecycle and access controls.

## Stop conditions
Stop when intended use lacks required authorization, deletion cannot propagate, or sensitive data is not necessary to meet the product goal.