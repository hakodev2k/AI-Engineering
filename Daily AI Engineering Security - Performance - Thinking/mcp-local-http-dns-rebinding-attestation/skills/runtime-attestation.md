# Skill: MCP Local HTTP Runtime Attestation

## Purpose
Verify the effective runtime security boundary of a local MCP HTTP endpoint rather than trusting dependency versions or configuration files alone.

## Trigger
Run on server startup, transport/SDK upgrade, reverse-proxy change, bind-address change, authentication change, or addition of sensitive tools.

## Inputs
- Endpoint URL.
- Expected bind scope.
- Allowed Host values.
- Allowed Origin values.
- Authentication requirement and safe probe credential when available.
- Exposed tool capability classification.
- `config/policy.json`.

## Preconditions
- Probes MUST target only an endpoint the operator owns or is authorized to test.
- Probe requests MUST use read-only MCP methods such as initialization or `tools/list`; the skill MUST NOT invoke state-changing tools.
- A safe test environment SHOULD be used when validating production-equivalent policy.

## Required context
Current listener topology, proxy chain, MCP transport, authentication mode, and the effective tool surface.

## Allowed tools
HTTP client, socket/listener inspection, dependency metadata reader, JSON parser, and `scripts/attest_mcp_http.py`.

## Constraints
- MUST NOT send secrets to foreign origins.
- MUST NOT disable authentication to make a probe pass.
- MUST distinguish network reachability from authorization.
- MUST treat wildcard bind plus missing Host/Origin validation as blocking unless an explicit public-server policy with authentication and upstream validation is documented.

## Procedure
1. Capture baseline endpoint, bind scope, proxy path, auth state, and capability classification.
2. Probe a normal expected Host/Origin combination and record the status.
3. Probe each configured foreign Host with the same safe request.
4. Probe each configured foreign Origin.
5. Probe unauthenticated access when policy requires authentication.
6. Compare observed behavior with policy; do not infer rejection from connection errors without classifying where the error occurred.
7. If an unsafe probe succeeds, capture only non-secret response metadata, block completion, and hand off to remediation.
8. After remediation, rerun the identical probe matrix.

## Decision points
- Foreign Host accepted: `block`.
- Foreign Origin accepted: `block`.
- Required authentication bypassed: `block`.
- Listener topology cannot be confirmed: `manual-review`.
- All negative probes rejected and positive control succeeds: `pass`.

## Expected output
A JSON attestation report containing endpoint, positive-control result, each negative probe, auth result, capability risk, decision, and evidence timestamp.

## Metrics
Foreign-host rejection rate, foreign-origin rejection rate, unauthenticated rejection rate, wildcard-bind violations, and time-to-remediation.

## Verification
Independent reviewer or CI job reruns the same probe fixture. A pass requires deterministic rejection of all prohibited requests and success of the positive control.

## Failure handling
Network ambiguity, TLS interception, or proxy rewriting MUST produce `manual-review`, not a guessed pass. Retry transient transport failures at most twice.

## Stop conditions
Stop immediately on evidence that a foreign Host/Origin can invoke an MCP request or that required authentication is bypassed. Do not continue exploring tool capabilities after a blocking exposure is proven.
