# Skill: Evidence-Grounded Verification

## Purpose
Convert acceptance criteria and completion claims into observable evidence requirements before an agent reports success.

## Trigger
Before final completion, merge/push/deploy, or after a change that may invalidate previous verification.

## Inputs
Acceptance criteria, changed files, canonical build/test commands, tool-event log, generated artifacts, repository state.

## Preconditions
Acceptance criteria are explicit enough to evaluate; repository verification commands are known or discovery is documented.

## Required context
Task scope, changed-file set, relevant test/build surfaces, freshness boundary for prior evidence.

## Allowed tools
Repository inspection, build/test commands, version-control status, artifact/file checks, deterministic evidence gate.

## Constraints
Do not infer execution from intent. Do not treat a passing unrelated test as verification. Do not expose hidden chain-of-thought; record only facts, assumptions, evidence, decisions, risks, and verification status.

## Procedure
1. Decompose the task into acceptance criteria.
2. For each criterion, define direct evidence and acceptable proxy evidence.
3. Identify canonical verification commands and relevant live/integration checks.
4. Record baseline failures when applicable.
5. After implementation, capture actual tool executions with exit/result, scope, timestamp, and changed-state fingerprint.
6. Mark evidence stale after relevant edits.
7. Map each planned user-facing claim to qualifying fresh evidence.
8. Run `scripts/completion_gate.py`.
9. If blocked, downgrade the claim or obtain missing evidence; never rewrite unsupported evidence as success.
10. For high-impact work, hand off to an independent verifier.

## Decision points
Targeted tests may support a narrow claim but cannot support `verified` unless policy/acceptance coverage says they are sufficient. A command that did not exercise the changed code is non-qualifying evidence.

## Expected output
Facts, acceptance-criteria coverage, evidence ledger, unsupported claims, risks, and status: incomplete / implemented / measured / verified.

## Metrics
Claim support rate, acceptance coverage, stale evidence count, unsupported high-confidence claim count, rework after completion.

## Verification
Independent reviewer samples evidence provenance and reruns canonical checks for high-impact changes.

## Failure handling
Missing evidence blocks the corresponding claim. Tool failure is preserved as failure evidence. After two attempts with the same hypothesis, re-diagnose rather than repeat.

## Stop conditions
Stop when all intended claims are supported by fresh relevant evidence, or return an explicitly incomplete status with missing verification listed.