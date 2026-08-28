# Skill: DNS Rebinding Threat Analysis

## Purpose
Assess whether an MCP HTTP/SSE deployment can be reached or driven by an untrusted browser origin despite being intended as local/private.

## Trigger
New MCP HTTP transport, SDK upgrade, reverse-proxy change, bind-address change, authentication change, or DNS-rebinding advisory.

## Inputs
Bind address, transport, `Host`/`Origin` policy, authentication mode, exposed tools, proxy behavior, SDK/server version.

## Preconditions
Inventory consequential tools and determine whether the endpoint is expected to accept browser-originated requests.

## Required context
Runtime configuration, relevant source/config files, public advisories, and ingress logs without secrets.

## Allowed tools
Read-only configuration inspection, dependency/version lookup, unit tests, `scripts/ingress_guard.py`.

## Constraints
MUST NOT send real credentials to test endpoints. MUST NOT invoke destructive tools during validation. MUST fail closed on ambiguous public binding for consequential tools.

## Procedure
1. Record actual bind address and transport.
2. Record SDK/server version and compare with current advisories.
3. Trace where `Host` and `Origin` are validated: proxy, framework, SDK, or application.
4. Identify any wildcard origin/host policy and whether headers are rewritten upstream.
5. Classify exposed tools by consequence and credential reach.
6. Run the deterministic guard on benign, hostile-host, hostile-origin, missing-origin and unauthenticated consequential-tool fixtures.
7. Form a single root-cause hypothesis for each failure and change only one control at a time.
8. Re-run fixtures and obtain independent review.

## Decision points
Block release on public bind without explicit authorization, wildcard origin, hostile host acceptance, hostile origin acceptance, or unauthenticated consequential-tool access.

## Expected output
Facts, observed evidence, interpretation, policy violations, remediation decision, verification status.

## Metrics
Host-block coverage, origin-block coverage, consequential-tool auth coverage, vulnerable-version count, regression-test pass rate.

## Verification
An independent reviewer reproduces the hostile fixtures and confirms no credential-bearing request is sent.

## Failure handling
Maximum 2 remediation attempts. Fallback: disable HTTP transport or consequential tools and use stdio/loopback until corrected.

## Stop conditions
Stop immediately on demonstrated privileged tool invocation from an untrusted origin or any secret exposure.
