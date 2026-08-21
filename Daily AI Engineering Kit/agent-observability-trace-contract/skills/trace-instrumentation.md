# Trace Instrumentation Skill

## Purpose
Instrument an AI-agent workflow with a portable, structured trace contract covering task stages, agent delegation, tool calls, retries, approvals, failures, and verification without leaking sensitive payloads.

## When to use
Use when a workflow has multiple steps, tools, agents, retries, checkpoints, approval boundaries, or long-running/resumable execution and operators need evidence for debugging or audit.

## Inputs
- workflow/task identifier
- agent/stage names
- tool/action inventory
- retry and approval policy
- verification checkpoints
- repository revision when applicable
- redaction policy

## Preconditions
- A stable task/run identifier can be created.
- Event timestamps can be emitted in UTC.
- Tool wrappers or workflow hooks can write JSONL or equivalent structured events.

## Allowed tools
Repository readers, local scripts, CI logs, agent/tool wrappers, observability exporters, test runners. Production mutation is not required by this skill.

## Constraints
- Never emit raw secrets, access tokens, cookies, private keys, full authorization headers, or unredacted sensitive tool inputs/outputs.
- Record hashes/fingerprints or bounded metadata instead of sensitive values.
- `executed`, `reviewed`, and `verified` are distinct states.
- Parent/child trace links must remain stable across delegation and retries.

## Process
1. Assign `trace_id` to the logical task run and `span_id` to each stage/tool attempt.
2. Record `task.started` with workflow, actor, repository revision, and declared scope.
3. For each stage emit `stage.started`, then `stage.completed` or `stage.failed`.
4. For every tool invocation emit `tool.started` before execution and `tool.completed`, `tool.failed`, or `tool.unknown` after execution.
5. Store tool name, operation class, attempt number, duration, side-effect class, input fingerprint, output fingerprint, and redacted evidence metadata.
6. For retries emit `retry.scheduled` referencing the failed/unknown attempt and the retry reason. Never overwrite the first failure.
7. For delegation emit `handoff.created` with producer, consumer, artifact/evidence fingerprints, and child span linkage.
8. For approval-required work emit `approval.requested`; after human decision emit `approval.granted`, `approval.denied`, or `approval.expired` with approval reference, never the raw secret/action payload.
9. For verification emit `verification.started` and `verification.completed` with checks, evidence references, verifier identity, and final status.
10. Run `scripts/validate-trace.py` on the trace.
11. Run `scripts/evaluate-trace-gate.py` before declaring the workflow verified.

## Expected output
A JSONL trace conforming to `schemas/trace-event.schema.json` plus a gate report.

## Verification
- every started span terminates or is explicitly marked unknown/abandoned
- retry attempts preserve prior evidence
- tool attempts are numbered monotonically per operation
- approval-required actions reference valid approval events
- verified status has explicit verification evidence
- sensitive keys are absent from emitted attributes

## Failure handling
Malformed or incomplete traces block verification. Exporter failures may be retried once if the local buffered event remains intact. If trace evidence cannot be recovered, mark the task `observability-incomplete` rather than verified.

## Stop conditions
Stop when trace integrity cannot be established, redaction cannot be guaranteed, or an approval-required mutation would proceed without approval evidence.
