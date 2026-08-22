# Retrieval Provenance Claim Gate

**Category:** Thinking

## Problem
AI assistants can use completion-state language such as “I found it,” “I opened it,” “I read that chat,” or “I’m monitoring it” without a successful retrieval/tool result. That turns inference or intent into apparent observation and makes downstream users unable to distinguish what was actually retrieved from what was merely assumed.

## Evidence
See `evidence/research.md`. Two independent reports filed 2026-08-19 describe this failure across text and Voice: OpenAI Codex #39485 (exact-title cross-chat retrieval claims without actual retrieval) and #39472 (Voice claiming live visibility into another chat without tool evidence).

## Existing approach and limitations
General anti-hallucination instructions, visible tool transcripts, and source citations help, but they do not enforce the specific invariant that a completion-state access claim must correspond to a successful action on the claimed source.

## Proposed improvement
Maintain a typed evidence ledger and gate completion-state access claims before output. A claim is allowed only when a successful evidence record matches both source identity and action class. Otherwise the response is rewritten to an accurate attempt, inference, user-provided, unavailable, or unverified state.

## Architecture
- `skills/provenance-claim-classification.md` — reusable classification and correction procedure.
- `rules/provenance-rules.md` — enforceable provenance invariants.
- `subagents/provenance-verifier.md` — independent material-claim verifier.
- `workflows/claim-evidence-verify.md` — bounded claim/evidence workflow.
- `hooks/pre-output-provenance-check.md` — pre-output deterministic gate contract.
- `scripts/provenance_gate.py` — structured claim/evidence validator.
- `tests/test_provenance_gate.py` — success, failure, wrong-source, inference, and missing-evidence tests.
- `evidence/research.md` — public evidence, limitations, and root-cause analysis.

## Package tree
```text
retrieval-provenance-claim-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-output-provenance-check.md
├── rules/provenance-rules.md
├── scripts/provenance_gate.py
├── skills/provenance-claim-classification.md
├── subagents/provenance-verifier.md
├── tests/test_provenance_gate.py
└── workflows/claim-evidence-verify.md
```

## Installation
Requires Python 3.9+ for the deterministic validator and no third-party dependencies. The runtime integration should emit structured claim records and evidence records.

## Data contract
A completion claim should contain at least `id`, `kind=observation-complete`, `source_id`, and `action`. A successful evidence record should contain `id`, matching `source_id`, matching `action`, and `status=succeeded`.

## Usage
Run:

`python scripts/provenance_gate.py --claims claims.json --evidence evidence.json`

Exit code `0` means all gated claims are allowed. Exit code `3` means one or more claims require rewrite. Exit code `2` indicates invalid input/runtime error.

## Workflow
Identify claims → classify provenance state → match source/action success evidence → rewrite unsupported completion language → optionally retry retrieval once → reclassify → independently verify material claims.

## Metrics
Unsupported completion claims per 1,000 gated claims, successful evidence-match rate, wrong-source mismatch rate, false-block rate, correction rate, verifier rejection rate, and user provenance challenges.

## Verification
A valid `observation-complete` claim must match a successful evidence record for the same source and action. Failed attempts, timeouts, empty retrieval, current user-provided text, or inference cannot authorize a direct-observation claim.

## Safety and reliability
This package never requests hidden chain-of-thought. It uses only observable action/result metadata. If provenance metadata is missing, it fails closed for completion-state access wording while still allowing truthful limitation/inference language.

## Failure handling
Only one retrieval retry is permitted for the same source/action unless materially new evidence changes the strategy. If evidence remains absent, stop and describe the source as unavailable or unverified.

## Definition of Done
Public evidence documented; claim classes defined; source/action matching implemented; deterministic tests pass; unsupported completion claims are rewritten; high-impact claims receive independent verification when configured; no completion-state claim is upgraded from ambiguous provenance.

## Status
**Implemented:** package files, deterministic validator, tests, bounded workflow.

**Measured:** requires integration telemetry from an adopting assistant/runtime.

**Verified:** requires the test suite plus an evaluation set showing unsupported completion claims are blocked without unacceptable false blocking of evidence-backed claims.

## Customization
Extend gated action names for domain-specific tools such as `browser.observe`, `history.read`, `file.open`, `screen.capture`, or `api.fetch`. Preserve stable source identity and do not weaken the `status=succeeded` requirement for observation-complete claims.
