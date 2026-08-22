# Skill: Feature Flag Retirement

## Purpose
Remove a feature flag and obsolete branch only after the permanent behavior is proven and all required references, tests, configuration, and rollback assumptions are accounted for.

## When to use
Use when a flag has reached `stable`, is expired, has been permanently enabled/disabled long enough to satisfy project policy, or has been explicitly selected for cleanup.

## Inputs
- lifecycle record,
- rollout evidence,
- current flag state,
- repository reference scan,
- relevant tests/build commands,
- approval record when required.

## Preconditions
- The intended permanent branch is known.
- Rollout evidence is available.
- Any required rollback window has ended or an approved alternative rollback mechanism exists.

## Required context
Read all code/config references to the flag, branch-specific tests, data migrations coupled to the flag, telemetry or operational evidence supporting retirement, and deployment/configuration ownership.

## Allowed tools
Repository search/read/edit tools, build/test commands, read-only feature flag metadata APIs, and deterministic scripts from this package.

## Constraints
- Never infer the winning branch from the flag name.
- Never delete a kill switch without explicit human approval.
- Never remove a branch while unresolved data/API/security compatibility remains.
- Do not treat setting a flag permanently true/false as retirement.

## Procedure
1. Validate the lifecycle record and confirm current state.
2. Collect rollout evidence that establishes the permanent behavior.
3. Scan repository references and classify each as definition, evaluation, test, documentation, configuration, migration, or telemetry reference.
4. Identify branch-specific side effects and data compatibility concerns.
5. Produce a retirement plan that states the branch to keep, branch to remove, configuration to remove, tests to rewrite/delete, and rollback strategy after cleanup.
6. Obtain required approval for protected or high-risk flags.
7. Remove obsolete branch code with the smallest safe diff.
8. Simplify tests to assert permanent behavior; preserve regression coverage rather than simply deleting branch tests.
9. Remove obsolete configuration and flag registration where within approved scope.
10. Run build and affected tests.
11. Run the reference scanner again.
12. Investigate every remaining reference; mark intentional historical/docs references explicitly if policy permits them.
13. Update the lifecycle state to `retired` only after deterministic and semantic verification.
14. Hand the evidence to the independent reviewer.

## Expected output
- retirement plan,
- simplified implementation,
- updated tests,
- post-cleanup reference report,
- updated lifecycle record,
- review evidence.

## Verification
Retirement is verified only when permanent behavior tests pass, the scanner reports no prohibited stale references, required approval exists, and the independent reviewer returns `pass`.

## Failure handling
If tests fail, diagnose and revise at most twice. If rollout evidence is ambiguous or the permanent branch cannot be proven, stop and return the flag to `stable` or `blocked`; do not guess. Scanner operational failure may be retried once if transient.

## Stop conditions
Stop on missing approval, unresolved data/security/public-contract risk, unknown permanent behavior, repeated test failure after two revisions, or unexplained remaining references.