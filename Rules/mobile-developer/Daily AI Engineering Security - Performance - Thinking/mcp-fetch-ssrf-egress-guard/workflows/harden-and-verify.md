# Workflow — Harden and Verify MCP Fetch Egress

## Trigger
Unrestricted or insufficiently validated MCP outbound URL capability.

## Goal
Introduce deterministic SSRF controls with measurable adversarial and benign verification.

## Inputs
Current fetch implementation, policy requirements, deployment network assumptions, legitimate destination examples, and `evidence/research.md`.

## Baseline
Record whether the current implementation accepts: loopback, RFC1918, link-local metadata, IPv6 local addresses, literal IPs, arbitrary schemes, DNS names resolving private addresses, and redirects to blocked networks.

## Context
The model/prompt is not a trusted network-policy principal. URL validation is an authorization boundary.

## Stages
1. **Observe** — map URL sources and outbound HTTP clients.
2. **Measure baseline** — execute safe local/unit fixtures that demonstrate current accept/reject behavior; never contact real metadata services.
3. **Diagnose** — classify missing checks: parsing, scheme, DNS, IP class, redirect, allowlist, audit.
4. **Hypothesize** — define the minimum policy delta that blocks each demonstrated path.
5. **Implement** — integrate `scripts/url_guard.py` logic or equivalent native implementation before initial fetch and every redirect.
6. **Measure again** — run the same fixture set plus benign destinations.
7. **Independent verification** — hand off to `subagents/security-verifier.md`.
8. **Finalize** — record residual risks and deployment defense-in-depth requirements.

## Responsible agent
Implementation agent owns stages 1–6. Egress Security Verifier owns stage 7.

## Tools
Source inspection, unit tests, deterministic DNS stubs/fixtures, configuration validation, and safe local test servers.

## Outputs
Baseline matrix, hardened implementation, test evidence, policy configuration, verification status, and residual-risk note.

## Checkpoints
- C1: all outbound call sites identified.
- C2: baseline evidence captured before changes.
- C3: no redirect path bypasses validation.
- C4: adversarial fixtures blocked and benign fixtures allowed.
- C5: independent verifier returns `verified`.

## Metrics
Guard coverage, blocked-fixture pass rate, benign-fixture pass rate, redirect coverage, unresolved high-severity findings.

## Retry policy
Maximum two implementation/verification correction cycles. A retry requires a new failure hypothesis tied to evidence.

## Stop conditions
Stop successfully only when C1–C5 pass. Stop unsuccessfully after two failed correction cycles, any required unauthorized production probe, or any proposal to broadly allow internal networks to make tests pass.

## Failure path
Capture failing fixture, resolved address, policy decision, call path, and verifier finding. Escalate to a human security owner if legitimate requirements conflict with default-deny internal egress.

## Verification
The verifier must not be the sole implementing agent and must confirm both code-path coverage and deterministic fixture outcomes.

## Definition of Done
Implemented: guard integrated. Measured: before/after fixture results captured. Verified: independent review passes with no blocking bypass.