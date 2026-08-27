# Verification Receipt Freshness Gate

**Category:** Thinking

## Problem
Long-running coding agents can enter repeated verification loops because verification state is inferred from stale text, dirty-path heuristics, or reviewer findings that are not bound to the current repository state. The result is redundant test execution, wasted tokens, and blocked completion despite fresh green evidence.

## Evidence
See `evidence/research.md` for current August 2026 signals.

## Existing approach
Agents commonly rerun tests whenever a verification reminder, reviewer concern, or changed-path signal appears. Some systems now emit structured verification artifacts, but freshness and scope are still inconsistently enforced.

## Existing limitations
A passing test run may not clear stale state; committed paths may remain marked unverified; reviewers can introduce out-of-scope findings; and retry loops often lack a deterministic stop condition.

## Proposed improvement
Use cryptographically stable verification receipts bound to repository HEAD, changed-file set, command, exit code, and timestamp. A deterministic freshness gate decides whether verification is required, stale, out-of-scope, or satisfied.

## Architecture
- `evidence/research.md`
- `skills/verification-state-analysis.md`
- `rules/verification-loop-control.md`
- `subagents/verification-reviewer.md`
- `workflows/verify-and-close.md`
- `hooks/pre-completion.md`
- `scripts/verification_receipt.py`
- `tests/test_verification_receipt.py`

## Installation
Python 3.10+; standard library only.

## Usage
Create a receipt from a successful verification command, then validate it before completion. See script help.

## Metrics
Verification runs/task, duplicate verification rate, stale-state false positives, mean completion latency, tokens spent after first green verification, out-of-scope reviewer findings blocked.

## Verification
Run `python -m unittest tests/test_verification_receipt.py`.

## Safety
The gate never weakens required tests. Missing or stale evidence fails closed. Dangerous or irreversible actions still require explicit human approval.

## Failure handling
Maximum automated re-verification retries: 2. If the same unchanged HEAD receives two fresh green receipts, further identical reruns are blocked and escalated as orchestration failure.

## Definition of Done
Implemented: receipt generation and freshness gate integrated. Measured: duplicate-run and latency metrics captured. Verified: tests pass and an independent reviewer confirms completion only occurs on a fresh receipt tied to current HEAD and scope.
