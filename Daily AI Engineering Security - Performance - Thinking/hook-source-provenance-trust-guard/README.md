# Hook Source Provenance Trust Guard

**Category:** Security

## Problem
Executable coding-agent hooks may be reviewed as one pending set even when they originate from different plugins/integrations. Compatibility installation can flatten origin into generic user configuration, making broad `Trust all` choices unsafe.

## Evidence
See `evidence/research.md` for current Codex and Claude Code evidence from August 2026.

## Existing approach and limitation
Per-command hash trust prevents silent command mutation, while hook browsers can display config source. Neither alone preserves installer/plugin provenance when multiple sources share storage or compatibility installers write into user config.

## Proposed improvement
Bind exact hook command hashes to a durable source ID, source version and hook event. Review and verify one source at a time so unrelated pending hooks remain untouched.

## Package tree
```
README.md
evidence/research.md
config/policy.json
scripts/hook_provenance.py
tests/test_hook_provenance.py
skills/source-scoped-hook-review.md
rules/hook-trust-boundary.md
subagents/security-verifier.md
workflows/review-install-update.md
hooks/pre-execution-provenance-gate.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Adopt a stable source naming convention such as `plugin:<publisher>/<name>`. Organizational managed policy remains authoritative.

## Usage
Prepare `hooks.json` as an array with `source_id`, optional `source_version`, `event`, and exact `command`.

Build a reviewed ledger:
`python3 scripts/hook_provenance.py build hooks.json --output trusted-ledger.json`

Verify one source:
`python3 scripts/hook_provenance.py verify hooks.json trusted-ledger.json --source plugin:publisher/name`

Exit codes: 0 verified; 1 trust mismatch; 2 invalid evidence.

## Metrics
Unattributed hooks, approval scope size, changed hashes detected, accidental cross-source approvals, review time per source.

## Verification
Run `python3 -m unittest tests/test_hook_provenance.py`. Also compare the ledger with the platform's current hook inventory; unit tests do not prove installer metadata authenticity.

## Safety
The reference implementation never executes hook commands and fails closed on missing/mismatched provenance. Trust-bypass flags MUST NOT be persisted as a workaround.

## Failure handling
Missing provenance or mismatch keeps hooks pending and requires human/platform review. No autonomous retry guesses ownership.

## Definition of Done
**Implemented:** ledger, gate and enforceable review rules exist. **Measured:** current hook inventory/source attribution is captured. **Verified:** source-local mutations invalidate only affected records, unrelated approvals remain unchanged, tests pass and no bypass is used.
