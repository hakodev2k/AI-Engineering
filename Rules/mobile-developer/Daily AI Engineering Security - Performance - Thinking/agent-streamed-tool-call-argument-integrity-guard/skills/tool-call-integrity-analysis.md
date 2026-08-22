# Skill: Tool-Call Integrity Analysis

## Purpose
Determine whether streamed tool-call arguments are complete and safe to execute without reconstructing missing semantics.

## Trigger
Run before every streamed tool call reaches the executor, and whenever parsing, repair, truncation, or provider transport errors are observed.

## Inputs
Tool name, raw fragments, stream completion/finish reason, parsed arguments, repair actions, JSON schema, side-effect classification, retry count.

## Preconditions
The runtime must retain enough metadata to distinguish model-authored arguments from sanitizer-produced replacements.

## Allowed tools
Schema validator, deterministic parser, hash function, provider/runtime logs, `scripts/argument_integrity_gate.py`.

## Constraints
- Never invent missing argument content.
- Never convert a lossy repair into success for a side-effecting tool.
- Legitimate zero-required-field tools must remain supported.
- Retries occur only before tool execution.

## Procedure
1. Record raw argument length and SHA-256.
2. Determine whether the stream ended normally and whether a tool call was still in flight.
3. Parse raw arguments without mutation.
4. Record every repair that would be required.
5. Label repair as lossless or lossy. Substitution of a non-empty malformed payload with `{}` is always lossy.
6. Validate parsed/canonical arguments against the schema.
7. Determine whether the tool is side-effecting.
8. Apply policy: incomplete/lossy + side effect => retry if budget remains and execution has not happened; otherwise block.
9. Emit structured findings and an explicit failure event when blocked.

## Decision points
- Empty/whitespace raw args + zero required schema fields: canonical `{}` may be allowed.
- Non-empty raw args that cannot be parsed completely: never silently canonicalize to `{}`.
- Missing finish/completion evidence with tool in flight: treat as incomplete.

## Expected output
Decision (`allow|retry|block`), reason codes, raw hash/length, schema result, side-effect flag, retry count.

## Metrics
Blocked lossy calls, retry success rate, false-block rate for zero-argument tools, silent-success count (target 0).

## Verification
Replay known-good zero-argument calls, malformed/truncated calls, and provider-drop fixtures. Confirm blocked calls do not reach executor.

## Failure handling
If integrity metadata is unavailable for a side-effecting call, fail closed and surface `integrity_unknown`.

## Stop conditions
Allow only after complete/valid integrity evidence. Stop after configured retry limit and block rather than looping.
