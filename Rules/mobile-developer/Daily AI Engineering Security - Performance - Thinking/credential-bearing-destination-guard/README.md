# Credential-Bearing Destination Guard

## Category
Security

## Problem
Agent tools may receive destinations from model-generated arguments while separately attaching credentials. If destination trust is not checked at send time, prompt injection can turn an otherwise legitimate tool into a credential-exfiltration channel.

## Evidence
See `evidence/research.md`. The primary current signal is AWS CVE-2026-18655 / GHSA-xwj6-8x5h-hjp6, published 2026-08-03, where a model-controlled Amazon MQ broker hostname could receive broker credentials or OAuth tokens. OWASP SSRF guidance supplies the defense-in-depth baseline for destination validation.

## Existing approach and limitation
Tool approval, TLS verification, model instructions, hostname regexes, and generic SSRF denylists each cover only part of the boundary. TLS authenticates the selected host, not whether it is authorized to receive a secret. Human approval may be reused too broadly. String checks do not solve redirects, private addresses, rebinding, or egress policy.

## Proposed improvement
Prefer removing free-form destinations entirely and derive endpoints from trusted resource identifiers/service APIs. Where a model-provided destination is unavoidable, enforce a deterministic pre-send guard plus transport/network controls and bind approvals to the exact normalized destination, credential class, and operation.

## Architecture
- `evidence/research.md` — current evidence, current approaches, gaps, root causes, metrics.
- `config/policy.example.json` — example allowlist/credential policy.
- `scripts/destination_guard.py` — deterministic destination validator with meaningful exit codes.
- `tests/test_destination_guard.py` — safe regression tests with fake DNS responses.
- `skills/credentialed-request-threat-model.md` — reusable investigation/remediation procedure.
- `rules/destination-and-secret-boundary.md` — enforceable security requirements.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/validate-and-execute.md` — bounded measure/diagnose/implement/verify workflow.
- `hooks/pre-credentialed-request.md` — action-time blocking integration point.

## Installation
Requires Python 3.10+ and only the standard library. Copy `config/policy.example.json` to a consumer-owned, ignored path, replace example hosts with reviewed destinations, and set `DESTINATION_POLICY_PATH` to that file.

## Configuration
Use exact hosts where possible. Suffix rules must begin with `.` and require a strict subdomain match. Keep `redirects_allowed` false for credential-bearing traffic. Do not copy the sample Amazon-like suffix into production without validating the real service endpoint rules.

## Usage
Create a request envelope such as:

```json
{
  "url": "https://broker.example.com/api",
  "credential_class": "oauth",
  "operation": "connect",
  "approval": {"granted": false}
}
```

Run:

```bash
python3 scripts/destination_guard.py request.json --policy "$DESTINATION_POLICY_PATH"
```

Exit codes: `0` allow, `2` invalid input/config, `4` approval required, `5` deny. The script does not send the network request.

## Workflow
Follow `workflows/validate-and-execute.md`: Observe → baseline adversarial fixtures → diagnose free-form destination control → prefer trusted endpoint derivation → implement guard → measure again → independent security verification. Remediation loops are capped at two.

## Metrics
Target 100% guard coverage for credential-bearing paths, zero unauthorized-destination successes in adversarial tests, zero followed redirects, zero secrets in logs, and 100% action-bound approval coverage where approval is required.

## Verification
Run:

```bash
python3 -m unittest tests/test_destination_guard.py
```

Then perform integration tests with fake credentials and an HTTP mock that proves redirects remain disabled and credentials are absent from rejected requests. Independent verification is defined in `subagents/security-verifier.md`.

## Safety
Never test with production secrets or against unowned hosts. Do not treat the script as a complete SSRF firewall: enforce network egress, secure DNS/service discovery, redirect policy, TLS verification, and credential scoping independently. A guard failure blocks the request.

## Failure handling
Detection: nonzero guard exit, unexpected destination, redirect attempt, non-global resolution, or evidence of prior leakage. Evidence must be sanitized. Retry authorization failures zero times; transient DNS measurement may be retried once. Maximum remediation iterations: two. Fallback: block credential attachment/request. Escalation: service/security owner. Stop immediately and rotate credentials if leakage is plausible.

## Definition of Done
**Implemented:** every credential-bearing path invokes the guard and transport redirects are disabled. **Measured:** baseline and post-change fixtures have recorded results. **Verified:** adversarial paths are blocked, valid expected paths work, approval binding is tested, no secret logging exists, and an independent verifier reports no blocking finding.

## Customization
Extend credential classes and exact destinations conservatively. For internal services, create a separate reviewed policy and egress boundary rather than weakening `require_global_ip` globally. Prefer adding trusted resource identifiers/service discovery instead of expanding host wildcards.
