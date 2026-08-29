# Skill: MCP Transport Threat Model

## Purpose
Turn an MCP connection feature into an explicit trust-boundary model before implementation or remediation.

## Trigger
Use when an application can create, select, modify, or connect to MCP servers through stdio, SSE, HTTP, streamable HTTP, or an equivalent transport.

## Inputs
MCP endpoint/API routes; transport schema; authentication model; named server configuration; process-launch code; outbound HTTP behavior; runtime network policy; credential/header forwarding rules.

## Preconditions
The reviewer can inspect configuration and code paths without destructive or external-network probes.

## Required context
Caller identity, server process identity, network namespace, available secrets, and ownership of connection definitions.

## Allowed tools
Repository search, static analysis, local tests, dependency/advisory lookup, packet/log inspection in an authorized test environment.

## Constraints
- MUST NOT test third-party or production targets without authorization.
- MUST NOT weaken network/authentication controls for convenience.
- MUST separate a client's right to select an approved server from the right to define a privileged transport.

## Procedure
1. Enumerate every MCP management entry point.
2. Label each input origin: developer config, admin config, authenticated user, anonymous user, server response, environment.
3. Trace inputs to effects: executable, arguments, environment, URL, DNS, redirects, headers, session creation, filesystem/network access.
4. Mark every lower-trust-to-higher-privilege transition.
5. Record controls at that exact boundary; unrelated authentication does not count as input validation.
6. Form abuse hypotheses: argument injection, shell interpretation, URL/redirect SSRF, private IP literal, DNS rebinding, credential forwarding, unlimited spawning.
7. Establish safe local baseline tests.
8. Prefer removing caller control over the privileged primitive over trying to sanitize arbitrary commands.
9. Hand implementation to another role and require independent verification.

## Decision points
If clients provide arbitrary stdio commands, move definitions to trusted configuration. If user-defined remote servers are unnecessary, disable them. If required, demand explicit grants plus runtime egress defense-in-depth. If remote management lacks authentication, block release.

## Expected output
A table of trust boundaries, privileged effects, attack hypotheses, existing controls, residual gaps, and prioritized remediation.

## Metrics
Client-controlled privileged fields; unguarded boundaries; percentage of connections using named servers; security-test coverage by transport.

## Verification
Every privileged effect has at least one deterministic negative test and one approved positive test.

## Failure handling
Unknown ownership/effective runtime behavior is blocking; do not assume safety.

## Stop conditions
Stop when transport-defining inputs are trusted or explicitly constrained, the negative matrix passes, and an independent reviewer confirms the model.
