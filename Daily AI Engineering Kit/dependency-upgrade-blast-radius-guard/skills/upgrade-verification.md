# Skill: Upgrade Verification

## Purpose
Prove that a dependency upgrade is compatible with the declared blast radius after implementation.

## When to use
Run after dependency files and any required compatibility edits are complete.

## Inputs
- `upgrade-manifest.json`;
- `dependency-diff.json`;
- Git diff;
- build/test/static-analysis results;
- runtime or contract-check evidence.

## Preconditions
The upgrade manifest has passed risk review and required approvals exist.

## Process
1. Validate the manifest structure.
2. Compare actual direct/transitive dependency deltas with expected deltas.
3. Inspect changed files and reject unrelated edits.
4. Verify all required migration actions were implemented.
5. Restore dependencies from a clean state where practical.
6. Build all declared affected projects.
7. Run tests mapped to affected behaviors.
8. Run integration/contract checks for serialization, HTTP, database, auth, messaging, generated code, or configuration when applicable.
9. Compare runtime defaults/config behavior when upstream notes indicate changed defaults.
10. Confirm no test was disabled, weakened, skipped, or deleted merely to make the upgrade pass.
11. Validate rollback instructions against the actual changed dependency files.
12. Record unresolved warnings separately from verified evidence.
13. Set verification status to pass only when all mandatory checks succeed.

## Tools it may use
Git, package manager, repository-native build/test tools, deterministic scripts in this kit, API/contract test tools already present in the repository.

## Constraints
- Verification must use observed evidence, not the implementing agent's confidence.
- Do not modify production code while acting as verifier.
- Do not redefine acceptance criteria after failures appear.

## Expected output
A verification report containing executed checks, results, unexpected deltas, unresolved risk, and final `verified: true|false` decision.

## Verification
The verifier itself is complete only when every required check in the manifest has a recorded result.

## Failure handling
Retry transient restore/test infrastructure failures at most twice. Persistent deterministic failures stop verification and must be reported with command/evidence.

## Stop conditions
Stop on unexpected dependency drift, missing approval, failing mandatory tests, unexplained changed files, or irreversible rollback risk.
