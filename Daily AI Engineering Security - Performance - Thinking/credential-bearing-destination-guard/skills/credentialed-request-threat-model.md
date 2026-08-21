# Skill — Credentialed Request Threat Modeling

## Purpose
Identify where model-controlled data can influence destinations that receive credentials and turn those findings into enforceable controls.

## Trigger
New/changed agent tools that perform authenticated network I/O; security review after prompt-injection findings; addition of auto-approval; or credential scope changes.

## Inputs
Tool schema, HTTP/network code path, credential source/class, service-discovery mechanism, redirect policy, DNS behavior, egress policy, approval mechanism, and representative tool calls.

## Preconditions
The reviewer can inspect the tool-to-network data flow and must not use production secrets in testing.

## Required context
Original user intent, trusted service identifiers, expected endpoint families, credential privilege, and current network boundaries.

## Allowed tools
Repository search, static analysis, local tests with fake credentials, DNS/IP classification, HTTP mocks, dependency/advisory lookup.

## Constraints
Do not make destructive calls. Do not probe third-party hosts with real credentials. Treat all model/tool arguments as untrusted until validated.

## Procedure
1. Trace every credential from source to attachment point.
2. Trace every destination component from tool arguments to request construction.
3. Mark trust boundaries: user content → model → tool args → parser → DNS/service discovery → HTTP client → network.
4. Determine whether the destination is authoritative (derived from trusted service metadata) or free-form.
5. Enumerate attacks: attacker domain, loopback/private/link-local, alternate scheme/port, URL userinfo, redirect, DNS rebinding, hostname normalization, approval reuse.
6. Measure current coverage by running benign and adversarial fixtures.
7. Prefer eliminating the dangerous degree of freedom: replace free-form destination with resource ID/region when possible.
8. Otherwise define positive scheme/host/port rules, IP classification, redirect handling, action-bound approval, and egress controls.
9. Re-run fixtures and record Implemented / Measured / Verified separately.
10. Obtain independent security review before enabling auto-approval for credential-bearing operations.

## Decision points
- If authoritative service discovery exists, derive the destination and reject free-form alternatives.
- If a finite destination set exists, use an allowlist.
- If arbitrary internet access is required, credentials should normally be absent or scoped to the destination; escalate the design if they cannot be separated.
- If validation cannot eliminate DNS/redirect ambiguity, block credential attachment or move enforcement to a network proxy capable of destination pinning.

## Expected output
Threat map, vulnerable parameter list, proposed policy, adversarial fixtures, before/after results, residual risks, and required approvals.

## Metrics
Guard coverage, unauthorized-destination block rate, false-positive rate on valid fixtures, redirect block rate, percentage of destinations derived from trusted service metadata.

## Verification
An independent reviewer confirms that adversarial fixtures cannot cause credential-bearing traffic to unauthorized endpoints and that no test logs contain secrets.

## Failure handling
Capture sanitized evidence, block the affected tool path, rotate potentially exposed credentials, and escalate to the service owner/security team.

## Stop conditions
Stop after two failed remediation iterations or immediately if safe validation requires weakening credential scope, disabling TLS validation, or exposing real secrets. Escalate instead.
