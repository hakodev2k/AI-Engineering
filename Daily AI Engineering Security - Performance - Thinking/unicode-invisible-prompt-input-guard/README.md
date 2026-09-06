# Unicode Invisible Prompt Input Guard

**Category:** Security

## Problem
Untrusted text can contain Unicode code points that software and models receive but normal interfaces do not visibly render. This creates a representation gap attackers can use to hide prompt-injection instructions, fracture detector keywords, or make a human approve text different from what an agent consumes.

## Evidence
See `evidence/research.md`. Microsoft Security Research documented the Unicode Tags block being used at multi-million-message scale in 2026 and explicitly linked the mechanism to AI prompt-injection research. ATR-2026-00313 independently tracks related zero-width steganographic prompt injection.

## Existing approach
Unicode normalization, selective stripping, OCR, anomaly detection, prompt-injection classifiers, layered mail/security signals, and model instructions all help.

## Existing limitations
Normalization forms alone do not remove all invisible characters; blanket stripping can damage legitimate content; single signatures miss alternate encodings; human review is unreliable when rendered and ingested representations differ.

## Proposed improvement
Place a deterministic scan/canonicalization gate at the untrusted-input boundary. Detect risky invisible characters, emit an escaped review representation, preserve raw evidence, optionally create a canonical copy, and bind reviewed and consumed forms with SHA-256 hashes. High-authority paths fail closed.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `rules/input-canonicalization.md` — enforceable trust-boundary rules.
- `skills/pre-ingestion-unicode-audit.md` — reusable procedure.
- `subagents/security-verifier.md` — independent verifier role.
- `workflows/pre-ingestion-security.md` — bounded measure/diagnose/remediate flow.
- `hooks/pre-ingestion-gate.md` — deterministic blocking checkpoint.
- `scripts/unicode_input_guard.py` — dependency-free scanner/canonicalizer.
- `tests/test_unicode_input_guard.py` — clean, Unicode-tag, and zero-width fixtures.

## Installation
Python 3.9+ only; no third-party dependencies. Copy the package directory into the host project.

## Configuration
The reference implementation treats Unicode Tags U+E0000–U+E007F plus selected zero-width/non-rendering characters as risky. Production deployments should review legitimate Unicode requirements and add narrowly tested exceptions at the integration layer rather than disabling the gate globally.

## Usage
Inspect only:
`python3 scripts/unicode_input_guard.py input.txt`

Generate a stripped canonical artifact:
`python3 scripts/unicode_input_guard.py input.txt --strip-risky --output canonical.txt`

Exit codes: `0` clean, `2` risky content detected, `3` operational/input error.

## Workflow
Observe raw text → measure baseline incidence → diagnose representation gaps → form a hypothesis → insert pre-tokenization control → measure again → revise at most twice if needed → independently verify exact reviewed/consumed representation.

## Metrics
Detection rate on known attack fixtures, false-positive rate, blocked high-authority inputs, review rate, raw/canonical divergence count, representation-mismatch incidents, and policy-bypass regressions.

## Verification
Run `python3 tests/test_unicode_input_guard.py`. Confirm tag and zero-width fixtures return exit 2, ordinary multilingual text returns 0, and canonical output removes only the configured risky characters. Integration verification must compare the canonical hash at the approval boundary and immediately before model/tool ingestion.

Status terminology:
- **Implemented:** gate is installed on the intended trust boundary.
- **Measured:** baseline and post-change metrics are recorded.
- **Verified:** deterministic tests and independent end-to-end hash checks pass.

## Safety
Never execute or send decoded hidden content while investigating it. Do not expose secrets through diagnostic logs. Do not weaken downstream permissions to compensate for input uncertainty. Privileged writes, command execution, deployments, credential use, external sends, and persistent-memory writes require fail-closed handling and human approval for exceptions.

## Failure handling
Detection: exit 2, exit 3, missing audit record, or reviewed/consumed hash mismatch. Evidence: escaped representation, code-point findings, raw/canonical hashes. Retry: once for deterministic operational errors; policy remediation at most two iterations. Fallback: quarantine or reject input. Escalation: security owner. Stop: no privileged action while representation integrity is unresolved.

## Definition of Done
Current evidence documented; baseline measured; trust boundary identified; gate implemented before tokenization/policy matching; attack fixtures blocked; legitimate fixtures preserved; no secret exposed; reviewed and consumed canonical hashes match; independent verifier marks VERIFIED; no blocking issue remains.

## Customization
Extend the risky set only with documented code points and tests. Add source-specific allowlists for legitimate Unicode sequences, but keep raw evidence, escaped review output, and fail-closed privileged behavior intact.
