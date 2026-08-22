# Skill: MCP Authorization Threat Model

## Purpose
Turn an MCP server's authentication/session/tool design into explicit authorization boundaries and adversarial test cases.

## Trigger
New MCP endpoint, OAuth change, stateful transport, sensitive tool, backend credential change, or authorization incident.

## Inputs
Architecture, OAuth issuer/audience, transport type, session storage, tool inventory, resource identifiers, backend identities, approval rules.

## Preconditions
A test environment and non-production identities/resources are available.

## Required context
Only architecture and policy facts needed to evaluate authorization. Never collect live bearer tokens or secrets into model context.

## Allowed tools
Repository search/read, configuration inspection, test runner, `scripts/check_authorization.py`, `scripts/run_negative_tests.py`.

## Constraints
No destructive production calls. No weakening policy to obtain a passing result. Human approval is required before testing a dangerous live tool.

## Procedure
1. Enumerate trust boundaries: client→authorization server, client→MCP server, transport→session, session→tool, tool→backend.
2. Identify security subjects and objects: principal, token audience/resource, session, MCP resource, tool, action, backend credential.
3. For each boundary record the authoritative check and where it executes.
4. Build an allow/deny matrix. Include same-principal valid access plus wrong audience, wrong principal, wrong session owner, wrong resource, ungranted tool/action, missing approval, and missing-policy cases.
5. Mark any boundary whose authorization depends only on possession of an identifier as critical.
6. Map the matrix into `config/policy.example.json` or a project-specific copy.
7. Run deterministic negative tests before integrating the model/agent.
8. Record observed failures separately from proposed fixes.

## Decision points
- Missing authoritative principal/resource binding → block release.
- Backend uses shared privileged credentials → require caller authorization before backend invocation.
- High-risk tool lacks approval policy → block release.

## Expected output
Threat-boundary table, policy matrix, failing attack cases, recommended enforcement location.

## Metrics
Denied attack cases / total attack cases; sensitive tools with explicit policy / total sensitive tools.

## Verification
A separate reviewer confirms that every trust boundary maps to a deterministic check and that all negative tests deny.

## Failure handling
Capture the exact failed matrix row, do not retry automatically, return to policy/implementation owner.

## Stop conditions
Stop after one complete matrix pass. Escalate immediately for any cross-principal or cross-resource success.
