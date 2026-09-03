# Quota-Interrupted Subagent Resume Contract

Category: **Thinking**

## Problem
Long-running agent workflows can lose in-flight child-agent work when provider usage limits, process interruption, or transient quota exhaustion occurs. Current resume mechanisms often restore completed calls from cache while restarting unfinished subagents from scratch, which can repeat expensive investigation, lose intermediate evidence, or replay unsafe side effects.

## Evidence
See `evidence/research.md`. Fresh public signals include Anthropic Claude Code issue #91449 (2026-09-02), OpenAI Codex issue #29996 (2026-06-25), and go-micro issue #4341 (2026-07-08).

## Existing approach
Typical systems checkpoint parent workflow state, cache completed child results, and retry failed child calls. This is insufficient when the child itself has durable progress that is not represented by the parent checkpoint.

## Proposed improvement
Treat each subagent as a resumable state machine with an explicit recovery contract: durable checkpoint identity, last verified phase, immutable input fingerprint, completed side-effect ledger, retry budget, and verifier decision. Resume only when the contract can prove continuation will not duplicate already-completed external effects.

## Architecture
- `skills/interruption-recovery.md`: evidence-driven recovery procedure.
- `rules/resume-integrity.md`: enforceable resume invariants.
- `subagents/recovery-verifier.md`: independent verifier role.
- `workflows/interrupt-resume-verify.md`: bounded recovery workflow.
- `hooks/pre-resume-check.md`: deterministic blocking pre-resume gate.
- `scripts/check_resume_contract.py`: contract validator.
- `config/resume-policy.json`: default policy.
- `tests/test_check_resume_contract.py`: deterministic tests.
- `evidence/research.md`: source-backed research.

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/resume-policy.json`. Keep `require_input_fingerprint`, `require_side_effect_ledger`, and `require_verifier` enabled for workflows with write-capable tools.

## Usage
`python scripts/check_resume_contract.py --policy config/resume-policy.json --checkpoint checkpoint.json`

Exit `0` means the checkpoint satisfies the structural recovery contract. Exit `2` means resume must be blocked. Structural validation does not prove the external world is unchanged; the workflow still requires verification before completion.

## Workflow
Observe interruption → capture evidence → validate checkpoint → compare task/input fingerprint → reconcile side-effect ledger → resume at last safe phase → verify outputs and external effects → complete.

## Metrics
Recovered-work ratio, duplicate side-effect count, replayed tool-call count, time-to-recovery, verifier rejection rate, unsupported-completion rate.

## Verification
A successful run must distinguish **Implemented**, **Measured**, and **Verified**. `Verified` requires independent review of resumed outputs and a duplicate-side-effect count of zero.

## Safety
Never replay a non-idempotent write merely because the previous response was lost. Unknown side-effect outcome is a blocking state requiring reconciliation or human approval.

## Failure handling
Maximum automated resume attempts: 2 per interrupted child. After two failures, preserve evidence and escalate. Never erase checkpoints to force a clean restart when external effects may already exist.

## Definition of Done
Evidence documented; checkpoint contract valid; input fingerprint unchanged; completed effects reconciled; bounded resume executed; tests pass; metrics captured; verifier approves; no duplicate side effects; no blocking uncertainty remains.
