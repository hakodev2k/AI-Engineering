# Skill: Attest Effective Egress

## Purpose
Turn a declared containment policy and observed network telemetry into a deterministic PASS/FAIL attestation before an AI cybersecurity evaluation runs.

## Trigger
Before an evaluation, before any reduced-safeguard/high-risk phase, and after a network/proxy/credential/environment mutation.

## Inputs
- Policy JSON containing approved destination patterns and forbidden patterns.
- JSONL telemetry containing observed destination events.
- Evaluation/run identifier and policy version.

## Preconditions
Telemetry collection must cover the network paths relevant to the sandbox: direct connections and any configured proxy/cache boundary. Operators must know which destinations are intentionally permitted.

## Required context
Sandbox topology, proxy/package-cache endpoints, internal service ranges, evaluation phase, and whether outbound network access is expected at all.

## Allowed tools
Read-only configuration inspection, firewall/proxy/DNS/network telemetry, `scripts/attest_egress.py`, local test fixtures.

## Constraints
Do not initiate unapproved internet probes. Do not expose credentials. Fail closed on malformed policy, missing telemetry, or unknown destinations.

## Procedure
1. Record the policy version and evaluation ID.
2. Export observed destination events to JSONL. Each event contains at least `destination`; optional fields include `timestamp`, `source`, `transport`.
3. Run `python scripts/attest_egress.py --policy config/egress-policy.example.json --events <events.jsonl> --out <attestation.json>`.
4. Review counts for approved, forbidden and unknown destinations.
5. If forbidden/unknown > 0, stop the evaluation and preserve the artifact.
6. If all observations are approved, attach the attestation to the run metadata.
7. Re-attest after any invalidating change described in `rules/containment-policy.md`.

## Decision points
- Missing events: FAIL; absence of evidence is not evidence of containment.
- Unknown destination: FAIL until policy owner classifies it.
- Explicit forbidden match: FAIL and escalate.
- Approved-only telemetry: PASS for the observed window, not a universal proof of future isolation.

## Expected output
A versioned JSON attestation with status, event count, decision counts and offending destinations.

## Metrics
Unknown destination count; forbidden destination count; percentage of events classified; time from environment mutation to re-attestation; number of containment violations detected before evaluation execution.

## Verification
Run `python -m unittest tests/test_attest_egress.py`. Independently review the generated attestation and confirm the evaluation runner blocks on non-zero script exit.

## Failure handling
Capture the policy, sanitized telemetry and attestation. Retry once only after correcting telemetry completeness or an approved policy error. A real forbidden path is not retryable without remediation and re-attestation.

## Stop conditions
PASS only when all observed destinations are approved and required telemetry is present. Stop immediately on forbidden/unknown egress or missing evidence.
