# Checkpoint Ephemeral Input Resume Guard

**Category:** Thinking

## Problem
Checkpointed agent workflows can appear fault tolerant while a resumed task has lost non-checkpointed dispatch input. This package makes replay eligibility an explicit, verifiable contract rather than assuming checkpoint existence implies correctness.

## Evidence
See `evidence/research.md`, grounded in LangGraph issue #8582 (2026-08-10) and current LangGraph persistence semantics.

## Existing approach and limitation
Framework checkpoints preserve graph state and pending writes, but task-critical ephemeral values may not be recoverable. Generic retry therefore needs a host-level input-integrity gate.

## Proposed improvement
Declare replay-critical fields, persist/reconstruct them from durable sources, fingerprint them at dispatch and resume, and fail closed before resumed execution if completeness/equivalence cannot be proven.

## Architecture
- `evidence/research.md` — current evidence and root cause.
- `rules/replay-integrity.md` — enforceable recovery invariants.
- `skills/replay-contract-audit.md` — evidence-driven audit procedure.
- `subagents/recovery-verifier.md` — independent verifier.
- `workflows/failure-recovery.md` — bounded recovery flow.
- `hooks/pre-resume.md` — deterministic pre-resume gate.
- `scripts/replay_guard.py` — dependency-free validator.
- `tests/test_replay_guard.py` — pass/missing/mismatch regression cases.

## Installation
Python 3.9+ is sufficient for the validator. Pytest is required only for tests.

## Usage
Create evidence JSON with `required_fields`, `dispatch`, and `resume`, then run `python scripts/replay_guard.py --evidence evidence.json`. Exit 0 permits resume; exit 2 blocks unsafe resume; exit 3 indicates invalid evidence.

## Metrics
Track resume attempts, missing fields, digest mismatches, blocked unsafe resumes, deterministic replay success, and recovery latency.

## Verification
Run `python -m pytest -q tests/test_replay_guard.py`. Integrations must additionally prove the pre-resume hook executes before any model/tool/side effect.

## Safety
The validator reads local evidence only and performs no external actions. Do not weaken required fields to make a retry pass.

## Failure handling
Two reconstruction attempts maximum; then preserve evidence, require escalation, and stop automatic resume.

## Definition of Done
Implemented: replay contract and gate integrated. Measured: coverage/mismatch metrics captured. Verified: regression tests pass and an independent verifier confirms all replay-critical inputs survive failure/restart.
