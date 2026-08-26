# AI Review Sybil Provenance Gate

**Category:** Security  
**Date:** 2026-08-26 (UTC+7)

## Problem
Approval count is not the same as independent review. A single autonomous agent can operate multiple accounts or personas and manufacture apparent consensus around a malicious software contribution.

## Evidence
Current public evidence, existing controls, limitations, root causes and source links are in `evidence/research.md`.

## Existing approach
Required approvals, CODEOWNERS, branch protection, account authentication, manual maintainer judgment, signed commits/builds and artifact attestations.

## Existing limitations
Most merge policies count accounts rather than underlying controlling principals. Artifact provenance establishes build origin but does not prove reviewer independence. Unknown or self-asserted AI identities can still look like separate reviewers.

## Proposed improvement
Count only approvals backed by verified controller provenance. Multiple accounts under one controller count once; author-controlled approvals do not count; unknown provenance does not count for protected merges; and high-risk changes require at least one verified human CODEOWNER.

## Architecture
```text
ai-review-sybil-provenance-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-merge-provenance-gate.md
├── rules/review-quorum.md
├── scripts/review_provenance_gate.py
├── skills/review-provenance-analysis.md
├── subagents/provenance-security-reviewer.md
├── tests/test_review_provenance_gate.py
└── workflows/verify-review-quorum.md
```

## Installation
Python 3.10+; no third-party Python dependencies. Production integration additionally needs a trustworthy identity/provenance source such as an authenticated organization mapping or verified attestation service.

## Configuration
Edit `config/policy.json` for unique-controller quorum and protected-path policy. Do not populate controller IDs from username guesses; use authenticated provenance.

## Usage
```bash
python scripts/review_provenance_gate.py --event pr-event.json --policy config/policy.json
python -m unittest tests/test_review_provenance_gate.py
```

Example review records provide `login`, `decision`, `controller_id`, `provenance_status`, `identity_type`, and `codeowner`. The PR event also supplies `author_controller_id`.

## Workflow
Observe → measure raw quorum → resolve provenance → diagnose controller duplication → obtain independent review if needed → measure again → independent security verification → merge.

## Metrics
Raw approval count, unique verified controllers, duplicate-controller rejection count, unknown-provenance rate, author-controlled approval count, human CODEOWNER coverage, blocked protected merges, and false-block review count.

## Verification
The test suite covers independent valid approvals, two accounts under one controller, unknown provenance, author-controlled approval, and missing human CODEOWNER. Production verification must also confirm provenance inputs came from authenticated sources and normal CI/security review remains green.

## Safety
This package does not attempt to infer hidden Sybil relationships from profile similarity or personal attributes. It only enforces independence using verified controller provenance. Provenance is an identity/integrity signal, not a verdict that code is safe. Normal code review, supply-chain scanning, sandboxing and branch protection remain required.

## Failure handling
**Detection:** insufficient unique controllers, missing human CODEOWNER, unknown provenance, author-controlled approval, malformed event.  
**Evidence:** deterministic gate output plus attestation references.  
**Retry policy:** at most two provenance-retrieval attempts.  
**Fallback:** block merge and request a genuinely independent verified reviewer.  
**Escalation:** authorized security/repository owner reviews explicit exceptions.  
**Stop condition:** unresolved provenance or quorum failure remains after retries.

## Definition of Done
- **Implemented:** provenance gate is integrated before protected merges.
- **Measured:** raw approval and unique-controller metrics are captured.
- **Verified:** tests pass and an independent security reviewer reproduces the allow/block decision.
- Author-controlled and duplicate-controller approvals do not count.
- Required human CODEOWNER approval is verified.
- Normal tests/security checks pass and no secrets are exposed.

## Customization
Organizations can add stronger controller-attestation formats, risk tiers, expiry windows or multiple human-review requirements. Do not lower verified-controller independence for convenience or performance.
