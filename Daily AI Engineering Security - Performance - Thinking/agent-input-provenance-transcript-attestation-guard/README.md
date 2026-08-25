# Agent Input Provenance Transcript Attestation Guard

## Topic
Attest authoritative model-visible inputs against durable origin evidence before privileged agent action.

## Category
Security

## Problem
Current agent runtimes can have divergent input surfaces: human UI submissions, durable transcripts, runtime notifications, resume state, subagents, tool outputs, and final model-request assembly. Recent 2026 reports show user/system-styled messages reaching model context without corresponding human submissions or transcript records. If privileged tools trust role/wording rather than origin, this becomes an authorization failure.

## Evidence
See `evidence/research.md`. The package is grounded in multiple July–August 2026 Claude Code reports, including issues #87278, #88115, #83338, #86271 and #85568.

## Existing approach
Prompt-injection filtering, transcripts, tool permission policies, sandboxing, and approval prompts reduce risk but do not prove that an authoritative role actually originated from the human/control plane it claims to represent.

## Existing limitations
Role labels are metadata assigned inside runtime pipelines; transcript and prompt assembly may diverge; pre-approved tools may execute without a fresh approval; and post-hoc logging cannot stop a mismatched instruction before the action.

## Proposed improvement
Create a durable provenance ledger for model-visible authoritative events and enforce action-time attestation. Bind each event to source, role, session, SHA-256 content hash, persistence state, ancestry, and human-submission evidence. Block privileged actions when provenance is missing or contradictory.

## Architecture
- `evidence/research.md` — current signals, existing controls, limitations, root causes.
- `rules/provenance-boundary.md` — enforceable trust-boundary rules.
- `skills/attest-authoritative-input.md` — reusable attestation procedure.
- `subagents/security-verifier.md` — independent read-only verifier.
- `workflows/attest-before-privileged-action.md` — bounded diagnose/implement/verify workflow.
- `hooks/pre-privileged-tool-attestation.md` — deterministic action-time gate contract.
- `scripts/provenance_guard.py` — dependency-free validator.
- `tests/test_provenance_guard.py` — positive/adversarial regression suite.

## Actual package tree
```text
agent-input-provenance-transcript-attestation-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-privileged-tool-attestation.md
├── rules/
│   └── provenance-boundary.md
├── scripts/
│   └── provenance_guard.py
├── skills/
│   └── attest-authoritative-input.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_provenance_guard.py
└── workflows/
    └── attest-before-privileged-action.md
```

## Installation
Requires Python 3.10+ only. No third-party packages are needed.

## Configuration
The host supplies a JSONL provenance ledger. Each record requires `event_id`, `session_id`, `role`, `source`, `content_sha256`, and `persisted`. Human user events additionally require `human_submission: true` and `submitted_at`.

## Usage
Run tests:

`python -m unittest discover -s tests -p 'test_*.py'`

Attest an event:

`python scripts/provenance_guard.py --ledger ledger.jsonl --event-id e123 --content-file candidate.txt --risk privileged`

Exit codes: `0 allow`, `2 downgrade`, `3 block`, `4 invalid evidence/input`.

## Workflow
Observe causal event → measure provenance baseline → diagnose mismatch → form evidence-backed hypothesis → implement boundary fix → measure again → retry at most twice if needed → independent verification → complete.

## Metrics
Track unattested authoritative messages, human-role/source mismatches, hash mismatches, provenance-blocked privileged actions, validator p95 latency, and false-positive rate.

## Verification
### Implemented
Ledger emission and action-time gate are wired by the host.

### Measured
Before/after mismatch and gate-latency metrics are recorded.

### Verified
- Genuine human submission passes.
- Runtime-generated content mislabeled as `user` blocks privileged action.
- Changed content after persistence is detected.
- Missing/duplicate events fail closed.
- Independent verifier reproduces the result.

## Safety
Never execute candidate content. Never log raw secrets. A runtime event may remain useful context but does not inherit human authority. High-risk provenance failures are fail-closed.

## Failure handling
Detection: validator mismatch/invalid-ledger exit code. Evidence: event IDs, metadata and hashes. Retry: at most two implementation iterations with a new hypothesis. Fallback: read-only investigation or explicit fresh human submission. Escalation: security/runtime owner. Stop: unresolved mismatch or exhausted retries.

## Definition of Done
Evidence documented; current controls and limitations identified; host integration implemented; deterministic tests pass; metrics captured; adversarial fixtures blocked; legitimate fixture passes; independent verification complete; no raw secrets exposed; no blocking mismatch remains.

## Customization
Extend source classes and risk levels only if they preserve explicit origin semantics. Do not map machine-generated sources into human authority for convenience.