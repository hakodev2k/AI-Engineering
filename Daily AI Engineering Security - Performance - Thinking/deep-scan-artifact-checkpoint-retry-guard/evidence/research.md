# Research — Deep-Scan Artifact Checkpoint & Retry Guard

## Topic
Artifact-complete checkpoints and bounded recovery for expensive multi-agent security scans

## Category
Thinking

## Problem
Long-running multi-agent scans can perform substantial discovery work, then fail because one mandatory artifact is missing or finalization cannot consume already-produced artifacts. Parent orchestration may then discard partial evidence or start another expensive full scan, consuming quota without a usable deliverable.

## Why it matters now
Recent Codex Security reports show multiple independent artifact/finalization failure modes across Windows and macOS. These failures occur after meaningful compute has already been spent, so recovery design—not only worker correctness—determines whether users lose time and quota.

## Affected users
Developers and security teams running repository-wide AI security scans; platform builders implementing fan-out discovery/validation; agent users with bounded quotas; maintainers of resumable long-running workflows.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38453, opened 2026-08-13, reports Deep Scan failing because `candidate_ledger.json` was missing after substantial discovery; the parent then automatically started another full scan while less than 5% weekly quota remained. https://github.com/openai/codex/issues/38453
2. Codex issue #36588, opened 2026-08-02, reports a separate Deep Scan failure where a worker did not produce required `threat_model.md`; other workers were canceled and no useful partial result was returned after retries. https://github.com/openai/codex/issues/36588
3. Codex issue #35912 reports a scan reaching 25/25 report artifacts and 21 validated findings yet failing to recover/finalize, showing that terminalization can fail even when substantive artifacts exist. https://github.com/openai/codex/issues/35912
4. The official codex-security scan artifact reference defines canonical artifact paths and candidate-ledger requirements, providing an explicit contract that can be validated deterministically. https://github.com/openai/codex-security/blob/main/sdk/typescript/_bundled_plugin/references/scan-artifacts.md and https://github.com/openai/codex-security/blob/main/sdk/typescript/_bundled_plugin/skills/security-scan/references/scan-artifacts-and-ledger.md

## Existing approaches
Terminal manifests, deterministic artifact validation, worker retries, all-or-nothing coordinator completion, workflow instructions that say terminal failures should stop.

## Remaining limitations
- Worker success can be observed before required artifacts are durably present.
- One worker artifact failure may cancel valid sibling output.
- Retry policies can repeat the entire expensive scope instead of resuming from a verified checkpoint.
- Natural-language stop instructions are not a deterministic retry interlock.
- Quota/cost remaining may not participate in the retry decision.
- Finalization lacks a repair/reconciliation path when canonical artifacts already exist.

## Root-cause analysis
1. Completion state and durable artifact state are not committed atomically.
2. Checkpoint identity is not bound to immutable scan inputs/revision and artifact hashes.
3. Recovery decisions are made by an agent after failure rather than by a deterministic state machine.
4. Retry scope is coarse (full scan) instead of phase/worker-specific.
5. Cost/quota is treated as telemetry rather than a stop condition.

## Improvement opportunity
Introduce an artifact checkpoint gate between each expensive phase and its completion transition. A checkpoint is valid only when required files exist, are non-empty, and their hashes are recorded against scan identity/revision. Terminal failure produces a resumability decision; full-scope retry is blocked unless explicitly approved and quota/cost policy permits it.

## Goal
Preserve completed evidence, prevent false completion, and eliminate unapproved full-scan retries after deterministic artifact failure.

## Metrics
usable-artifact retention rate; full-scan reruns per logical scan; wasted worker-seconds/tokens after deterministic failure; checkpoint validation failures; resumed-vs-restarted ratio; terminal failures with actionable evidence; quota consumed per accepted finding/report.

## Trigger
Before marking any discovery/validation/reporting phase complete and immediately after any terminal failure.

## Inputs
Scan id, immutable target revision, phase, required artifact paths, previous checkpoint, remaining quota/cost budget, explicit retry approval.

## Outputs
Validated checkpoint JSON; missing/invalid artifact list; resumability class; permitted retry scope; deterministic block/allow exit code.

## Verification
Fixtures must prove: missing mandatory artifact blocks completion; valid artifacts yield stable hashes; modified artifacts invalidate an old checkpoint; terminal failure cannot authorize full rerun without explicit approval; low remaining quota blocks automatic rerun even with retry intent.

## Interpretation
The repeated issue pattern indicates a workflow-state integrity problem: expensive work needs transactional phase boundaries and deterministic recovery policy rather than best-effort narrative instructions.

## Proposed solution
This package supplies an artifact/checkpoint validator, retry interlock, enforceable rules, diagnosis skill, independent verifier, and bounded recovery workflow.