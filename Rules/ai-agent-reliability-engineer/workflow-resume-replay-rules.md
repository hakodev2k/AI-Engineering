# Workflow Resume and Replay Rules

## Purpose
Make agent workflow resumption and replay diagnostically useful without re-triggering unsafe or duplicate side effects.

## Scope
Applies to durable workflows, recorded runs, debugging replay, incident reproduction, and resumed agent execution.

## MUST
- Systems that claim reproducible replay MUST record the workflow version, relevant prompt or policy version, model identity, configuration, tool contract versions, and references to tool results needed to explain the run.
- Diagnostic replay MUST be explicitly distinguished from executable replay.
- Diagnostic replay MUST suppress or sandbox external side effects unless execution is intentionally authorized.
- Resumption MUST validate compatibility between persisted state and the current workflow implementation.
- Migration logic MUST be defined when persisted workflow state can outlive a breaking workflow change.
- Replay output MUST identify nondeterministic inputs or unavailable historical dependencies that prevent exact reproduction.

## MUST NOT
- Replay MUST NOT repeat a state-changing tool call unless idempotency or explicit duplicate prevention is established.
- A workflow MUST NOT silently resume using an incompatible state schema or materially changed policy.
- Debugging replay MUST NOT send real messages, alter production data, deploy code, or perform equivalent effects by default.

## SHOULD
- Historical external responses SHOULD be referenced or safely captured when required for incident analysis.
- Replay tooling SHOULD support step-by-step inspection and controlled continuation from a checkpoint.

## Exceptions
Executable replay of historical side effects requires explicit scope, authorization, reconciliation planning, rollback where possible, and human approval for consequential actions.

## Verification
Replay recorded runs in a sandbox, force version mismatches, test resume migrations, verify side-effect suppression, and compare diagnostic traces with original execution records.