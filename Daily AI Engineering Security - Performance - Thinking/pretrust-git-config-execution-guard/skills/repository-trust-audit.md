# Skill: Repository Trust Audit

## Purpose
Gate Git-backed context collection without executing repository-controlled behavior.

## Trigger
Before an agent/IDE/reviewer inspects an untrusted or archive-delivered repository.

## Inputs
Repository path, provenance, policy.

## Preconditions
Python 3.10+; no Git command has run for this onboarding path.

## Required context
Repository path, `.git` pointer/directory, `.git/config`, policy only.

## Allowed tools
Static filesystem reads, included Python guard, unittest, structured logs.

## Constraints
No Git, shell repository files, hooks, builds, package managers, or model-selected repository tools before pass.

## Procedure
1. Record provenance and pretrust Git-process baseline.
2. Run `python scripts/git_pretrust_guard.py <repo> --json`.
3. Exit 3: fix only local read/path issue and retry once.
4. Exit 2: stop; quarantine or request human remediation.
5. Exit 0: record baseline decision and permit the next stage.
6. Independently rerun after any remediation.

## Decision points
Blocked → quarantine/escalate. Error → fail closed. Safe → continue without claiming broader repository safety.

## Expected output
Repository, config path, findings, decision, exit code.

## Metrics
Latency, blocked/error count, pretrust Git subprocess count (target zero).

## Verification
Independent verifier reruns scanner and tests.

## Failure handling
One retry for inspection error; zero automatic retries for security blocks.

## Stop conditions
Blocked value, ambiguous gitdir, unreadable config, failed test, or evidence Git already executed pretrust.