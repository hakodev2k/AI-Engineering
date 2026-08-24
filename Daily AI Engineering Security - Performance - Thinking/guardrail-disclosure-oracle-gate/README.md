# Guardrail Disclosure Oracle Gate

## Topic
Prevent refusal and guardrail responses from becoming an adaptive reconnaissance oracle.

## Category
Security

## Problem
A denied action can still leak security-sensitive details. Repeated natural-language probing can turn explanations about hidden routes, parameters, guardrails or historical mitigations into a map of the attack surface.

## Evidence
See `evidence/research.md`. Current evidence includes CoSnitch/CVE-2026-24301 (patched 2026-08-18), independent coverage of the meta-hacking technique, July 2026 black-box guardrail-reconnaissance research, and AWS guidance to assume prompt information can leak.

## Existing approach
Typical deployments rely on model refusal policies, prompt secrecy, input classifiers, server-side patches, rate limits and least-privilege connectors.

## Existing limitations
Those controls may block the requested action but leave the denial text unconstrained. An attacker can learn from successive denials even when no single answer prints the complete system prompt.

## Proposed improvement
Treat denial output as a security-sensitive interface: render coarse public reason codes, audit user-visible responses against a versioned protected-surface configuration, evaluate cumulative multi-turn leakage, and require independent verification.

## Architecture
```text
probe corpus / application denials
        |
        v
scripts/oracle_probe_audit.py <--- config/protected-surface.example.json
        |
        +--> pass: independent verifier checks boundary + benign usability
        |
        `--> fail: remediate disclosure; maximum two iterations
```

## Package tree
```text
README.md
evidence/research.md
config/protected-surface.example.json
scripts/oracle_probe_audit.py
tests/test_oracle_probe_audit.py
rules/denial-disclosure-policy.md
skills/refusal-oracle-threat-model.md
subagents/security-verifier.md
workflows/research-harden-verify.md
hooks/pre-release-oracle-probe.md
```

## Installation
Requires Python 3.9+ for the audit script. Tests use `pytest`.

```bash
python3 -m pip install pytest
```

The runtime auditor itself uses only the Python standard library.

## Configuration
Copy `config/protected-surface.example.json` to a deployment-owned file. Replace example literals with internal-only names/concepts that must never appear in denial output. Do not put credentials, tokens or actual secrets in this file; use identifiers/patterns sufficient to detect disclosure.

## Usage
Prepare JSONL with one visible response per line:

```json
{"sequence_id":"probe-1","turn":1,"denied":true,"reason_code":"ACTION_NOT_ALLOWED","response":"I cannot perform that action."}
```

Run:

```bash
python3 scripts/oracle_probe_audit.py probe.jsonl --config config/protected-surface.json --report oracle-audit.json
```

Exit `0` means pass, `2` means policy violation, and `3` means invalid input/configuration.

## Workflow
Follow `workflows/research-harden-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → independently verify. Retries are bounded to two remediation attempts.

## Metrics
- protected matches per response;
- unique protected matches per sequence;
- benign false-positive rate;
- attack-path regression pass rate;
- release-blocking violation count.

## Verification
Run:

```bash
python3 -m pytest -q tests/test_oracle_probe_audit.py
python3 scripts/oracle_probe_audit.py <release-transcript.jsonl> --config <reviewed-config.json>
```

A scanner pass is necessary but not sufficient: the Security Verifier must also confirm the denied action remains denied and no privilege boundary was weakened.

## Safety
Do not place credentials or hidden chain-of-thought in probe transcripts. Do not remediate scanner failures by deleting legitimate protected entries, broadening permissions, disabling authorization or suppressing required user-correctable errors.

## Failure handling
Detection is deterministic. A violation blocks release. Maximum remediation retries: two. Fallback: deterministic generic denial rendering using public reason codes. Escalation: security owner. Stop if the authorization boundary regresses or leakage remains after two attempts.

## Definition of Done
- **Implemented:** policy, config and executable audit are integrated.
- **Measured:** representative benign/adversarial denial sequences have baseline and post-change reports.
- **Verified:** zero unapproved protected disclosures, benign correction cases pass, the protected action remains blocked, tests pass, risks are documented, and an independent verifier records `VERIFIED`.

## Customization
Extend protected patterns for product-specific routes/tool metadata and tune public reason codes. Keep the external denial contract stable while allowing richer internal telemetry outside model/user-visible output.