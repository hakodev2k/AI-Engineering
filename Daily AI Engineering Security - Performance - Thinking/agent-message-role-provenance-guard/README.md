# Agent Message Role Provenance Guard

**Category:** Security

## Problem
Tool, advisor, model, memory, and subagent output can be relayed into a parent agent context with role or control formatting that implies more authority than the source actually has. Current reports include generated text appearing as `USER` messages and subagent results carrying system-shaped instruction payloads.

## Evidence
See `evidence/research.md` for current public evidence and explicit separation of observed reports, interpretation, and the proposed engineering control.

## Existing approach and limitation
Prompt-injection classifiers, permission prompts, delimiters, role-separated APIs, and sandboxing help, but none guarantees that a host preserves source provenance when it serializes or relays messages.

## Proposed improvement
Treat `role` as an authorization property. Preserve stable origin/source metadata through every relay and transformation. Only authenticated human input may become `user`; only runtime-owned control data may become `system`; derived/tool/subagent/model output stays untrusted and cannot impersonate protected control markup.

## Architecture
```text
agent-message-role-provenance-guard/
├── README.md
├── evidence/research.md
├── rules/message-role-provenance-rules.md
├── skills/provenance-boundary-review.md
├── workflows/observe-map-test-enforce-verify.md
├── scripts/validate_message_provenance.py
└── tests/test_validate_message_provenance.py
```

## Installation
Requires Python 3.9+ with no third-party dependencies. Integrate the validator immediately before model-context assembly or translate the same source→role contract into the host language.

## Configuration
Emit JSONL messages containing `id`, `role`, `source_type`, `origin_id`, `trusted`, and `content`. Default privileged mappings are `user_input → user` and `trusted_system → system`. Sources such as `tool_result`, `subagent_result`, `advisor_result`, `model_output`, `memory`, and `retrieved_content` are treated as untrusted derived channels.

## Usage
```bash
python scripts/validate_message_provenance.py messages.jsonl
```
Exit code 0 means the supplied trace satisfies the validator; 2 means a security-policy violation; 3 means malformed/unverifiable input.

## Workflow
Follow `workflows/observe-map-test-enforce-verify.md`: capture a baseline → map sources/roles → diagnose provenance loss → fix one relay boundary → run adversarial and normal fixtures → independent verification. Remediation retries are bounded to 3.

## Metrics
Privileged-role provenance coverage; violations/session; unknown-source percentage; protected-markup impersonation attempts blocked; false-positive rate; sensitive actions whose justification depends on untrusted instructions.

## Verification
Run:
```bash
python -m unittest tests/test_validate_message_provenance.py
```
**Implemented** means provenance fields and deterministic source-role mapping exist. **Measured** means baseline and adversarial traces exist. **Verified** requires 100% provenance coverage for privileged roles, all attack fixtures blocked, legitimate tool/subagent output preserved without privilege promotion, authorization controls unchanged, and independent review complete.

## Safety
The validator is read-only and never executes message content. Synthetic fixtures do not use real credentials. Provenance enforcement is additive: it MUST NOT weaken sandboxing, tool permissions, least privilege, secret handling, or human approval.

## Failure handling
On a privileged-role violation, quarantine the offending message/relay, retain message and origin IDs as evidence, and stop sensitive downstream actions. Do not fix the issue by merely suppressing warning text or trusting a model refusal. If three distinct remediation attempts fail, escalate and keep the unsafe relay disabled.

## Definition of Done
Current evidence documented; trust boundaries/source-role matrix identified; root cause recorded; deterministic enforcement implemented; adversarial fixtures blocked; normal flows pass; no secret exposure; authorization boundaries preserved; independent verification complete; no blocking violation remains.

## Customization
Extend `source_type` values for product-specific channels, but keep the invariant that content strings cannot self-assign authority. For transformed summaries, preserve the original `origin_id` and record the transformer as a new source hop in host telemetry.
