# Skill: Semantic Effect Review

## Purpose
Determine whether a supposedly read-only MCP operation can produce writes or administrative side effects.

## Trigger
New database MCP integration, version upgrade, tool/schema change, read-only incident, or security review.

## Inputs
Tool schemas, handler code, operation examples, declared read-only policy, datastore grants.

## Preconditions
Use a non-production test target or static inspection. Obtain explicit approval before changing grants.

## Required context
Protocol version, server version, datastore engine, enabled extensions/procedures, effective service identity.

## Allowed tools
Repository search, static parser, test runner, read-only metadata queries, vendor documentation.

## Constraints
Do not infer safety from tool names. Do not expose secrets. Do not mutate production.

## Procedure
1. Record the declared read-only boundary and current negative tests.
2. Enumerate all execution-capable tools and alternate invocation routes.
3. For each operation family, identify constructs whose semantic effect can write, call procedures, execute admin functions, or invoke external resources.
4. Compare list-time filtering with call-time enforcement.
5. Inspect effective datastore grants; mark server-only enforcement as a weaker boundary.
6. Add deterministic fixtures for every discovered bypass class.
7. Implement the smallest execution-time guard, then rerun fixtures.
8. Independently verify datastore least privilege.

## Decision points
If semantics are unknown, block. If native datastore authorization can enforce the requirement, prefer it. If business needs require write capability, split the tool/identity rather than weakening read-only.

## Expected output
Facts, affected operations, evidence, root cause, proposed control, negative tests, residual risk, verification status.

## Metrics
Negative-test coverage, blocked semantic-write attempts, native authorization denials, false positives.

## Verification
All known bypass fixtures fail safely and a separate verifier confirms effective grants.

## Failure handling
Maximum two remediation cycles. If parsing or grants cannot be verified, stop and require human security review.

## Stop conditions
Stop only when the invariant is proven or the deployment is explicitly blocked.