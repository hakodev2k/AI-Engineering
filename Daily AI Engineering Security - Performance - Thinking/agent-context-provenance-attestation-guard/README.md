# Agent Context Provenance Attestation Guard

**Category:** Security

## Problem
Agent runtimes can assemble model context from user input, interruptions, background notifications, tool results, subagents, hooks, compaction, and server-side state. Recent Claude Code reports show text appearing as a `user` turn even though the operator did not submit it and the local transcript contains no matching user event. If provenance is lost at request assembly, the model can treat synthetic or injected content as authenticated user authority.

## Evidence
See `evidence/research.md`. The package is based on multiple public reports from July–August 2026 in which fabricated or assistant-generated text appeared as user/interruption context, including a payload requesting SSH-key exfiltration.

## Existing approach and limitation
Current defenses primarily rely on model refusal, prompt-injection classifiers, tool permission gates, and transcript inspection. These are valuable but incomplete when the disputed content itself is mislabeled as an authenticated user message or is absent from the audit transcript.

## Proposed improvement
Treat every model-visible context event as a provenance-bearing record. User-authority events must be bound to an authenticated ingress event and a durable transcript record. Harness-generated control messages remain explicitly harness/system authority. Unknown or unverifiable origins are quarantined and may not authorize privileged actions.

## Architecture

```text
agent-context-provenance-attestation-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-action-provenance-gate.md
├── rules/context-origin-boundary.md
├── schemas/context-event.schema.json
├── scripts/provenance_guard.py
├── skills/context-provenance-audit.md
├── subagents/context-forensics-reviewer.md
├── tests/test_provenance_guard.py
└── workflows/audit-and-quarantine.md
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Usage
Export model-visible context events as JSONL and run:

```bash
python scripts/provenance_guard.py context.jsonl --json report.json
```

Exit codes: `0` verified; `2` policy violations; `3` malformed input/runtime error.

## Event contract
Each JSONL object should include `event_id`, `role`, `source`, `source_id`, `transcript_recorded`, and `content_sha256`. A `user` role additionally requires `authenticated_user=true` and `ingress_event_id`. Synthetic interruption/task/control messages must use `source=harness` or `source=system` and MUST NOT impersonate the `user` role.

## Workflow
Use `workflows/audit-and-quarantine.md`: capture model-visible events, attest provenance before privileged action, quarantine unverifiable user-authority events, investigate, then resume only when evidence is consistent.

## Metrics
- `% model-visible events with complete provenance`
- `unverifiable_user_events`
- `user_role_without_transcript_record`
- `source_role_mismatch_count`
- `privileged_actions_blocked_by_provenance_gate`
- mean time to reconcile context vs transcript

## Verification
Run `python -m unittest tests/test_provenance_guard.py`. Tests prove that authenticated recorded user events pass while unlogged user-role injections, harness-as-user events, and malformed records block.

## Safety
The guard never executes context content. It hashes and validates metadata only. Quarantine does not silently discard context needed for correctness; it removes authority from unverifiable content and requires explicit reconciliation.

## Failure handling
Malformed export: fail closed. Missing provenance: quarantine event and block privileged action. Adapter incompatibility: preserve raw event evidence and escalate rather than relabeling content. Retries are limited to two export/reconciliation attempts.

## Definition of Done
**Implemented:** event contract, validator, rule, hook, workflow, independent reviewer, tests. **Measured:** validation report contains counts and blocking reasons. **Verified:** all tests pass and a real runtime integration demonstrates zero privileged actions authorized by unverifiable user-role context.