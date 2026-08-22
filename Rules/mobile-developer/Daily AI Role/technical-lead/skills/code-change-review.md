# Code Change Review

## Purpose
Review changes for correctness, maintainability, integration risk, and operational safety rather than style alone.

## Trigger
Pull request, patch, hotfix, dependency upgrade, schema change, or major refactor.

## Inputs
Diff, requirements, impacted contracts, tests, runtime evidence, migration/rollback notes, and risk context.

## Procedure
1. Trace each requested behavior to the changed implementation.
2. Inspect public/API/data contract compatibility.
3. Check error handling, cancellation, concurrency, authorization, validation, and observability where relevant.
4. Review tests for behavior coverage rather than line coverage.
5. Identify hidden coupling, duplicated policy, and ownership leakage.
6. Examine deploy, migration, rollback, and partial-failure behavior.
7. Separate blocking findings from suggestions.
8. Require evidence for claims that a risky path is safe.

## Decision rules
- Block on correctness, security, data-loss, irreversible migration, broken contract, or unverifiable critical behavior.
- Request follow-up for maintainability debt that does not invalidate the change.
- Do not expand the PR into unrelated cleanup.

## Output
Review findings ordered by severity with path/context, impact, required action, and verification expectation.

## Verification
A blocking finding is resolved only when the changed code or evidence addresses the underlying failure mode.

## Stop condition
Do not approve when critical behavior remains assumption-based.