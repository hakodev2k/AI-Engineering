# Evidence-Backed Completion Gate

## Category
Thinking

## Problem
Engineering agents can conflate “implemented” with “verified,” over-generalize narrow checks, lose acceptance criteria during long tasks, or terminate after partial milestones while still sounding complete.

## Evidence
See `evidence/research.md`. Recent August 2026 signals include Codex issues requesting requirement-to-evidence completion records and reporting premature termination with unmet acceptance gates, a Claude Plugins issue where verifier/simplifier agents assert checks they do not execute, and the emergence of deterministic agent-claim verification tooling such as Backcheck.

## Existing approach
Natural-language final summaries, prompt instructions to self-check, conversational plans/checklists, opportunistic tests, and later CI/review.

## Existing limitations
These approaches do not deterministically bind completion claims to actual tool results. Evidence can become stale after later edits, focused tests can be over-scoped, and conversational state can drift across compaction or handoffs.

## Proposed improvement
Maintain a durable requirement/evidence ledger and make finalization a deterministic gate. Each material requirement has one status. Verification requires fresh successful evidence. Later relevant changes invalidate prior evidence. Required incomplete rows block terminal success unless an exception is explicitly accepted.

## Architecture
```text
user requirements
  -> durable requirement ledger
implementation events -> implemented_unverified
validation events -> evidence records
relevant edits -> freshness invalidation
independent verifier
  -> scripts/completion_gate.py
       -> allow: final report from ledger
       -> block: bounded recovery or incomplete/blocked report
```

## Package tree
```text
evidence-backed-completion-gate/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-finalization.md
├── rules/
│   └── completion-claims.md
├── schemas/
│   └── completion-evidence.schema.json
├── scripts/
│   └── completion_gate.py
├── skills/
│   └── evidence-backed-completion.md
├── subagents/
│   └── independent-verifier.md
├── tests/
│   └── fixtures.json
└── workflows/
    └── verify-before-complete.md
```

## Installation
Requires Python 3.9+ with no third-party dependencies for the gate itself. Integrate ledger updates into task/agent events and run the pre-finalization hook before terminal success responses.

## Configuration
The schema in `schemas/completion-evidence.schema.json` defines the interoperable ledger representation. Integrators may add evidence kinds or metadata, but should retain the five requirement statuses and freshness semantics.

## Usage
Persist a ledger JSON, then execute:

`python scripts/completion_gate.py ledger.json`

Exit `0` allows completion. Exit `4` blocks completion. Exit `2` means the ledger itself is invalid.

## Workflow
Use `workflows/verify-before-complete.md`: capture acceptance rows → implement → collect evidence → check freshness → verify missing claims → independent review → deterministic gate → bounded recovery.

## Metrics
- requirement status coverage
- verified rows with fresh evidence
- unsupported success claims blocked
- stale evidence detections
- premature-finalization attempts
- rework after declared completion
- reviewer time to reconstruct verification

## Verification
Use `tests/fixtures.json` to test four critical cases: fully verified passes, implemented-but-unverified blocks, stale green evidence blocks, and failed evidence cannot support verification. Add real repository tests where an edit occurs after a successful test and confirm finalization remains blocked until a fresh relevant validation succeeds.

## Safety
The package does not expose hidden chain-of-thought. Evidence is restricted to externally inspectable requirements, artifacts, commands, tool results, sequence/freshness data, accepted exceptions, and verification state. It does not weaken human approval or security controls.

## Failure handling
Detection: gate exit `2`/`4`, missing evidence, stale evidence, failed validation, or unmet required row. Evidence: retain structured ledger and tool result references. Retry: maximum two recovery cycles, each requiring new implementation or new evidence. Fallback: report incomplete/blocked with the exact unmet rows. Escalation: human review when required verification cannot run or acceptance criteria conflict. Stop: never loop indefinitely and never convert missing evidence into success.

## Definition of Done
### Implemented
- Material requirements are durable rows.
- Validation events are captured as evidence.
- Pre-finalization calls the deterministic gate.
- Relevant post-validation edits can make evidence stale.

### Measured
- Baseline and post-integration unsupported-claim/premature-finalization indicators are recorded.

### Verified
- All package fixtures behave as expected.
- A real stale-evidence scenario blocks completion.
- Required verified rows have fresh evidence matching claim scope.
- Independent verifier and deterministic gate agree on finalization.
- No hidden reasoning is requested or exposed.

## Customization
Integrate evidence ingestion with CI, test runners, Git events, task state, or multi-agent handoff systems. Keep `verified` strict: observable fresh evidence must support the claim, and accepted exceptions must remain distinguishable from verification.
