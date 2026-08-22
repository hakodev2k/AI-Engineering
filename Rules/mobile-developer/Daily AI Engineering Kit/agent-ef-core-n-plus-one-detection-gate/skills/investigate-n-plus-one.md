# Skill: Investigate EF Core N+1

## Purpose
Prove or reject an N+1 hypothesis using repository evidence and EF Core command logs.

## When to use
Use when one request, job, or loop appears to execute the same query shape repeatedly with changing parameters.

## Inputs
- Reproduction path or request identifier
- EF Core command logs
- Relevant application/repository code
- `config/policy.yaml`

## Preconditions
The suspect path can be reproduced safely outside production, or production logs are available read-only.

## Allowed tools
Repository search, test runner, read-only log access, `scripts/detect_n_plus_one.py`.

## Constraints
Do not change schema, indexes, production configuration, or public contracts during investigation. Do not label repetition as N+1 until a call-site relationship is demonstrated.

## Procedure
1. Locate the request/job entry point.
2. Trace data access calls and loops/enumerations.
3. Identify lazy-loading, navigation access, per-item repository calls, or deferred queries.
4. Capture one bounded execution with request markers and EF Core command logging.
5. Run `python scripts/detect_n_plus_one.py --log <log> --policy config/policy.yaml --out <result>`.
6. For every suspect group, map normalized SQL back to the LINQ/repository call site.
7. Record query count, distinct parameter sets, collection size, and expected constant-query alternative.
8. Re-run with a larger representative input to see whether query count grows with item count.
9. Classify the finding as confirmed, rejected, or inconclusive.

## Expected output
Finding, call site, evidence, growth behavior, confidence, affected path, and recommended smallest safe remediation.

## Verification
A confirmed N+1 must have both repeated-query evidence and a code path that causes per-item execution.

## Failure handling
If correlation markers or command logs are incomplete, preserve evidence and return `inconclusive`; do not guess.

## Stop conditions
Stop before production configuration changes, schema/index changes, or global lazy-loading changes without approval.
