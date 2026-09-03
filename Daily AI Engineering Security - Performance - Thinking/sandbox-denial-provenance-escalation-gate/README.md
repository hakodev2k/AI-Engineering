# Sandbox Denial Provenance Escalation Gate

**Category:** Security

## Problem
A sandbox can deny an operation correctly while the agent loses the denial's security meaning during tool-result normalization. The agent may then retry an equivalent action through MCP, SSH, a remote worker, browser automation, or another executor that does not inherit the original denial.

## Evidence
Current public evidence is documented in `evidence/research.md`. The key signals are OpenAI Codex issues #41320 (2026-08-28), where sandbox-denial provenance is dropped from model-facing results, and #32919 (2026-07-14), where an operation blocked locally succeeded through an MCP-backed remote executor without fresh approval.

## Existing approach and limitation
Per-tool sandboxes and approvals protect individual surfaces but do not guarantee that the denial decision survives into the planner or other adapters. Raw stderr and natural-language instructions are not durable authorization state.

## Proposed improvement
Represent every policy denial as a task-scoped operation-level security record, then block semantically equivalent or stronger operations on alternate trust zones unless a new explicit approval covers the target and destination zone.

## Architecture
- `evidence/research.md` — current evidence, approaches, gap, root causes, metrics.
- `config/policy.json` — trust-zone, side-effect, TTL, and fail-closed policy.
- `rules/security-boundary-rules.md` — enforceable invariants.
- `skills/denial-provenance-analysis.md` — evidence-driven diagnosis procedure.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/research-diagnose-verify.md` — bounded end-to-end workflow.
- `hooks/pre-execution-denial-check.md` — blocking deterministic hook contract.
- `scripts/denial_gate.py` — dependency-free reference gate.
- `tests/test_denial_gate.py` — operation-equivalence unit tests.

## Installation
Requires Python 3.9+ and no third-party packages. Copy the package directory into the agent/platform repository.

## Configuration
Edit `config/policy.json` so all real execution surfaces have explicit trust-zone ranks and all side-effect classes have explicit severity ranks. Unknown privileged zones intentionally fail conservatively.

## Usage
Create a task-scoped ledger such as:

```json
{"denials":[{"id":"d1","created_at":1788422400,"operation":{"action":"build","target":"repo","side_effect":"execute","trust_zone":"local_sandbox"}}]}
```

Create the proposed operation as JSON and run:

```bash
python scripts/denial_gate.py --policy config/policy.json --ledger ledger.json --operation operation.json
```

An explicit override must provide `approved:true`, the exact `trust_zone`, and `operation_target`.

## Workflow
Follow `workflows/research-diagnose-verify.md`: observe, baseline, diagnose provenance loss, implement the normalized envelope/gate, replay fixtures, then hand off to the independent Security Verifier.

## Metrics
Track provenance preservation, blocked cross-surface bypasses, unauthorized equivalent fallbacks, approval attribution coverage, and false positives.

## Verification
Run:

```bash
python -m unittest tests/test_denial_gate.py
```

Integration verification must additionally exercise the platform's real adapters so a local denial followed by MCP/remote fallback is blocked before side effects occur.

## Safety
The package never grants privileges. Missing or malformed provenance fails closed for privileged fallback. Do not log secret payloads. Dangerous or irreversible overrides require explicit human approval.

## Failure handling
Detection: gate non-zero exit, missing security metadata, or unexpected fallback execution. Evidence: preserve sanitized tool traces and policy decisions. Retry: one normalization retry and at most two implementation/verification cycles. Fallback: keep the capability denied. Escalation: human security owner. Stop: do not continue autonomous execution when authorization provenance is unavailable.

## Definition of Done
**Implemented:** normalized denial records and pre-execution gate are integrated across all relevant surfaces. **Measured:** before/after bypass and provenance metrics are captured. **Verified:** deterministic tests and independent cross-surface regression tests pass, no unauthorized equivalent operation executes, approval scope is preserved, and no security boundary is weakened.

## Customization
Extend operation fingerprints with resource identity, tenant/workspace, network destination, credential class, or production environment when those fields materially affect equivalence. Keep normalization deterministic and avoid embedding raw secrets.
