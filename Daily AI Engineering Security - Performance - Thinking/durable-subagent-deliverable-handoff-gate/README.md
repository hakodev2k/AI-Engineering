# Durable Subagent Deliverable Handoff Gate

## Topic
Parent-verifiable, durable completion contracts for delegated AI-agent work.

## Category
Thinking

## Problem
A subagent can terminate with `completed`/`success` while the parent receives no complete deliverable, only partial narration, or an inaccessible result. This makes orchestration status unreliable and can erase expensive research/review work.

## Evidence
See `evidence/research.md` for recent public reports from Claude Code and Codex, including August 2026 cases where completed/successful subagents produced missing, empty, partial, or deferred results.

## Existing approach
Most systems rely on final status fields, transient result messages, child transcripts, or prompt instructions telling the child to return a complete answer.

## Existing limitations
Status can disagree with actual terminal/tool state; prompt-only mitigation can fail; transcripts may lack the final assembled artifact; output can be dropped at token/transport boundaries; blind retry wastes prior work.

## Proposed improvement
Require a durable handoff envelope before parent acceptance. The envelope identifies the task, terminal state/reason, unfinished tool calls, inline or artifact deliverable, optional SHA-256, checkpoints, and verification evidence. A deterministic validator rejects false completion before the parent proceeds.

## Architecture
```text
child execution
   |
checkpoint externally useful evidence
   |
produce inline deliverable OR durable artifact + digest
   |
build handoff envelope
   |
scripts/validate_handoff.py
   |
accept? ---- no ---> bounded recovery workflow
   |
  yes
   v
independent/task-specific verification -> parent completion
```

## Package tree
```text
durable-subagent-deliverable-handoff-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-acceptance-handoff-check.md
├── rules/handoff-acceptance.md
├── scripts/validate_handoff.py
├── skills/durable-handoff-design.md
├── subagents/handoff-verifier.md
├── tests/test_validate_handoff.py
└── workflows/delegate-handoff-recover.md
```

## Installation
Python 3.9+; no third-party dependencies. Integrate envelope creation into the parent/child completion boundary before the orchestrator records delegated success.

## Handoff envelope
Example fields:

```json
{
  "task_id": "review-17",
  "terminal_state": "completed",
  "terminal_reason": "stop",
  "unfinished_tool_calls": [],
  "deliverable": {
    "kind": "artifact",
    "path": "artifacts/review.md",
    "sha256": "<64-hex-digest>"
  },
  "verification_evidence": ["review schema validated", "tests passed"],
  "checkpoints": ["artifacts/review-findings.json"]
}
```

Inline deliverables use `{"kind":"inline","content":"..."}`.

## Configuration
`config/policy.json` declares accepted outer states, terminal reasons that block completion, digest/evidence requirements, and minimum inline deliverable length. Customize only from task acceptance semantics; do not loosen policy to suppress a known failed handoff.

## Usage
```bash
python scripts/validate_handoff.py --envelope handoff.json --policy config/policy.json --artifact-base . --output validation.json
python -m unittest tests/test_validate_handoff.py
```
Exit code 0 = accepted, 2 = rejected handoff, 3 = invalid input/configuration or I/O failure.

## Workflow
Use `workflows/delegate-handoff-recover.md`: define acceptance → dispatch → checkpoint → persist deliverable → validate → independently verify → accept, or recover within two bounded retries.

## Metrics
Completion-without-deliverable rate, false-success rate, artifact digest pass rate, recoverable partial checkpoint rate, retries per delegated task, rework time, and independent verification coverage.

## Verification
The parent must retrieve the actual deliverable, validator status must be `accept`, unit tests must pass, and task-specific acceptance evidence must be independently checked for high-impact work.

## Safety
This package never asks for hidden chain-of-thought. Checkpoints should persist externally useful facts, evidence, decisions, test results, and artifacts—not private reasoning traces. Artifact access controls must remain at least as restrictive as the delegated task's data boundary.

## Failure handling
Detection: rejected envelope, missing artifact, digest mismatch, blocked terminal reason, unfinished tool call, or missing evidence. Evidence: retain validation report and safe checkpoints. Retry: maximum two recovery attempts, each tied to a named rejection reason. Fallback: resume from durable checkpoint or rerun only the missing slice. Escalation: unrecoverable output, integrity uncertainty, or dangerous side effect. Stop: two failed recoveries or required human approval.

## Definition of Done
- **Implemented:** parent completion path requires the handoff gate.
- **Measured:** baseline and post-change false-success/rework metrics are captured.
- **Verified:** validator/tests pass on success and representative failure cases, and an independent verifier can retrieve and validate the deliverable.
- Evidence and residual risks are documented.
- No blocking handoff issue remains.

## Customization
Adapters can map vendor-specific status fields, task-output APIs, object stores, or databases into the envelope while preserving the core invariants: durable deliverable, terminal-state consistency, integrity verification, bounded recovery, and parent-visible acceptance evidence.
