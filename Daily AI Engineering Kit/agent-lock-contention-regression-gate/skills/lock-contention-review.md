# Lock Contention Review Skill

## Purpose
Detect, explain, and safely remediate lock-contention regressions introduced by code changes.

## When to use
Use when a change adds or modifies locks, semaphores, transactions, async coordination, shared mutable state, request serialization, background worker synchronization, or code executed under concurrency.

## Inputs
- Repository path or changed-file set.
- Intended behavior and acceptance criteria.
- Relevant tests, load-test results, traces, profiler output, or timing evidence when available.
- Baseline and candidate revision when comparing performance.

## Preconditions
- Working tree and target scope are known.
- Dangerous production actions are not required for investigation.
- The agent can read nearby code and tests.

## Allowed tools
Repository search, diff inspection, local build/test commands, profiler or benchmark output supplied by the environment, and `scripts/scan-lock-risk.py`.

## Constraints
- Treat scanner output as evidence hints, not proof.
- Never remove synchronization merely to improve throughput without proving correctness.
- Do not weaken ordering, atomicity, or consistency requirements without approval.
- Do not run destructive production diagnostics.

## Process
1. Identify changed files and concurrency entry points.
2. Trace shared state, lock acquisition/release, transaction lifetime, and async boundaries.
3. Run `python scripts/scan-lock-risk.py <paths> --json` and preserve output.
4. Locate blocking waits, I/O performed while synchronization is held, nested lock paths, broad lock scopes, and inconsistent acquisition order.
5. Identify existing concurrency tests, benchmarks, telemetry, or profiler evidence.
6. Form one finding per independently testable risk. Separate facts from hypotheses.
7. Establish baseline evidence: elapsed time, wait time, throughput, timeout rate, contention trace, or deterministic concurrency test.
8. Prefer the smallest correctness-preserving change: shrink critical section, move I/O outside lock, use async-compatible coordination, partition synchronization, or enforce consistent lock ordering.
9. Run build and relevant tests.
10. Run a contention test or equivalent before/after signal under comparable conditions.
11. Inspect the diff for new races, changed public contracts, altered transaction semantics, or retry behavior.
12. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.
13. Hand off to the independent verifier.

## Expected output
A validated assessment containing scope, findings with evidence and risk, before/after evidence, verification flags, and unresolved risks.

## Verification
A task is verified only when the assessment is valid, no unresolved high/critical finding remains for `pass`, before/after evidence exists, the contention test or equivalent signal passed, diff review completed, and an independent verifier confirmed the result.

## Failure handling
- Tool failure: retry once if transient; preserve error output.
- Build/test failure: investigate and make at most two fix–retest attempts.
- Missing reproducible contention signal: mark `blocked` rather than claiming improvement.
- Approval-required remediation: stop with `needs-approval`.

## Stop conditions
Stop on successful independent verification, after two failed fix–retest attempts, when required evidence cannot be obtained, or before any approval-required action.
