# Structured Output Retry Watchdog

**Category:** Thinking

## Problem
Schema-constrained agents can finish substantive work but enter repeated invalid/empty StructuredOutput retries. A single wedged worker can then consume token/tool budgets and block parallel verification.

## Evidence
Current public evidence and source links are in `evidence/research.md`.

## Existing approach
Frameworks commonly use schema validation, automatic retry, generic loop detection, global timeouts, and manual cancellation.

## Existing limitations
These controls often do not canonicalize repeated validation failures, require evidence before retrying, or release parallel barriers safely after a bounded worker failure.

## Proposed improvement
A deterministic convergence watchdog keyed by normalized failure signature, with per-stage retry budgets, no-progress deadlines, evidence-bearing recovery, typed partial failure, and independent verification.

## Architecture
```text
structured-output-retry-watchdog/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/retry_watchdog.py
├── tests/test_retry_watchdog.py
├── skills/convergence-diagnosis.md
├── rules/bounded-reasoning.md
├── subagents/convergence-verifier.md
├── workflows/diagnose-recover.md
├── workflows/parallel-barrier-verification.md
└── hooks/post-validation.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Tune bounded values only in `config/policy.json`. Increasing retry limits requires measured evidence that valid recoveries need the additional attempts.

## Usage
After a validation failure, serialize the failure event and run:
`python scripts/retry_watchdog.py --event event.json --policy config/policy.json`

## Workflow
Observe → validate baseline → signature diagnosis → recovery hypothesis → evidence-bearing retry → validate again → fail-partial/stop if not improved → independent verification.

## Metrics
Retries per failure signature; no-progress terminations; token/tool calls avoided; workflow wall time; recovery success; verified partial-coverage rate; unsupported-output regression rate.

## Verification
Run `python -m unittest tests/test_retry_watchdog.py`. Then follow `workflows/parallel-barrier-verification.md` with a verifier distinct from the implementer.

## Safety
Never fabricate schema fields to escape a retry loop. Do not increase budgets to hide convergence failure. Preserve evidence and explicitly mark partial results.

## Failure handling
**Detection:** validator error, repeated signature, or no-progress deadline.  
**Evidence:** validator output plus watchdog record.  
**Retry policy:** bounded by `config/policy.json`.  
**Maximum retries:** 2 identical failures, 4 total per stage by default.  
**Fallback:** typed `fail-partial`.  
**Escalation:** only when a critical required fact is missing.  
**Stop condition:** retry cap, stage budget, no-progress deadline, or unsupported required field.

## Definition of Done
**Implemented:** watchdog, policy, hook, workflows and verifier integrated.  
**Measured:** retry, latency/call and validation metrics collected.  
**Verified:** tests pass, repeated failures terminate within bounds, recovered fields are evidence-backed, parallel release cannot omit a critical requirement, and no blocking issue remains.

## Customization
Add framework adapters around the event JSON contract while preserving the canonical-signature, bounded-retry and independent-verification invariants.
