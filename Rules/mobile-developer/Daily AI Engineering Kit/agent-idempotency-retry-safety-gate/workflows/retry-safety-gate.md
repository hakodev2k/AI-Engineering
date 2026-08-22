# Workflow: Retry Safety Gate

## Trigger
A pull request or local change modifies retry policy, message redelivery, background processing, command handling, or code with externally visible side effects reachable from retryable execution.

## Entry conditions
Repository is available, diff base is known, changed files can be inspected, and relevant tests can be run or their missing prerequisite identified.

## Inputs
Diff base, acceptance criteria, repository source/tests/configuration, known runtime constraints.

## Context
Load only changed boundaries, their callers/callees, retry configuration, persistence/integration code, and nearby tests. Expand when evidence requires it.

## Stages
1. **Preflight — Workflow owner**: validate repository state and run `scripts/scan-retry-risk.py`.
2. **Investigate — Retry Path Investigator**: map retry paths, side effects, guards, and failure windows.
3. **Assess — Workflow owner**: create assessment JSON matching `schemas/assessment.schema.json` and classify risk.
4. **Plan — Implementation owner**: propose the smallest safe fix and tests. Stop for approval if the fix crosses an approval boundary.
5. **Execute — Implementation owner**: implement only approved/safe scope.
6. **Test — Implementation owner**: run duplicate-delivery and retry-path regression tests plus relevant build/test checks.
7. **Verify — Verification Agent**: independently inspect evidence, rerun required checks, and review final diff.
8. **Finalize — Workflow owner**: validate assessment with `scripts/validate-assessment.py` and record open risks.

## Produced artifacts
- `.ai/idempotency-scan.json`
- `.ai/idempotency-assessment.json`
- Test/build logs as available
- Final implementation diff

## Checkpoints
- Investigation must finish before implementation.
- High-risk findings require a concrete guard and regression test or status remains `fail`/`blocked`.
- Approval-required actions must stop at planning.
- Verifier must be separate from implementation role for high-risk changes.

## Retry rules
Maximum two fix/retest cycles. Retryable: deterministic test failure caused by the attempted fix, transient local tool failure, or a narrowly identified implementation defect. Preserve the failing command, output, assessment, and diff from each cycle. Permission failures, missing approvals, destructive-action requirements, and unavailable production dependencies are not retryable. After two unsuccessful cycles, stop and escalate with evidence.

## Failure paths
- Scanner/tool error after two retries: `blocked`.
- Missing environment dependency: `blocked` with exact prerequisite.
- Required dangerous change: `needs-approval` and stop.
- Duplicate side effect reproduced after two fixes: `fail` and escalate.
- Required verification not run: cannot mark `pass`.

## Approval points
Explicit human approval is required before production configuration changes, database schema changes, destructive data changes, breaking API contracts, payment behavior changes, or message-redelivery-policy changes.

## Stop conditions
Stop on verified pass, unrecoverable blocker, missing approval, or exhausted retry budget.

## Definition of Done
Changed retryable boundaries and side effects are inventoried; retry behavior is evidenced; duplicate delivery and retry-path tests pass; final diff is reviewed; assessment validates; no unapproved dangerous action occurred; unresolved risks are recorded.
