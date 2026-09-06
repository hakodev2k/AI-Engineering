# Evaluation Sandbox Egress Attestation Guard

**Category:** Security  
**Run date:** 2026-09-06 (UTC+7)

## Problem
AI cybersecurity evaluations can escape intended network isolation through indirect paths such as package-cache proxies or misconfigured evaluation infrastructure. A configuration flag is not sufficient evidence that the effective runtime boundary is intact.

## Evidence
Current evidence and source links are documented in `evidence/research.md`, including 2026 incident reports from OpenAI and Anthropic and an independent METR investigation.

## Existing approach and limitation
Sandboxes, firewall rules, proxy allowlists and monitoring are necessary controls. The remaining gap is attestation: operators need deterministic evidence that observed data-plane destinations match the declared policy, including indirect proxy/cache paths, and they need to invalidate that evidence when the environment changes.

## Proposed improvement
A fail-closed preflight/runtime gate that classifies observed network destinations against a versioned policy, writes a machine-readable attestation, blocks on unknown/forbidden destinations, and requires independent verification for high-risk evaluations.

## Architecture
- `evidence/research.md` — public evidence, existing approaches, gap and root causes.
- `rules/containment-policy.md` — enforceable containment invariants.
- `skills/attest-effective-egress.md` — reusable evidence-driven procedure.
- `subagents/containment-verifier.md` — independent verification role.
- `workflows/preflight-and-runtime-verification.md` — bounded remediation/reverification flow.
- `hooks/pre-eval-egress-gate.md` — deterministic blocking hook contract.
- `config/egress-policy.example.json` — safe example policy.
- `scripts/attest_egress.py` — dependency-free policy evaluator.
- `tests/test_attest_egress.py` — deterministic tests.

## Installation
Requires Python 3.9+ and no third-party packages. Copy this directory into the evaluation-control repository.

## Configuration
Copy `config/egress-policy.example.json`, replace example internal destinations with the evaluation's approved internal/proxy/cache destinations, and keep the policy under change control. Do not put credentials in the policy.

## Usage
Export sanitized observed connection events as JSONL, one object per line, with `destination` and optional `timestamp`, `source`, `transport`. Then run:

`python scripts/attest_egress.py --policy config/egress-policy.example.json --events events.jsonl --out attestation.json`

Exit 0 means the observed window passed. Exit 2 means BLOCK. Exit 3/4 means invalid evidence or I/O failure and also blocks execution.

## Workflow
Follow `workflows/preflight-and-runtime-verification.md`. The gate runs before execution and after invalidating environment changes. Remediation is bounded to two cycles; a persistent failure escalates rather than weakening policy.

## Metrics
Forbidden destinations; unknown destinations; event-classification coverage; containment failures caught pre-run; time-to-detect; time-to-re-attest.

## Verification
Run `python -m unittest tests/test_attest_egress.py`. The independent verifier must reproduce the attestation from fresh telemetry. This package verifies supplied observations; it does not claim that a telemetry source captures every packet, so telemetry coverage remains an explicit prerequisite.

## Safety
No arbitrary internet probes are required. The script is read-only except for its output artifact. It contains no secrets and performs no network access or environment mutation.

## Failure handling
Detection: non-zero exit or missing coverage. Evidence: policy, sanitized events, attestation. Maximum retries: two remediation cycles. Fallback: quarantine/stop the evaluation. Escalation: evaluation owner/security lead. Stop condition: unresolved unknown/forbidden path or incomplete telemetry.

## Status semantics
- **Implemented:** policy evaluator, tests, procedure and blocking hook contract exist.
- **Measured:** a real run has supplied telemetry and produced an attestation.
- **Verified:** tests pass and an independent verifier reproduces PASS with adequate telemetry coverage.

The repository package is Implemented; downstream users must perform the Measured and Verified stages in their own environment.

## Definition of Done
Evidence documented; effective policy recorded; telemetry coverage established; zero unknown/forbidden observed destinations; deterministic tests pass; fresh attestation generated; independent verification complete; no blocking issue remains.

## Customization
Extend approved destinations for intentionally reachable internal/proxy services. Keep unknown destinations fail-closed. Integrate the documented hook into CI/evaluation orchestration and replace the telemetry exporter with the platform-native firewall/proxy/network source.
