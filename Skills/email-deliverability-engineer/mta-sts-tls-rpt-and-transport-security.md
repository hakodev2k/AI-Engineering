# MTA-STS, TLS-RPT, and Transport Security

## Purpose
Strengthen SMTP transport security for receiving domains controlled by the organization and make TLS delivery failures observable.

## When to use
Use when protecting inbound SMTP transport, investigating downgrade/certificate problems, or establishing domain-level mail transport policy. This is distinct from message authentication.

## Inputs
MX hosts, TLS certificates, DNS/HTTPS control, current MTA-STS and TLS-RPT records, receiving-provider behavior, and report-processing capability.

## Preconditions
All production MX endpoints must support valid TLS before enforcing MTA-STS.

## Context to inspect
Inspect MX DNS, STARTTLS support, certificate names/chains/expiry, policy HTTPS endpoint, policy ID, mode, max age, TLS-RPT destination, and failure reports.

## Core knowledge
MTA-STS lets supporting senders require trusted TLS to listed MX hosts after policy discovery. TLS-RPT supplies aggregate failure telemetry. Enforcement mistakes can make legitimate inbound mail undeliverable.

## Procedure
1. Inventory all authoritative MX hosts and failover paths.
2. Validate STARTTLS and trusted certificates for each host.
3. Publish TLS-RPT first and observe failures.
4. Serve a syntactically valid MTA-STS policy over reliable HTTPS.
5. Begin in testing mode.
6. Correlate reports with legitimate sending sources and MX behavior.
7. Fix certificate, hostname, or routing inconsistencies.
8. Move to enforce mode only after stable observation.
9. Use conservative max-age during early rollout, then increase when mature.
10. Monitor reports and certificate lifecycle continuously.

## Decision points
Use enforcement when operational control over all MX endpoints is strong. Keep testing mode while third-party MX behavior is uncertain. Coordinate MX migrations with policy changes and cache duration.

## Common failure patterns
Enforcing before every MX is ready, stale MX names in policy, expired certificates, policy-host outages, raising max-age too early, and confusing TLS-RPT with outbound delivery telemetry.

## Verification
Fetch the policy externally, validate DNS records, negotiate TLS against every MX, inspect reports, and execute controlled inbound delivery through primary and backup MX paths.

## Expected output
A tested transport-security configuration with report monitoring and change procedures.

## Stop conditions
Stop enforcement if any legitimate MX cannot provide compliant TLS or the policy endpoint cannot meet required availability.