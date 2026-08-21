# Validated Output Loop

## Trigger
An AI-generated result will be parsed, handed to another agent, checked into CI artifacts, or used to decide/trigger an action.

## Entry conditions
Task contract and evidence sources are identifiable; package dependencies are installed.

## Inputs
Requirements, evidence, `config/gate.json`, `schemas/agent-output.schema.json`.

## Stages
1. **Context** — Output Producer gathers only relevant repository/log/test evidence.
2. **Produce** — Output Producer writes candidate JSON.
3. **Deterministic gate** — Validation Verifier runs `python scripts/run_gate.py <candidate>`.
4. **Review** — verifier confirms evidence IDs and semantic status constraints.
5. **Repair** — on retryable validation defects, producer follows `skills/repair-invalid-output.md`.
6. **Re-verify** — verifier reruns the unchanged gate.
7. **Complete or escalate** — only a passing artifact may be marked verified.

## Checkpoints
- Before production: evidence exists for each intended finding.
- Before handoff: gate exit code is 0.
- Before dangerous side effect: separate human approval exists.

## Retry rules
Maximum two repair attempts. Retry syntax/schema defects and correctable evidence-link defects. Preserve candidate and stderr for each attempt. Do not retry permission/environment failures without a concrete environment change.

## Approval points
Schema changes, validation weakening, production config changes, destructive operations, secret changes, breaking contracts and irreversible migrations require explicit human approval.

## Failure paths
Malformed output -> bounded repair. Missing evidence -> gather evidence or mark inconclusive. Validator/tool unavailable -> stop as environment failure. Approval absent -> `needs_approval` and stop.

## Definition of Done
Candidate exists; unchanged gate passes; every finding has evidence; verification flags support status; required approval is present for any gated action; no blocking error remains.
