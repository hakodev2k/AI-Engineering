# Safety Classifier Context Provenance Gate

**Category:** Security

## Problem
Safety classifiers can conflate user/retrieved content with system, plugin, hook, or defensive-security context. Current 2026 reports show false positives, noisy retries, and classifier availability failures. Disabling the safety gate removes a real security boundary.

## Evidence
See `evidence/research.md`.

## Existing approach
Model-based safety classifiers, tool allowlists, human approval, plugin/hook configuration, and retries.

## Existing limitations
Origin metadata is often lost at the decision surface; denials can be opaque; retries repeat unchanged evidence; classifier outages can stop work.

## Proposed improvement
Preserve context provenance through the classifier boundary and deterministically reconcile outcomes. Trusted-control-only flags route to review, not automatic approval. User/untrusted flags remain blocked. Classifier outages use risk-based fail-safe handling.

## Architecture
- `config/policy.json` — fallback/retry policy.
- `scripts/provenance_gate.py` — executable provenance/decision reconciler.
- `tests/test_provenance_gate.py` — security regression suite.
- `skills/classifier-provenance-analysis.md` — investigation procedure.
- `rules/provenance-aware-safety.md` — invariants.
- `subagents/safety-reviewer.md` — independent verifier.
- `workflows/provenance-diagnosis.md` — diagnosis path.
- `workflows/regression-verification.md` — change verification.
- `hooks/pre-classifier-envelope.md` — integration contract.
- `evidence/research.md` — research record.

## Actual package tree
```text
.
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-classifier-envelope.md
├── rules/provenance-aware-safety.md
├── scripts/provenance_gate.py
├── skills/classifier-provenance-analysis.md
├── subagents/safety-reviewer.md
├── tests/test_provenance_gate.py
└── workflows
    ├── provenance-diagnosis.md
    └── regression-verification.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` through normal code review. Security-weakening fallback changes require explicit human approval and tests.

## Usage
```bash
python scripts/provenance_gate.py input.json --policy config/policy.json --output gate-record.json
```
Exit codes: `0` allow, `2` manual review, `3` block, `4` invalid input/config.

## Workflow
Observe → baseline → provenance diagnosis → instrumentation/fix → measure again → independent verification.

## Metrics
Denials/100 calls; provenance-resolution rate; identical retries; manual-review rate; unavailable rate; reviewed false-positive rate; unsafe false negatives; p50/p95 latency.

## Verification
```bash
python -m unittest discover -s tests -v
```
A passing suite verifies this reference gate, not the quality of an external classifier.

## Safety
Never converts a classifier rejection into silent approval. Trusted-control-only flags require review. User/untrusted flags block. Critical actions block during classifier outage.

## Failure handling
Malformed evidence → invalid-input failure. Missing provenance → block/review. Unchanged retries are bounded. After two failed fix/retest cycles, stop and escalate.

## Definition of Done
- **Implemented:** all listed files exist and gate executes.
- **Measured:** representative traces/fixtures have before/after metrics.
- **Verified:** tests pass; untrusted injection remains blocked; risky outage fallback does not auto-allow; independent review complete; no blocking issue remains.

## Customization
Adapters may map host-specific source types into the three trust classes, but MUST preserve `rules/provenance-aware-safety.md`.
