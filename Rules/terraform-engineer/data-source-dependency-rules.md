# Data Sources and Dependencies

## Purpose
Keep external lookups and dependency relationships deterministic and operationally safe.

## Scope
Data sources, remote state references, explicit dependencies, external identifiers, and cross-stack contracts.

## MUST
- Data-source queries MUST identify resources deterministically enough to avoid selecting unintended objects.
- Cross-stack dependencies MUST have a stable, documented contract and ownership boundary.
- Remote-state consumption MUST expose only required outputs and respect access boundaries.
- Dependency cycles and apply-time unknowns affecting critical behavior MUST be resolved or explicitly understood before production apply.

## MUST NOT
- Broad name/tag searches MUST NOT be used when they can ambiguously select infrastructure.
- Consumers MUST NOT depend on internal state representation when a stable output or service-discovery contract is available.
- `depends_on` MUST NOT be added indiscriminately to mask unclear dependency design.

## SHOULD
- Prefer explicit identifiers and typed outputs.
- Minimize cross-state coupling to reduce coordinated deployment requirements.

## Exceptions
Provider limitations require documented selection assumptions, uniqueness guarantees, ownership, and tests.

## Verification
Inspect data-source filters, remote-state permissions, outputs, dependency graphs, plan unknowns, module contracts, and tests across representative environments.