# MCP Protocol-Era Capability Contract

## Topic
Prevent agent plans from assuming MCP capabilities that are not actually available after protocol negotiation or fallback.

## Category
Thinking

## Problem
During the MCP TypeScript SDK v2 transition, a client can be configured for automatic protocol negotiation yet end up on a legacy era, fail during discovery/fallback, or expose different method semantics after connection. A planner that treats configured negotiation mode as evidence of effective capabilities can build an invalid multi-step plan before the connection state is known.

## Evidence
See `evidence/research.md`.

## Existing approach
The SDK exposes version-negotiation modes, protocol-era helpers and runtime method errors. Official migration guidance also documents legacy/modern behavior and transport-specific caveats.

## Existing limitations
Configuration is intent, not evidence. `auto` can probe and fall back; malformed 2xx discovery responses currently have a reported failure mode; transport behavior differs; and supported methods depend on negotiated connection state. A plan can therefore be internally coherent but impossible for the effective session.

## Proposed improvement
Materialize an explicit post-connect capability snapshot and validate every required plan capability against it before execution. If the contract fails, permit one bounded replan using only observed capabilities; otherwise stop with evidence.

## Architecture
- `evidence/research.md` — current signals and root-cause analysis.
- `skills/capability-contract-planning.md` — reusable planning procedure.
- `rules/capability-evidence-rules.md` — enforceable planning rules.
- `subagents/capability-verifier.md` — independent verifier role.
- `workflows/negotiate-plan-verify.md` — bounded workflow.
- `hooks/pre-execution-capability-gate.md` — deterministic gate contract.
- `schemas/session-capabilities.schema.json` — snapshot schema.
- `scripts/check_capability_contract.py` — executable plan/capability checker.
- `tests/test_check_capability_contract.py` — regression tests.

## Installation
Python 3.10+; no external Python dependencies.

## Usage
Produce a session snapshot after MCP connection and a plan-requirements JSON document, then run:

`python scripts/check_capability_contract.py session.json plan.json`

Exit 0 means every required capability is observed in the effective session. Exit 2 means one or more requirements are unavailable. Exit 1 means invalid evidence/input.

## Inputs
Observed negotiated protocol version, protocol era, effective capability names, fallback/probe status, plan requirements.

## Outputs
Machine-readable verdict with missing capabilities and observed session identity.

## Metrics
Unsupported-method failures per task; replans caused by capability mismatch; plans gated before execution; false-positive gate rate; successful completion after bounded replan.

## Verification
**Implemented:** package files, schema, checker and tests exist. **Measured:** a consuming runtime records session snapshots and capability-mismatch outcomes. **Verified:** unsupported-capability execution attempts fall to zero for tested scenarios, the checker rejects mismatches, and valid plans still execute.

## Safety
The gate never treats authentication failure, network failure or malformed discovery as proof of a legacy capability. It does not bypass authorization or substitute one method for another without an explicit planner decision.

## Failure handling
Invalid or missing connection evidence blocks execution. One replan is allowed after a capability mismatch. A second mismatch stops the workflow and escalates with the snapshot and missing requirements.

## Definition of Done
Current evidence documented; effective session facts captured; required capabilities declared; deterministic pre-execution gate passes; at most one bounded replan used; final method execution is supported by observed capabilities; verification evidence retained.
