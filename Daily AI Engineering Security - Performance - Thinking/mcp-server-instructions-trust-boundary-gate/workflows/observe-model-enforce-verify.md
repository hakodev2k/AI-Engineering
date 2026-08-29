# Workflow: Observe, Model, Enforce, Verify

## Trigger
New/changed MCP server metadata, newly privileged tool, injection report, or trust-policy change.

## Goal
Prevent server-controlled natural language from becoming implicit authority while maintaining legitimate MCP functionality.

## Inputs
Server trust state, instructions/tool metadata, user goal, host policy, tool capabilities, attack/control fixtures.

## Baseline
Record current prompt assembly, approval path, tool permissions, and attack/control outcomes before changing enforcement.

## Stages
1. **Observe** — capture metadata origin and current handling without executing privileged attack actions.
2. **Threat model** — Threat Modeler maps assets, boundaries, attack paths, existing controls, gaps.
3. **Hypothesis** — state which boundary failure permits the undesired action and which deterministic control should block it.
4. **Implement** — isolate untrusted metadata, normalize/limit it, and enforce host-side capability/approval policy.
5. **Attack/control tests** — run sanitized fixtures.
6. **Re-evaluate** — if a mandatory attack still passes, revise once; maximum 2 implementation attempts total.
7. **Independent verify** — Security Verifier confirms host-side enforcement and legitimate control usability.

## Responsible agents
Threat Modeler for stages 1-3; implementation owner for stage 4; Security Verifier for stage 7.

## Tools
Metadata scanner, policy engine, `scripts/mcp_instruction_gate.py`, test runner, sanitized audit log.

## Outputs
Threat model, baseline, enforcement verdicts, audit records, attack/control results, residual-risk decision.

## Checkpoints
Origin established; privileged capability inventory reviewed; hypothesis documented before change; mandatory tests pass; independent review complete.

## Metrics
Attack fixtures blocked; privileged calls requiring approval; untrusted-policy promotions; control pass rate; secret leakage; security regression count.

## Retry policy
Maximum 2 implementation attempts. Every retry MUST address a specific failed attack path. No infinite red-team/patch loop.

## Stop conditions
All blocking attacks are prevented with control usability preserved, or second attempt fails and the integration remains disabled/restricted pending human security review.

## Failure path
Fail closed for privileged actions, preserve sanitized evidence, restore last secure configuration, escalate. Never broaden permissions to make a fixture pass.

## Verification
Independent attack/control execution plus inspection showing final authorization is derived from host policy rather than server prose.

## Definition of Done
Implemented, measured, independently verified; no blocking security finding; no secret exposure; required approvals preserved.
