# Skill: MCP URL Threat Model

## Purpose
Find every path where untrusted input can influence an MCP network destination or credentials.

## Trigger
New MCP transport, OpenAI-compatible tool support, SSRF advisory, proxy change, or security review.

## Inputs
Route handlers, MCP transport code, URL utilities, redirect policy, DNS behavior, proxy configuration, credential sources.

## Preconditions
Repository revision is fixed and network architecture is known.

## Required context
Trust boundaries, caller identity, runtime network reachability, cloud metadata endpoints, supported URL schemes.

## Allowed tools
Code search, dependency inspection, unit tests, local static analysis, non-production test endpoints.

## Constraints
MUST NOT probe real internal systems without approval. MUST NOT print credentials.

## Procedure
1. Enumerate all caller-controlled URL fields.
2. Trace each field to connection creation.
3. Record canonicalization, DNS, redirect and proxy stages.
4. Identify where authorization occurs relative to each stage.
5. Check whether headers/tokens follow caller-selected routing.
6. Test loopback, private IPv4, link-local, IPv6 loopback, metadata IP and redirect-to-private cases.
7. Produce an evidence table with path, trust source, validation, residual risk and owner.

## Decision points
If any destination cannot be proven public/approved, classify as blocking. If credentials can reach an unapproved host, classify as credential-exfiltration risk.

## Expected output
Complete egress-path inventory and prioritized remediation map.

## Metrics
Coverage of URL-bearing code paths; number of unguarded sinks; attack-case pass rate.

## Verification
Independent verifier reproduces at least one negative and one positive case per transport.

## Failure handling
Retry source tracing once after expanding search terms. If ownership is unclear, escalate rather than assume safety.

## Stop conditions
All URL sinks are mapped and each has an explicit security decision.