# MCP Credential Destination Binding Guard

## Topic
Deterministic destination authorization for credential-bearing MCP and agent-tool requests.

## Category
Security

## Problem
A model-influenced hostname or URL can become a credential-exfiltration path when a tool automatically attaches Basic auth, OAuth tokens, API keys, or similar credentials without first proving that the destination is authorized for that credential class.

## Evidence
The August 3, 2026 advisory GHSA-xwj6-8x5h-hjp6 documented this class in the AWS Labs Amazon MQ MCP server, where attacker-controlled `broker_hostname` values could receive broker credentials or OAuth tokens before version 2.0.24. See `evidence/research.md` for observed evidence, interpretation, existing mitigations, limitations, and sources.

## Existing approach
Common defenses include TLS, input syntax validation, server vetting, generic prompt-injection detection, and occasional human approval.

## Existing limitations
Those controls do not necessarily bind a particular credential to a particular authorized network destination. TLS secures whichever host was selected; model judgment is probabilistic; and approval is weak if it is not bound to the exact normalized destination and credential class.

## Proposed improvement
Authorize a normalized destination deterministically before attaching credentials. Use credential-specific host allowlists, explicit port/TLS policy, rejection of userinfo and raw IPs by default, redirect reauthorization, destination-bound approval, secret-safe audit logging, and independent verification.

## Architecture
The package separates research, policy, deterministic enforcement, operational rules, a reusable review skill, independent verification, a bounded remediation workflow, and a blocking pre-request hook.

## Package tree
```text
mcp-credential-destination-binding-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-request-destination-check.md
├── rules/
│   └── destination-boundary.md
├── scripts/
│   └── validate_destination.py
├── skills/
│   └── credential-destination-review.md
├── subagents/
│   └── security-verifier.md
└── workflows/
    └── secure-credentialed-request.md
```

## Installation
Requires Python 3.10+ for the validator; no third-party packages are required. Copy the package into an agent/tool repository or reference its files from the platform's security workflow.

## Configuration
Edit `config/policy.json` with credential classes and authorized hostname suffixes. Keep the default deny behavior. Review any decision to permit raw IPs, non-443 ports, or non-HTTPS transports separately.

## Usage
Create a request envelope such as:
```json
{"url":"https://b-123.mq.amazonaws.com","credential_class":"amazon-mq-basic","approval":{}}
```
Run:
```bash
python scripts/validate_destination.py request.json --policy config/policy.json
```
Exit codes: `0` allow, `2` invalid input/config, `4` approval required, `5` deny.

Integrate the same decision before the application attaches authorization material. Do not treat the standalone script as a network proxy; it is a deterministic policy reference and hook implementation.

## Workflow
Follow `workflows/secure-credentialed-request.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → Independent verification. Maximum two remediation cycles.

## Metrics
Track credential-bearing request-site coverage, unauthorized-destination block rate, legitimate-target pass rate, redirect revalidation coverage, approval-binding coverage, and secret leakage findings.

## Verification
Use fake credentials and adversarial destinations. Verify attacker domains, lookalike suffixes, userinfo, raw IPs, bad schemes, bad ports, and unsafe redirects are blocked. Confirm one legitimate target still succeeds. `subagents/security-verifier.md` must independently review high-risk changes.

## Safety
Never place production secrets in fixtures, logs, prompts, or approval records. Never weaken TLS or destination restrictions merely to restore functionality. Unknown policy states deny by default.

## Failure handling
Detection: validator/test failure or unauthorized request trace. Evidence: preserve sanitized request metadata and fixture. Retry: maximum 2 changed remediation attempts. Fallback: constrain or disable the affected dynamic-destination capability. Escalation: security owner. Stop: after retry budget exhaustion, ambiguous credential scope, or any real-secret exposure.

## Definition of Done
**Implemented:** deterministic destination authorization runs before credential attachment. **Measured:** baseline and after-change adversarial results are recorded. **Verified:** unauthorized paths are blocked, legitimate paths pass, redirects are safe, no secret exposure exists, and independent verification passes.

## Customization
Add credential-specific policies rather than broadening a shared global allowlist. Extend the validator only with deterministic rules whose behavior can be covered by fixtures.
