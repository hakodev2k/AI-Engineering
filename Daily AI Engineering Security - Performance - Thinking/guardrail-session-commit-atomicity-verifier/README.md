# Guardrail Session Commit Atomicity Verifier

**Category:** Security / Thinking

## Problem
Tool execution, guardrails, durable sessions, streaming, approvals, resume, and terminal error handlers create multiple commit boundaries. If a terminal path persists only part of a logical tool interaction or retains rejected payloads inconsistently, later replay and audit can consume state that is structurally or semantically false.

## Evidence
See `evidence/research.md`. August 2026 OpenAI Agents SDK issues #4125 and #4393 exposed distinct terminal-path persistence inconsistencies, while current SDK documentation now defines explicit persistence and redaction semantics for output guardrails.

## Existing approach
Frameworks persist sessions and may repair or filter history before a later model call. Application code often relies on those defaults plus per-bug unit tests.

## Existing limitations
A later cleanup can hide invalid durable state from audits and custom consumers. Fixing one streaming or guardrail path does not automatically prove resume, max-turn, cancellation, error-handler, and non-streaming paths obey the same invariants. Replaying a side-effecting tool to reconstruct a missing output is unsafe.

## Proposed improvement
Validate terminal state as a commit contract: tool calls and outputs must pair, terminal provenance must be explicit, rejected terminal payloads must follow redaction policy, executed side effects require commit evidence, and equivalent streaming/non-streaming paths must normalize to equivalent history.

## Architecture
- `evidence/research.md` grounds the failure class in current public evidence.
- `config/integrity-policy.json` defines deterministic integrity requirements.
- `skills/session-integrity-analysis.md` provides the reusable analysis procedure.
- `rules/terminal-path-atomicity.md` provides enforceable invariants.
- `subagents/session-verifier.md` independently verifies changes.
- `workflows/terminal-integrity-verification.md` defines bounded diagnosis and repair.
- `hooks/pre-resume-integrity-check.md` blocks replay of invalid state.
- `scripts/session_integrity.py` performs deterministic validation.
- `tests/test_session_integrity.py` covers valid, orphan, ambiguous-side-effect, and parity cases.

## Actual package tree
```text
guardrail-session-commit-atomicity-verifier/
├── README.md
├── config/
│   └── integrity-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-resume-integrity-check.md
├── rules/
│   └── terminal-path-atomicity.md
├── scripts/
│   └── session_integrity.py
├── skills/
│   └── session-integrity-analysis.md
├── subagents/
│   └── session-verifier.md
├── tests/
│   └── test_session_integrity.py
└── workflows/
    └── terminal-integrity-verification.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package directory intact.

## Configuration
Review `config/integrity-policy.json`. Do not enable orphan calls/outputs in production merely to pass validation. If your runtime uses a different approved blocked-output marker, change it deliberately and update tests.

## Usage
Validate a session:

```bash
python scripts/session_integrity.py session.json --policy config/integrity-policy.json --strict
```

Compare equivalent streaming/non-streaming normalized histories:

```bash
python scripts/session_integrity.py streamed.json --policy config/integrity-policy.json --compare nonstreamed.json --strict
```

Run tests:

```bash
python -m unittest tests/test_session_integrity.py
```

## Input schema
The session is a JSON object with `terminal_reason`, `guardrail_status`, and `items`. Tool calls use `type=function_call`, `call_id`, and optional `side_effecting`, `executed`, and `terminal_output`. Outputs use `type=function_call_output`, the same `call_id`, `content`, and `commit_evidence` for executed side effects.

## Workflow
Follow `workflows/terminal-integrity-verification.md`: Observe → snapshot → normalize → validate → diagnose → form hypothesis → implement without side-effect replay → reproduce → compare → independently verify. Maximum two implementation attempts.

## Metrics
- orphan call/output count
- terminal-reason coverage
- blocked payload leakage count
- streaming/non-streaming parity mismatch count
- ambiguous side-effect/manual-review count

## Verification
**Implemented** means the commit/persistence change exists. **Measured** means affected terminal fixtures reproduce and then pass/fail deterministically. **Verified** means the independent verifier confirms structure, redaction, parity, and no side-effect replay.

## Safety
Never replay an executed side-effecting tool to repair history. Never weaken guardrails or retain rejected payloads for convenience. Ambiguous high-impact effects require human review.

## Failure handling
**Detection:** pre-resume hook or tests fail. **Evidence:** preserve raw durable state and runtime metadata. **Retry policy:** maximum two implementation attempts. **Fallback:** block resume and restore the last verified implementation/state snapshot where safe. **Escalation:** human review when an external side effect may have executed without durable commit evidence. **Stop condition:** ambiguous effect provenance, unsupported history shape, or two failed attempts.

## Definition of Done
- Current evidence documented.
- Every call/output pair is structurally valid.
- Terminal reason is explicit.
- Guardrail-blocked output follows configured policy.
- No automatic side-effect replay occurs.
- Comparison parity passes when required.
- Tests pass.
- Independent verification passes.
- No blocking integrity issue remains.

## Customization
Adapters may normalize framework-specific session items before validation. Preserve stable call IDs and side-effect provenance. Do not convert unknown/ambiguous states into `valid` merely to maintain compatibility.
