# Skill: Tool Origin Provenance Audit

## Purpose
Determine whether an MCP tool call has sufficient trusted provenance for origin-sensitive policy enforcement.

## Trigger
Run when integrating MCP Apps, adding a dual-visible tool, changing Host/gateway routing, or investigating a call whose initiator is unclear.

## Inputs
Tool visibility/allowed-origin policy, Host request context, caller payload, normal authz context, and relevant logs.

## Preconditions
The trusted Host boundary and untrusted app/model payload boundary are identified.

## Required context
Protocol/tool metadata and observable request context only; hidden reasoning is not needed.

## Allowed tools
Read-only config/log inspection, MCP documentation, integration tests, `scripts/origin_provenance_gate.py`.

## Constraints
- MUST NOT trust origin claims embedded in tool arguments or arbitrary caller metadata.
- MUST NOT treat provenance as authentication or authorization.
- MUST NOT widen tool visibility to avoid a provenance failure.
- MUST preserve existing approval and sandbox rules.

## Procedure
1. Inventory tools visible to both app and model.
2. Mark tools where policy/audit behavior differs by initiator.
3. Trace the real Host → gateway → server dispatch path.
4. Identify the earliest trusted point where origin is known.
5. Ensure that point injects `host_attested_origin` outside tool arguments.
6. Verify adapters preserve the field or fail closed.
7. Run the deterministic gate against app, model, unknown, visibility mismatch, and forged caller-marker fixtures.
8. Confirm downstream normal authorization still runs.
9. Record sanitized origin/decision evidence.

## Decision points
Known trusted origin + policy match → continue to normal authz. Unknown origin + origin-sensitive tool → block. Untrusted caller claim → ignore for authorization and record warning.

## Expected output
Facts, trust-boundary diagram, tool inventory, coverage gaps, gate report, and verification status.

## Metrics
Trusted provenance coverage, unknown blocks, forged claims, policy mismatches, bypass-test failures.

## Verification
An independent verifier must prove the application cannot directly set or override the Host-attested field and that the gate runs before real tool dispatch.

## Failure handling
Refresh trusted Host context once. If provenance remains missing/inconsistent, block the sensitive call and escalate. Maximum retry: 1.

## Stop conditions
Stop on an untrusted injection point, gateway context loss without fail-closed behavior, or any bypass of normal authorization.
