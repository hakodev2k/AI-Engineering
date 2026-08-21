# Migration and Modernization Rules

## Purpose
Control risk when replacing legacy systems, platforms, databases, or architecture patterns.

## Scope
Covers replatforming, cloud migration, database migration, service extraction, runtime upgrades, and major rewrites.

## MUST
- Migration proposals MUST define current-state constraints, target outcomes, sequencing, rollback/exit strategy, and measurable success criteria.
- Data migrations MUST include reconciliation and integrity validation.
- Incremental migration MUST define coexistence and routing behavior between old and new systems.
- Migration dependencies and cutover prerequisites MUST be explicit.
- Business continuity MUST be protected during migration.

## MUST NOT
- MUST NOT recommend a full rewrite solely because the current system is old or disliked.
- MUST NOT decommission the source system before required data, workflows, and operational capabilities are verified.
- MUST NOT hide migration scope inside unrelated feature work without ownership and risk review.

## SHOULD
- Prefer strangler/incremental approaches when they reduce risk and provide measurable checkpoints.
- Use production shadowing or parallel verification where feasible.

## Exceptions
Small isolated components may justify direct replacement when rollback and verification are simple.

## Verification
Review migration plans, dependency maps, reconciliation reports, cutover rehearsals, rollback tests, and post-migration metrics.