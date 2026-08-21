# Agent Secret Egress Boundary Guard

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem
AI agents frequently receive raw credentials through environment variables, config files, subprocess inheritance, or secret injection. Current incident reports show that instruction-only redaction, regex-only filtering, and tool-local controls can still allow credentials into model-visible output, stored transcripts, child processes, or cross-profile execution.

## Evidence
See `evidence/research.md` for current public evidence from OpenAI Codex, Kubernetes SIG agent-sandbox, and Hermes Agent.

## Existing approach
Prompt instructions, regex/prefix redaction, environment blocklists, Kubernetes Secret injection, and tool-specific scrubbing are widely used.

## Existing limitations
These controls are often reactive or fragmented. Once raw values reach the model or a broad subprocess environment, later redaction cannot reliably protect every log, cache, transcript, network call, and tenant boundary.

## Proposed improvement
Keep credentials opaque by default and enforce a deterministic egress boundary. Resolve a raw value only at the narrowest approved sink, bind resolution to tenant/profile plus capability, use explicit subprocess environment allowlists, and scan every untrusted egress/persistence payload against registered values.

## Architecture
- `skills/secret-egress-assessment.md` maps sources, sinks, and intended flows.
- `rules/secret-boundary-rules.md` defines fail-closed invariants.
- `subagents/security-verifier.md` performs independent verification.
- `workflows/egress-hardening.md` provides bounded remediation.
- `hooks/pre-egress-check.md` blocks deterministic leaks.
- `scripts/secret_egress_guard.py` detects/redacts exact registered values without printing them.
- `tests/test_secret_egress_guard.py` validates core behavior.
- `config/secret-policy.example.json` provides a safe policy skeleton.

## Actual package tree
```text
README.md
config/secret-policy.example.json
evidence/research.md
hooks/pre-egress-check.md
rules/secret-boundary-rules.md
scripts/secret_egress_guard.py
skills/secret-egress-assessment.md
subagents/security-verifier.md
tests/test_secret_egress_guard.py
workflows/egress-hardening.md
```

## Installation
Python 3.10+; no third-party dependencies. Integrate the pre-egress check in the host harness at provider, transcript/log, artifact, tool-result, and external network boundaries as applicable.

## Configuration
Copy `config/secret-policy.example.json` and adapt sink names. Secret values themselves MUST come from a runtime-only registry or vault adapter and MUST NOT be committed. Multi-user runtimes must provide active profile/tenant identity to the resolver.

## Usage
Run deterministic tests:
```bash
python -m unittest tests/test_secret_egress_guard.py
```

Scan a synthetic payload:
```bash
python scripts/secret_egress_guard.py scan --input pending-payload.txt --secrets-file runtime-secrets.json
```

A scan exits 3 when a registered value is present. The scanner reports only label, count, length, and a short SHA-256 fingerprint.

## Workflow
Observe → capture baseline with synthetic canaries → map source/sink flows → diagnose admission/resolution/egress cause → implement narrow boundary → measure again → independent verification → complete. Maximum two remediation iterations.

## Metrics
Unauthorized secret egress count, model-visible secret count, subprocess-secret count, cross-profile leak count, sink coverage, and intended authenticated-action success rate.

## Verification
Security verification must exercise all declared sinks with synthetic canaries, verify zero unauthorized raw-value egress, verify cross-profile isolation, and confirm intended authenticated actions still work through scoped resolution. The implementing agent is not the sole verifier.

## Implemented / Measured / Verified
**Implemented** means the guard and resolver boundaries are integrated. **Measured** means before/after canary results exist. **Verified** means independent tests show zero unauthorized registered-secret egress across covered sinks while required operations still succeed.

## Safety
Never place production secrets in fixtures, logs, README examples, or Git history. Never weaken sandboxing, identity, approvals, or scanning to pass a test. A real credential that crossed a boundary should be handled by the organization's authorized incident/rotation process.

## Failure handling
Detection is deterministic scanner output or a canary observed at an unauthorized sink. Preserve sanitized evidence. Retry at most twice only when addressing a newly identified cause. Block the affected flow and escalate if identity is ambiguous, a required sink cannot be inspected, or the same leak remains.

## Definition of Done
Current evidence documented; source/sink baseline captured; root cause identified; opaque/scoped resolution implemented where applicable; subprocess env is allowlisted; tests pass; before/after metrics show zero unauthorized canary egress in covered paths; cross-profile fixtures pass; independent verifier returns PASS; no raw production secrets are committed or logged.

## Customization
Replace the JSON secret registry with a production vault/taint adapter, add platform-specific provider/log sinks, and add provider-format heuristics as defense in depth. Exact-value or taint-aware enforcement should remain the primary deterministic guard for secrets known to the runtime.