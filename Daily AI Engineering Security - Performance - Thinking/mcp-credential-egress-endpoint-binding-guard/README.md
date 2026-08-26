# MCP Credential Egress Endpoint Binding Guard

**Category:** Security

## Problem
AI/MCP tools can combine sensitive credentials with model-controlled destinations. Prompt injection can therefore redirect otherwise legitimate network/tool actions to attacker-controlled hosts, repositories, recipients, paths or endpoints.

## Evidence
See `evidence/research.md` for the August 3, 2026 AWS CVE-2026-18655 bulletin and independent Microsoft/OWASP agent-security guidance.

## Existing approach
Patching vulnerable servers, human approvals, tool allowlists, prompt-injection detection, network egress filtering and short-lived credentials all reduce risk.

## Existing limitations
Tool approval does not validate dangerous argument combinations; humans can miss plausible malicious hostnames; heuristic injection scanners miss attacks; generic network policies may not bind a specific credential class to a specific destination.

## Proposed improvement
Enforce a deterministic credential-to-tool-to-destination contract before request construction. Validate scheme, port, hostname pattern, IP literals and URL userinfo; fail closed before any credential is materialized into the outbound request.

## Architecture
```text
mcp-credential-egress-endpoint-binding-guard/
├── README.md
├── config/egress-policy.json
├── evidence/research.md
├── hooks/pre-credential-tool-call.md
├── rules/credential-egress-boundary.md
├── scripts/endpoint_binding_guard.py
├── skills/credential-egress-analysis.md
├── subagents/security-verifier.md
├── tests/test_endpoint_binding_guard.py
└── workflows/diagnose-bind-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/egress-policy.json` using provider-owned endpoint requirements. Bind every credential class to the minimum necessary tools and host patterns. Do not store credentials in this file.

## Usage
Create an event containing only non-secret metadata:
```json
{"tool":"rabbitmq_broker_initialize_connection","credential_class":"amazon-mq-rabbitmq","destination":"https://b-123.mq.us-east-1.on.aws"}
```
Run `python scripts/endpoint_binding_guard.py --event event.json --policy config/egress-policy.json`. Only exit 0 is eligible to proceed.

## Workflow
Use `workflows/diagnose-bind-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Bind → Measure again → Independent verification → Enable.

## Metrics
- Unauthorized-destination attack-fixture block rate: target 100%.
- Approved-destination regression rate: target 0%.
- Secret exposure in logs/tests: target 0.
- Unreviewed policy exceptions: target 0.
- Credential classes with explicit bindings: target 100%.

## Verification
Run `python -m unittest tests/test_endpoint_binding_guard.py`. Independently verify that provider endpoint patterns are correct and that blocks occur before outbound request construction.

## Safety
Never include secret values in guard events, tests, logs or model context. Do not downgrade TLS or expand host patterns to make a failing workflow pass. Human approval is required for exceptions and must not silently alter persistent policy.

## Failure handling
**Detection:** non-zero guard exit, unauthorized host/tool/scheme/port, parser ambiguity.  
**Evidence:** redacted event metadata, policy version, reason codes, test results.  
**Retry policy:** maximum 2 policy/implementation revisions.  
**Fallback:** disable affected tool or remove the credential from agent scope.  
**Escalation:** human security owner for exceptions or unclear provider endpoints.  
**Stop condition:** any secret exposure, unresolved parser bypass, policy ambiguity, or exhausted retries.

## Definition of Done
**Implemented:** pre-tool binding guard is enforced before credential materialization.  
**Measured:** benign and adversarial fixtures have baseline/post-change results.  
**Verified:** security tests pass, independent reviewer confirms endpoint constraints, attack path is blocked, permission boundaries are preserved, and no secrets are exposed.

## Customization
Add credential bindings for other providers and tools. Keep patterns narrow, provider-derived and version-controlled; prefer exact hostnames or anchored regexes over broad suffix matching.
