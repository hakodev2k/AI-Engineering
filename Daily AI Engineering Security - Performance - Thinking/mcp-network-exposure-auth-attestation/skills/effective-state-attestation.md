# Skill: Effective MCP Exposure Attestation

## Purpose
Verify the runtime exposure of an MCP service from observed listener/auth/capability state rather than intended configuration.

## Trigger
Before deployment; after network, auth, proxy, container, MCP, or tool-set changes; after restart when effective state can drift.

## Inputs
Observed listeners, bind addresses, ports, TLS state, auth mode and enforcement, enabled capabilities, outbound connectivity, secret access.

## Preconditions
Observation data MUST come from runtime/process/container/proxy inspection, not only the source configuration.

## Required context
Deployment topology, intended trust zone, approved authentication modes, high-risk capability inventory.

## Allowed tools
Read-only socket/process inspection, configuration reads, container metadata, reverse-proxy route inspection, `scripts/exposure_attestor.py`.

## Constraints
MUST NOT disable authentication or TLS to make verification pass. MUST NOT expose credentials during evidence capture.

## Procedure
1. Capture effective listeners and authenticated routes.
2. Inventory enabled MCP capabilities.
3. Record whether credentials/secrets are reachable by the process and whether outbound networking exists.
4. Run the attestor against `config/policy.json`.
5. For every block reason, identify the exact listener/capability combination.
6. Change deployment controls, not the evidence, then re-measure.
7. Require independent review for any public or wildcard listener with high-risk capabilities.

## Decision points
Fail closed on incomplete listener evidence, non-loopback plaintext, ineffective auth, or forbidden high-risk capability combinations.

## Expected output
Machine-readable allow/block result plus runtime evidence sufficient for independent reproduction.

## Metrics
Public listener count; unauthenticated listener count; high-risk non-loopback listeners; policy violations; attestation coverage.

## Verification
Independent reviewer reproduces effective-state capture and guard outcome.

## Failure handling
Detection: nonzero guard exit. Evidence: preserve sanitized listener/capability snapshot. Retry: maximum 2 after configuration fixes. Fallback: bind loopback or disable affected service. Escalation: security owner. Stop: unresolved public high-risk exposure.
