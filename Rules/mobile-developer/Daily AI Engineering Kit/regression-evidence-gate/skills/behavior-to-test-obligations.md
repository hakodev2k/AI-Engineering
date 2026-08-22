# Skill: Behavior to Test Obligations

## Purpose

Translate a code change into an explicit list of behavioral obligations that must be proven by tests or approved evidence.

## When to use

Use after understanding the requested change and before adding or modifying tests.

## Inputs

- change request and acceptance criteria;
- implementation diff or planned change;
- relevant production code;
- existing tests;
- public/internal contracts;
- known incident or bug evidence when applicable.

## Preconditions

- the agent can identify the changed execution path;
- repository safety rules are loaded;
- no dangerous action is pending without approval.

## Process

1. Identify the externally observable behavior being added, removed, or modified.
2. Identify state transitions and persisted side effects.
3. Identify error paths and rejected inputs.
4. Identify boundary values, including empty, null, minimum, maximum, timeout, expiration, and duplicate cases when relevant.
5. Identify authorization, authentication, tenant, ownership, or role boundaries.
6. Identify concurrency, idempotency, retry, ordering, or duplicate-delivery behavior when the code participates in distributed or asynchronous flows.
7. Identify public compatibility surfaces: API payloads/status codes, events, schemas, CLI contracts, config keys, file formats, and package APIs.
8. Identify existing tests that already prove each behavior.
9. For each unproven behavior, create a test obligation with:
   - stable id;
   - behavior statement;
   - risk: low, medium, or high;
   - evidence type: unit, integration, contract, end-to-end, static, or manual;
   - expected outcome;
   - source/evidence path.
10. Mark an obligation `required=true` unless there is concrete evidence it is irrelevant.
11. Record uncertainty instead of silently excluding ambiguous behavior.

## Tools

Repository search, file reading, git diff, test discovery, schema/API inspection, and approved local test commands.

## Constraints

- Do not infer that a happy-path test covers an error or boundary path.
- Do not use line coverage percentage as proof of behavior coverage.
- Do not invent contracts that are not present in the repository or task.
- Do not downgrade risk merely because a test is difficult to write.

## Expected output

A set of obligation entries compatible with `schemas/regression-evidence.schema.json`.

## Verification

The obligation set must include, when applicable: happy path, primary negative path, boundaries, authorization, state mutation, compatibility, and concurrency/idempotency.

## Failure handling

If the changed behavior cannot be traced with confidence, stop test design and report the missing context. Retry repository discovery at most twice using different entry points.

## Stop conditions

Stop when every material changed behavior has either a required obligation or an explicit documented exclusion with evidence.
