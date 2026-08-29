# AI Decommissioning Rules

## Purpose
Retire AI systems safely so obsolete models, data, credentials, integrations, and governance assumptions do not remain as hidden production risk.

## Scope
Applies to system retirement, model replacement, provider exit, feature shutdown, access removal, data disposition, evidence retention, and dependency cleanup.

## MUST
- Every material AI system MUST have a documented owner responsible for decommissioning when the system is retired or replaced.
- Decommissioning plans MUST identify production endpoints, model deployments, data stores, credentials, scheduled jobs, retrieval indexes, tools, integrations, monitoring, and downstream consumers.
- Production traffic and dependent workflows MUST be migrated, disabled, or explicitly accepted before final shutdown.
- Privileged identities, API keys, service accounts, tool permissions, and vendor access no longer required MUST be revoked.
- Data MUST be retained, deleted, or transferred according to approved retention, privacy, legal, contractual, and investigation requirements.
- Governance records and evidence required for audit or incident reconstruction MUST remain accessible for the applicable retention period.
- Inventory state MUST be updated only after technical and operational retirement is verified.

## MUST NOT
- MUST NOT mark a system decommissioned merely because its user interface is hidden or development has stopped.
- MUST NOT leave obsolete model endpoints or privileged credentials reachable without an approved residual purpose.
- MUST NOT delete evidence required by active investigations, legal holds, regulatory duties, or approved retention rules.
- MUST NOT abandon downstream consumers without confirming replacement or shutdown behavior.

## SHOULD
- Decommissioning SHOULD include a post-retirement check for residual traffic, cost, access, scheduled execution, and monitoring signals.
- Provider exits SHOULD verify deletion or return of customer data when contractually required.
- Reusable controls and documentation SHOULD be preserved without retaining unnecessary sensitive data.

## Exceptions
Exceptions MUST identify the residual component, owner, reason, duration, access restrictions, risk, monitoring, and approval. Indefinite residual infrastructure SHOULD be treated as an active governed asset rather than a decommissioning exception.

## Verification
Inspect deployment platforms, DNS or endpoints, access-control systems, secret stores, scheduled jobs, data stores, vendor records, billing, monitoring, inventory state, and retention evidence. Confirm no unintended traffic or privileged access remains.