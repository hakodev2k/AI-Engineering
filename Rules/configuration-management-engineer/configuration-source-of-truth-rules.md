# Configuration Source of Truth

## Purpose
Ensure operational configuration has an authoritative, reviewable origin and does not drift into undocumented copies.

## Scope
Applies to application, platform, infrastructure, policy, and runtime configuration managed across environments.

## MUST
- Every managed setting MUST have an identifiable authoritative source and owner.
- Generated or synchronized copies MUST identify their upstream source and regeneration mechanism.
- Configuration precedence MUST be deterministic and documented where multiple layers can supply the same key.
- Changes MUST be reviewable through versioned history or an equivalently auditable system.
- Runtime values MUST be traceable to the configuration revision that produced them where practical.

## MUST NOT
- Operators MUST NOT treat manually edited runtime state as the long-term source of truth.
- Teams MUST NOT maintain competing authoritative copies without an explicit reconciliation contract.
- Automation MUST NOT silently overwrite a newer authoritative change with stale state.

## SHOULD
- Prefer declarative, version-controlled configuration for reproducibility.
- Keep ownership metadata close to the configuration domain.

## Exceptions
Emergency runtime changes may bypass the normal source only when incident policy permits it. The change MUST be recorded, reconciled back to the authoritative source, risk-assessed, and reviewed after stabilization.

## Verification
Review repository or configuration-system history, precedence documentation, deployment metadata, runtime provenance, and drift reports. Test that regeneration from the declared source produces the expected effective configuration.