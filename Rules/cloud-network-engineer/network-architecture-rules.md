# Network Architecture Rules

## Purpose
Define safe, scalable, and reviewable cloud network architecture decisions.

## Scope
Applies to virtual networks, VPCs/VNets, subnets, routing domains, connectivity models, shared services, and hybrid or multi-cloud topology.

## MUST
- Network boundaries MUST reflect trust, blast-radius, ownership, and failure-domain requirements.
- Address spaces, route domains, and connectivity dependencies MUST be documented before implementation.
- Shared network services MUST expose clear ownership, availability expectations, and dependency contracts.
- Architecture changes affecting cross-environment or cross-account connectivity MUST include rollback and impact analysis.
- High-risk topology changes MUST be reviewed by a qualified human before production execution.

## MUST NOT
- MUST NOT flatten trust zones merely for implementation convenience.
- MUST NOT create hidden transitive connectivity without documented intent.
- MUST NOT rely on undocumented provider defaults for critical routing behavior.

## SHOULD
- Prefer simple hub-and-spoke, segmented, or other explicit patterns over ad hoc peering meshes.
- Prefer reversible architecture changes with staged validation.

## Exceptions
Exceptions require documented constraints, alternatives considered, risk, compensating controls, and approval.

## Verification
Review diagrams, route tables, peering/transit configuration, infrastructure diffs, and connectivity tests against the intended architecture.