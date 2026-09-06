# Windows Sandbox Read-Boundary Attestation

**Category:** Security

A configured filesystem policy is not sufficient proof that the effective native-Windows read boundary is enforced. Fresh Codex reports show both silent out-of-bound reads and deny-read ACL initialization failures. This package converts that problem into a measurable preflight attestation.

## Evidence
See `evidence/research.md` for current sources, existing approaches, limitations, root causes, and the proposed improvement.

## Architecture
- `config/policy.example.json` — normalized expected probe policy.
- `skills/effective-read-boundary-audit.md` — evidence-driven audit procedure.
- `rules/sandbox-read-boundary.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verifier role.
- `workflows/preflight-and-regression.md` — bounded diagnose/repair/retest workflow.
- `hooks/pre-sensitive-task.md` — blocking pre-task gate.
- `scripts/attest_read_boundary.py` — deterministic evidence validator.
- `tests/test_attest_read_boundary.py` — regression tests.

## Package tree
```text
windows-sandbox-read-boundary-attestation/
├── README.md
├── config/policy.example.json
├── evidence/research.md
├── hooks/pre-sensitive-task.md
├── rules/sandbox-read-boundary.md
├── scripts/attest_read_boundary.py
├── skills/effective-read-boundary-audit.md
├── subagents/security-verifier.md
├── tests/test_attest_read_boundary.py
└── workflows/preflight-and-regression.md
```

## Installation
Python 3 only; there are no third-party dependencies. Copy the package directory intact.

## Configuration
Create a local policy from `config/policy.example.json`. Use synthetic sentinels only: at least one readable sentinel inside the permitted root and at least one forbidden sentinel outside it. Never use real secrets as probe contents.

## Usage
Collect production-equivalent sandbox observations by following the skill, then run:

`python scripts/attest_read_boundary.py --policy <policy.json> --observations <observations.json> --output <attestation.json>`

Run regression tests:

`python -m unittest tests/test_attest_read_boundary.py`

## Workflow
Observe → measure allowed/denied probes → diagnose → form one testable hypothesis → operator repair if required → remeasure complete probe set → deterministic validation → independent verification. Retries are bounded to two for ambiguous setup failures. A confirmed forbidden read blocks immediately.

## Metrics
Forbidden-read escapes (target 0), required probe coverage (100%), allowed-probe success (100%), incomplete attestations, regressions per sandbox upgrade/recovery, and time-to-detect boundary drift.

## Verification
**Implemented:** package and policy are installed. **Measured:** current production-equivalent probe evidence exists. **Verified:** validator returns 0, unit tests pass, all required forbidden probes are explicitly denied, allowed probes work, and an independent verifier accepts the evidence.

Historical evidence does not survive a sandbox upgrade, policy change, reboot/crash recovery, or sandbox-state regeneration.

## Safety
The package never changes ACLs, broadens permissions, or reads real secrets. Generic sandbox errors are not accepted as successful denial. High-risk recovery actions require explicit human/operator approval.

## Failure handling
Detection: validator exit 2/3, failed tests, missing probes, or sandbox-health failure. Evidence: preserve non-secret diagnostics. Retry: maximum two diagnostic/retest cycles for incomplete initialization failures; none after a confirmed boundary violation. Fallback: keep sensitive work blocked and use a separately verified environment. Escalation: platform/security owner. Stop when verified, on confirmed violation, or after two incomplete retests.

## Definition of Done
Current evidence is complete; no forbidden read succeeds; allowed probes work; validator/tests pass; risks and any recovery are recorded; independent verification is complete; no blocking security issue remains.

## Customization
Add synthetic forbidden probes for credential directories, SSH locations, sibling repositories, or host configuration boundaries. Preserve canonical-path reporting and explicit result classification.
