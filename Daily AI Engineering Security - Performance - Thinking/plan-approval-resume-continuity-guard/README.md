# Plan-Approval Resume Continuity Guard

**Category:** Thinking

## Problem
Long-running agents can lose or ambiguously reconstruct human plan approval across worker restarts, session resume, compaction, or plan-mode transitions. The result can be either unsafe continuation without approval or repeated identical approval prompts and no-progress loops.

This package complements generic approved-plan scope guards: it focuses specifically on **durability, replay, and revalidation of the approval fact across lifecycle boundaries**.

## Evidence
See `evidence/research.md`. Current Claude Code reports from July–August 2026 show three related failures: execution after an approval tool-state error without user consent, approved sessions re-entering plan mode after worker restart and repeatedly asking for the same approval, and unanswered decision prompts auto-continuing.

## Existing approach and limitations
Plan-mode UI, `ExitPlanMode`, `AskUserQuestion`, checkpoint/session resume, plan files, and system reminders can represent intent but do not necessarily provide an atomic, replay-safe approval record bound to the exact task, plan bytes, workspace revision, and execution phase.

## Proposed improvement
Persist a minimal human approval receipt and validate it deterministically before execution or resume. A valid receipt is bound to task ID, exact plan SHA-256, workspace revision, approval identity, timestamps, human approver type, and allowed phases. Missing or stale evidence fails closed; a still-valid identical receipt prevents duplicate approval prompts.

## Architecture
- `scripts/plan_receipt_guard.py` — deterministic approval-receipt validator.
- `schemas/approval-receipt.schema.json` — portable receipt contract.
- `config/policy.json` — expiry and binding policy.
- `tests/test_plan_receipt_guard.py` — lifecycle/drift fixtures.
- `skills/plan-approval-recovery.md` — recovery procedure.
- `rules/plan-approval-continuity.md` — enforceable invariants.
- `subagents/verification-agent.md` — independent verifier.
- `workflows/resume-with-approval-state.md` — bounded state-transition workflow.
- `hooks/pre-execution-approval-check.md` — blocking execution hook.
- `evidence/research.md` — public evidence and root-cause analysis.

## Installation
Python 3.10+; no third-party runtime dependencies.

## Configuration
Edit `config/policy.json` only through the platform's normal policy-review process. Do not loosen receipt binding to work around a failed resume.

## Usage
`python scripts/plan_receipt_guard.py --plan PLAN.md --receipt receipt.json --task-id TASK-123 --workspace-revision abc123 --phase implementation --policy config/policy.json`

Exit codes: 0 valid, 2 blocked by approval continuity checks, 3 malformed input or guard failure.

## Workflow
Observe lifecycle transition → load durable receipt → re-hash plan → verify task/workspace/phase/time binding → valid: deduplicate and resume → invalid: await human approval → independently verify → complete.

## Metrics
Duplicate approval prompts per task, resumed sessions with valid receipts, stale-plan continuations, workspace-mismatch continuations, recovery-loop count, approval bypass attempts, independent verification coverage, and rework caused by lost approval state.

## Verification
Run `python -m unittest discover -s tests -p 'test_*.py'`. A valid receipt must pass; plan drift, workspace drift, expiry, out-of-scope phase, or non-human approval must block.

## Safety
The guard never mints or extends approval. Conversation text, model memory, system reminders, and tool errors are not substitutes for a valid receipt. Dangerous or irreversible work requires explicit human approval under platform policy.

## Failure handling
Any parser, timestamp, policy, or binding ambiguity blocks execution. Permit at most two recovery attempts; thereafter stop and escalate to a human rather than looping or guessing.

## Definition of Done
**Implemented:** receipt validation runs before resumed or newly approved execution.  
**Measured:** lifecycle and duplicate-prompt metrics are captured.  
**Verified:** deterministic tests pass and an independent verifier confirms no execution path treats missing/invalid approval evidence as consent.

## Customization
Add repository-specific revision identifiers or narrower execution phases while retaining exact plan/task/workspace binding and human-approval provenance.