# Test Data Rules

## Purpose
Keep browser automation data deterministic, isolated, privacy-safe, and suitable for parallel execution.

## Scope
Applies to fixture data, account provisioning, database or API setup, generated identifiers, and cleanup of mutable test records.

## MUST
- Each scenario MUST own or explicitly declare the mutable data it depends on.
- Test data creation MUST produce known preconditions and expose failures before browser actions begin.
- Parallel execution MUST use collision-resistant identities or isolated namespaces.
- Sensitive data MUST be synthetic, masked, or specifically authorized for the environment.
- Cleanup MUST avoid deleting data not owned by the automation run.

## MUST NOT
- Automation MUST NOT depend on undocumented shared records that another scenario can modify.
- Production personal or confidential data MUST NOT be copied into lower environments merely for convenience.
- Random data MUST NOT make failures unreproducible; random seeds or generated values MUST be captured when randomness is necessary.

## SHOULD
- Data setup SHOULD use APIs, fixtures, or direct supported setup mechanisms when they are faster and more deterministic than UI setup, unless UI setup is itself under test.
- Minimal datasets SHOULD be preferred over large opaque snapshots.

## Exceptions
Shared reference data may be used when immutable by contract and verified before execution. Document the ownership and reset strategy for any unavoidable shared mutable fixture.

## Verification
Run scenarios concurrently and in randomized order, inspect generated identifiers and cleanup scopes, repeat failures with captured data, and review data-classification controls.