# Skill — SSRF Threat Model and Hardening

## Purpose
Assess an MCP/network fetch tool and design deterministic egress controls before implementation changes.

## Trigger
A tool accepts a URL/host from a model, user, retrieved content, or another tool; a fetch server is deployed into a network with private resources; or a security review finds unrestricted outbound HTTP.

## Inputs
Tool implementation, deployment network map, cloud provider metadata behavior, redirect behavior, DNS resolver behavior, proxy configuration, current allow/deny rules, and representative legitimate destinations.

## Preconditions
Read-only access is enough for diagnosis. Production policy changes require explicit authorization.

## Required context
Identify who controls URL text, what credentials the runtime possesses, reachable internal services, whether redirects are followed, and whether DNS is resolved locally or by a proxy.

## Allowed tools
Source search, dependency inspection, safe DNS resolution, unit/integration tests, configuration inspection, and non-destructive network-policy review.

## Constraints
Do not probe sensitive metadata endpoints in production. Do not print credentials. Do not weaken TLS validation. Do not enable private-network access as a shortcut.

## Procedure
1. Map the data flow from prompt/retrieval content to URL argument to HTTP client.
2. Enumerate assets reachable from the runtime: metadata services, loopback admin endpoints, cluster services, private APIs, databases, proxies.
3. Establish baseline: which schemes, literal IPs, IPv6 addresses, hostnames, redirects, and DNS results are currently accepted.
4. Form attack hypotheses including direct private IP, hostname resolving private, mixed public/private DNS answers, redirect-to-private, userinfo confusion, and IPv6 link-local.
5. Compare against `rules/egress-policy.md` and `config/policy.json`.
6. Integrate `scripts/url_guard.py` before the initial request and each redirect.
7. Prefer a narrow domain allowlist for fixed integrations; otherwise keep internal ranges denied.
8. Add audit metadata at the policy decision boundary.
9. Run deterministic regression fixtures and a benign public-destination test.
10. Independently verify network-level egress controls when available.

## Decision points
- If legitimate destinations are fixed, use an allowlist.
- If arbitrary public web fetch is required, resolve and reject non-public ranges.
- If an internal destination is genuinely required, separate it into an explicit capability/policy instead of globally relaxing the public fetch tool.
- If DNS or policy state cannot be evaluated, fail closed and escalate.

## Expected output
Threat model, baseline behavior, proposed policy delta, test evidence, residual risks, and verification status.

## Metrics
Blocked sensitive fixtures, public-fetch success rate, policy coverage percentage, redirect-validation coverage, and unresolved security findings.

## Verification
A different reviewer confirms that all outbound paths invoke the guard and that adversarial fixtures cannot reach blocked classes.

## Failure handling
Capture the exact URL class, resolution result, policy reason, and code path. Retry only once for transient DNS-test infrastructure; do not retry deterministic policy failures.

## Stop conditions
Stop when all outbound paths are covered and tests pass, or immediately when a production change would require unauthorized network access or policy weakening.