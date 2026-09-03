# Resume Input Reconstructability Gate

**Category:** Thinking  
**Run date:** 2026-09-03 (UTC+7)

## Problem
Checkpointed AI workflows can continue from a paused/failed task even when the task's original logical inputs cannot be reconstructed. Missing runtime-only inputs or unexpected task re-execution can make resumed behavior differ from uninterrupted execution without producing an explicit recovery error.

## Evidence
See `evidence/research.md`. Current signals include LangGraph issue #8582 (failed `Send` task loses `UntrackedValue` input on resume), LangGraph.js issue #2667 (completed `task()` re-executes on resume only when nested as a subgraph), and the open deterministic crash/resume contract request #6818.

## Existing approach
Checkpoint state, recreate runtime resources on startup, mark values untracked, and rely on idempotent/durable task abstractions.

## Existing limitations
Checkpoint presence does not prove per-task input reconstructability; a recreated client/session may not be semantically identical; completed nested tasks can be recomputed; and application idempotency cannot restore missing decision inputs.

## Proposed improvement
Make resume eligibility explicit. Every resumable task declares a dependency manifest, classifies inputs as durable/reconstructable/runtime-only, fingerprints the original logical invocation, checks completed-result evidence, blocks unsafe side-effect replay, and must pass uninterrupted-vs-resumed equivalence tests.

## Package tree
```text
README.md
config/policy.json
evidence/research.md
skills/resume-reconstructability-audit.md
rules/resume-contract.md
subagents/resume-verifier.md
workflows/recover-verify.md
hooks/pre-resume-check.md
scripts/resume_contract_check.py
tests/test_resume_contract_check.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Tune bounded recovery behavior in `config/policy.json`. Task records consumed by the checker contain `dependencies`, optional `original_fingerprint`, and completion/side-effect flags.

## Usage
```bash
python scripts/resume_contract_check.py task-record.json
python -m unittest tests/test_resume_contract_check.py
```

## Workflow
Follow `workflows/recover-verify.md`: Observe → baseline uninterrupted execution → classify dependencies → form resume hypothesis → implement persistence/guard → resume → compare → independent verification. Maximum two recovery/remediation attempts.

## Metrics
Dependency-manifest coverage, unsafe resumes blocked, fingerprint mismatch count, duplicate task execution count, uninterrupted-vs-resumed terminal state/output match rate, side-effect replay violations.

## Verification
**Implemented:** manifest rules, deterministic fingerprint checker, bounded workflow, and regression tests.  
**Measured:** uninterrupted and resumed runs use the same deterministic fixture and record task counts/state/output.  
**Verified:** required dependencies are reconstructable, fingerprints match, completed work is not duplicated unsafely, terminal state/output is equivalent, and independent verifier returns PASS.

## Safety
Never fabricate unavailable runtime state, silently replay irreversible actions, or weaken assertions to force equivalence. Human/operator approval is required before recovery that may repeat dangerous or irreversible side effects.

## Failure handling
Detection: missing required input, fingerprint drift, duplicate side-effect risk, or equivalence mismatch. Retry at most twice with a changed evidence-backed hypothesis. Fallback: restart from a known-safe workflow boundary and explicitly recreate runtime resources. Escalate when side effects cannot be safely replayed.

## Definition of Done
Evidence documented; dependency manifest complete; original/resume fingerprints checked; missing required runtime input blocks resume; completed work reuse/replay decision documented; tests pass; uninterrupted/resumed comparison passes; recovery loop bounded; independent verification complete; no blocking issue remains.
