# Investigate DNS Failure

## Purpose
Determine whether a dependency outage originates in naming, routing, TLS, application health, or client behavior without speculative production changes.

## Inputs
Dependency hostname(s), failing request evidence, environment, expected endpoint, repository configuration, and recent deployment/config changes.

## Preconditions
Read access to repository/configuration and permission to perform non-destructive DNS lookups from the relevant environment.

## Allowed tools
Repository search, DNS lookup, `scripts/dns_gate.py`, non-mutating HTTP/TLS diagnostics, logs with secrets redacted.

## Process
1. Locate the hostname source and all environment overrides.
2. Confirm the expected hostname from authoritative project configuration; do not infer it from an error alone.
3. Run the deterministic gate and preserve `dns-evidence.json`.
4. Compare resolved addresses with policy and expected network boundary.
5. Check whether failure is NXDOMAIN/timeout, address reachability, TLS hostname/certificate, or application response.
6. Inspect client lifetime, DNS caching, proxy, container, and resolver configuration only where evidence points.
7. Form one hypothesis per observed failure and identify a falsifying check.
8. Test hypotheses non-destructively.
9. Recommend the smallest correction. Stop before protected infrastructure/config changes.
10. Hand evidence to independent verification.

## Expected output
Facts, hypotheses, evidence paths, affected component, confidence, recommended action, approval requirement, and unresolved risk.

## Verification
A diagnosis is confirmed only when evidence distinguishes DNS from downstream layers and reproduces or falsifies the proposed cause.

## Failure handling
Retry lookup failures no more than policy permits. Preserve raw error category and escalate permission/environment failures without widening privileges.

## Stop conditions
Stop on missing authoritative hostname, unsafe target, exhausted retries, required production mutation, or contradictory evidence.
