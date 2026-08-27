# Skill: Outbound Request Threat Model

## Purpose
Determine whether an agent/MCP network request can cross an unauthorized destination boundary.

## Trigger
New fetch/API tool, URL-bearing tool input, pagination or redirect support, or credential-bearing network request.

## Inputs
Requested URL, redirect chain, DNS resolution, credential type/scope, network sandbox policy, and tool provenance.

## Preconditions
Known intended service domains and least-privilege identity.

## Required context
Observable request metadata only; no hidden chain-of-thought.

## Allowed tools
Read-only configuration inspection, DNS evidence supplied by the host, `url_boundary_guard.py`, and safe tests.

## Constraints
MUST NOT send validation probes to blocked/internal destinations. MUST NOT log credentials.

## Procedure
1. Record the origin of the URL value.
2. Parse scheme, host, and port.
3. Resolve the host through the platform resolver.
4. Classify every resolved address.
5. Check exact/subdomain policy and port.
6. Re-run checks on every redirect destination.
7. Bind credential attachment to a successful destination decision.
8. Verify with safe fixtures.

## Decision points
Block private, loopback, link-local, multicast, unspecified, unauthorized domains, ports, or schemes.

## Expected output
Facts, destination decision, credential scope, risks, verification status.

## Metrics
Blocked SSRF fixtures, redirect coverage, domain-policy coverage, false positives.

## Verification
Independent reviewer confirms credentials are attached only after an allow decision.

## Failure handling
Fail closed; one DNS retry; disable the network tool if destination remains ambiguous.

## Stop conditions
Any metadata/private destination, unreviewed internal exception, or credential leakage evidence.
