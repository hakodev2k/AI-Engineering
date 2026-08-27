# Agent Message Provenance Role Integrity Gate

**Category:** Security

## Problem
Agent harnesses can lose source metadata when advisor/tool/subagent/peer-session/framework-generated content is forwarded or normalized. If that content becomes trusted `role=user`, the model may mistake machine-generated text for user intent and privileged tool authorization can inherit the error.

## Evidence
See `evidence/research.md`. Current evidence includes Claude Code #88115 (2026-08-20), OpenClaw #73702, and Claude Agent SDK TypeScript #379.

## Existing approach
Prompt-injection scanners, delimiters, human approvals, role-separated APIs, and selective sender metadata.

## Existing limitations
Content scanners cannot prove authorship; wrappers can be stripped; approval UIs may hide origin; routing adapters can erase provenance.

## Proposed improvement
Make source provenance an explicit deterministic authorization input. Only authenticated direct-user sources may become trusted user-role messages; synthetic sources remain tagged and cannot independently authorize privileged actions.

## Architecture / Actual package tree
```text
README.md
evidence/research.md
config/policy.json
scripts/message_provenance_guard.py
tests/test_message_provenance_guard.py
skills/provenance-threat-analysis.md
rules/role-integrity.md
subagents/security-verifier.md
workflows/research-diagnose.md
workflows/regression-verification.md
hooks/pre-prompt-assembly.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` to enumerate authenticated user sources and privileged tools. Keep non-user sources fail-closed.

## Usage
`python scripts/message_provenance_guard.py --message message.json --policy config/policy.json`

## Workflow
Observe raw origin → measure metadata at each hop → diagnose first mutation → form bounded hypothesis → correct routing/envelope → measure again → independent verification.

## Metrics
Provenance coverage %, source/role mismatch count, synthetic-user attack-fixture block rate, privileged approval coverage, false-positive rate.

## Verification
Run `python -m unittest tests/test_message_provenance_guard.py`. The independent Security Verifier must reproduce the result.

## Safety
No payload execution. No secrets in logs. Missing provenance blocks. Dangerous/irreversible actions require explicit human approval.

## Failure handling
**Detection:** non-zero guard result or failed regression. **Evidence:** message ID, source metadata, reason codes. **Retry:** max 2 diagnosis iterations and 1 regression correction. **Fallback:** disable/downgrade affected route to untrusted data. **Escalation:** human security owner. **Stop:** unknown origin, secret exposure, irreversible-action risk, or exhausted retries.

## Definition of Done
**Implemented:** guard, hook, routing envelope, and policy integrated.  
**Measured:** before/after provenance and block metrics captured.  
**Verified:** all tests pass, synthetic sources cannot become trusted user intent, privileged boundaries remain intact, no secrets exposed.

## Customization
Add source types and privileged tools explicitly. Do not infer trusted origin from message wording and do not weaken provenance requirements for convenience.
