# Breaking Change Approval Rules

## Purpose
Prevent irreversible contract breakage from reaching production without explicit risk ownership.

## Scope
Incompatible field changes, removals, type changes, semantic changes, compatibility-policy overrides, and destructive registry actions.

## MUST
- Breaking changes MUST identify all known affected producers, consumers, retained data, and replay paths.
- Human approval MUST be obtained before disabling compatibility controls or registering an intentionally incompatible production schema.
- The change plan MUST define migration sequence, rollback boundary, and verification evidence.
- High-risk changes MUST distinguish analysis, recommendation, preparation, and execution authority.
- Approval records MUST identify the exact subject and proposed version.

## MUST NOT
- MUST NOT bypass policy by creating an ungoverned parallel subject solely to evade review.
- MUST NOT remove fields or narrow accepted values without consumer-impact evidence.
- MUST NOT weaken compatibility globally to permit one exceptional change.

## SHOULD
- Prefer additive migration patterns and dual-read or dual-write windows when appropriate.
- Keep exceptions time-bounded.

## Exceptions
Emergency changes require incident authority, minimal blast radius, full audit trail, and post-change review.

## Verification
Inspect approval records, compatibility output, migration plans, consumer inventory, and post-deployment evidence.