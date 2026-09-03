# Skill: Protected Mutation Review

## Purpose
Find and close authorization gaps across all code paths capable of mutating shared or executable agent artifacts.

## Trigger
A new upload/import/edit/clone/restore route, shared template feature, MCP configuration mutation, scoped-agent feature, or security review.

## Inputs
Route/tool inventory, authorization model, protected resource definitions, downstream service identities, `config/mutation-paths.json`.

## Preconditions
The team can identify the protected artifact and all services capable of persisting or executing it.

## Required context
Caller roles/scopes, ownership semantics, shared-vs-session lifecycle, backend credentials, audit destination, dangerous executable fields such as `stdio` MCP commands.

## Allowed tools
Static code/search tools, route inventories, tests, read-only logs, `scripts/policy_parity_check.py`, vendor advisories/docs.

## Constraints
Do not weaken least privilege. Do not expose credentials. Do not execute untrusted agent bundles during review. Dangerous or irreversible tests require explicit human approval and an isolated environment.

## Procedure
1. Define the protected resource and forbidden mutation effects.
2. Enumerate every API, tool, import, restore and internal service path that can cause that effect.
3. Record mandatory controls for each path.
4. Run the parity checker before implementation changes.
5. Trace caller identity through downstream services; flag broad service credentials without re-authorization.
6. Centralize the protected-resource check where feasible.
7. Add negative tests for each path using a scoped caller.
8. Re-run parity and security tests.
9. Have an independent security verifier review evidence.

## Decision points
- Unknown mutation path coverage: stop and expand inventory.
- Broad downstream credential: require scope propagation or backend re-authorization.
- Shared executable artifact mutation: require admin/human approval or immutable-version creation.

## Expected output
Mutation matrix, parity violations, remediation, negative-test evidence, audit evidence, verifier verdict.

## Metrics
Inventory coverage, parity violations, blocked unauthorized mutations, downstream re-authorization coverage, audit coverage.

## Verification
Every inventoried protected path enforces all required controls and its scoped-caller negative test is blocked.

## Failure handling
Maximum two remediation attempts per violation. Preserve failing evidence and escalate architectural authorization gaps rather than adding route-specific exceptions.

## Stop conditions
Stop when all violations are closed and independently verified, or when safe enforcement requires an architectural decision outside the current change scope.
