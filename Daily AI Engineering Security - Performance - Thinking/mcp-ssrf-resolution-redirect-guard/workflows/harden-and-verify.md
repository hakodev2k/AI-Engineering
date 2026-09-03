# Workflow: Harden and Verify MCP URL Fetching

## Trigger
A URL-taking MCP/fetch/browser capability is added, upgraded, exposed remotely, or found to have incomplete SSRF controls.

## Goal
Move from observed SSRF exposure to a measured, independently verified destination boundary.

## Inputs
Current implementation, policy, representative safe URLs, adversarial destination fixtures, redirect behavior, and outbound-header behavior.

## Baseline
Record which unsafe fixtures currently reach the request layer, whether redirects are revalidated, and whether sensitive headers cross origins.

## Context
Treat model-generated tool arguments and retrieved-content-derived URLs as untrusted.

## Stages
1. **Observe** — Security engineer identifies all URL-taking entry points and outbound HTTP clients.
2. **Measure baseline** — Test literal loopback, private/link-local, IPv4-mapped IPv6, mixed resolution, and redirect-to-private fixtures.
3. **Diagnose** — Identify where canonicalization, resolution, redirect, or header checks are missing.
4. **Form hypothesis** — State the exact control expected to block each observed path.
5. **Implement** — Add validation at the closest pre-connect boundary and redirect callback; preserve normal public behavior.
6. **Measure again** — Re-run all baseline fixtures and normal retrieval tests.
7. **Re-evaluate if not improved** — Maximum 2 implementation retries. Each retry must change the hypothesis or evidence; repeating the same patch is not a valid retry.
8. **Independent verify** — `subagents/security-verifier.md` reviews attack paths and evidence.
9. **Complete** — Release only when blocking criteria pass.

## Responsible agent
Implementation engineer for stages 1-7; independent Security Verifier for stage 8.

## Tools
URL/IP parsers, HTTP-client redirect hooks, deterministic DNS fixtures, `scripts/url_guard.py`, unit/integration tests, and non-secret egress telemetry.

## Outputs
Baseline record, implementation evidence, before/after comparison, test report, residual-risk record, and independent verification status.

## Checkpoints
- Entry-point inventory complete.
- Baseline captured before code changes.
- Validation occurs after canonicalization/resolution.
- Redirect revalidation demonstrated.
- Header policy demonstrated.
- Independent verification complete.

## Metrics
Unsafe fixture rejection rate, safe fixture regression rate, redirect validation coverage, cross-origin credential leaks, and unvalidated outbound attempts.

## Retry policy
Maximum 2 implementation retries after the first attempt.

## Stop conditions
Stop and escalate if the HTTP stack cannot expose or pin effective destinations, if a required private-network exception is broader than a specific allowlist, or if tests cannot distinguish safe from unsafe destinations deterministically.

## Failure path
Disable or isolate the affected URL-fetch feature, preserve evidence, and require human security review. Do not compensate by increasing trust in model output.

## Verification
All security tests pass and the independent verifier marks the boundary `verified`.

## Definition of Done
Evidence documented; baseline captured; all known attack fixtures blocked; safe fixtures pass; redirect/header policy verified; risks documented; no secrets exposed; independent verification complete; no blocking issue remains.
