# Upgradeability

## Purpose
Keep upgradeable systems compatible, reviewable, and recoverable.

## Scope
Proxy patterns, implementation upgrades, storage layouts, initialization, and governance-controlled upgrades.

## MUST
- Treat storage layout and initialization behavior as compatibility contracts.
- Validate upgrade authorization and implementation identity before execution.
- Test upgrades from the currently deployed version using representative persisted state.
- Document migration steps, rollback or containment options, and changed trust assumptions.
- Require explicit human approval before executing a production upgrade.

## MUST NOT
- Reorder or reinterpret persisted storage incompatibly without a proven migration strategy.
- Leave implementation contracts unintentionally initializable.
- Execute an upgrade solely because local tests pass.

## SHOULD
- Prefer the least complex upgrade mechanism consistent with product requirements.
- Use timelocks or staged governance for high-impact upgrades.

## Exceptions
Irreversible upgrade choices require documented rationale, risk acceptance, and independent review.

## Verification
Compare storage layouts, run upgrade simulations and regression tests, inspect admin configuration, and verify deployed bytecode/version after execution.