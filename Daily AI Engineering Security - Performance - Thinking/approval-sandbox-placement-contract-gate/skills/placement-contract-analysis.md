# Skill: Placement Contract Analysis

## Purpose
Analyze command authorization, execution placement, and confidentiality boundaries as separate observable policy dimensions.

## Trigger
Run when command rules, permission profiles, denied-read paths, approval policy, sandbox configuration, or trusted broker configuration changes; also before first use of a host-execution rule.

## Inputs
Command/rule identity, approval decision, requested placement, active denied-read/confidentiality invariants, requested capabilities, broker identity and declaration, and `config/placement-policy.json`.

## Preconditions
The effective permission profile and rule source MUST be known. Broker metadata MUST come from trusted local configuration rather than model-provided text.

## Required context
User intent for the command, current permission profile, protected-resource invariants, rule decision, and effective runtime capabilities.

## Allowed tools
Read-only policy/config readers, sandbox probes that do not access protected content, command metadata inspection, and `scripts/placement_policy_gate.py`.

## Constraints
- MUST treat approval and placement as independent dimensions.
- MUST preserve denied-read and secret-isolation invariants.
- MUST NOT convert an `allow` approval decision into host execution unless placement explicitly requests `host-via-broker`.
- MUST NOT permit direct unsandboxed execution when confidentiality depends on sandbox-only restrictions.
- Host execution MUST use an explicitly trusted broker declaration.

## Procedure
1. Record the rule-derived approval decision.
2. Record requested execution placement separately.
3. Enumerate confidentiality invariants and whether denied-read restrictions are active.
4. Identify requested capabilities and classify high-risk actions.
5. If host placement is requested, resolve the broker solely from trusted configuration.
6. Run the deterministic placement gate.
7. For `allow_sandbox`, verify runtime remains sandboxed.
8. For `approval_required`, collect explicit human approval bound to command, broker, placement, and protected invariants; rerun the gate.
9. For `allow_broker`, verify the broker declaration preserves required boundaries and log effective placement.
10. For `broker_required` or `deny`, do not weaken protection; return actionable incompatibility evidence.

## Decision points
- Approval `deny`: always deny.
- Placement `sandbox`: approval may be allow/ask, but execution remains sandboxed.
- Host placement with confidentiality invariants: require a trusted broker.
- High-risk host capability: require human approval when configured.
- Unknown broker under fail-closed policy: deny/broker-required.

## Expected output
Approval decision, requested/effective placement, invariant status, broker status, requested capabilities, final decision, and reasons.

## Metrics
Silent placement mismatches, protected-invariant violations, broker use, approvals for high-risk host actions, and policy incompatibilities detected before execution.

## Verification
Test all approval × placement combinations with and without confidentiality invariants, including unknown brokers and high-risk capability requests.

## Failure handling
Block on ambiguous or inconsistent policy. Recompile once after a deliberate configuration correction; otherwise stop and escalate.

## Stop conditions
Stop when the command has an explicit safe effective placement or is blocked with evidence. Never resolve a mismatch by removing denied-read protections.
