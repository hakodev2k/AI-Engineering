# Integration Guide

## Integration goal
Place deterministic redaction between raw tool execution and every model/transcript/log sink. The package is not a model prompt and must not be implemented only as agent instructions.

## 1. Choose the interception point
Trace each tool result from process/tool completion to:
- model context assembly;
- local transcript/session storage;
- remote sync;
- telemetry/debug logging;
- terminal/history rendering.

The sanitizer must run before the earliest model-bound or durable sink. If a framework's PostToolUse hook executes after rendering/persistence, wrap the tool runner instead.

## 2. Configure policy
Edit `config/redaction-policy.json`:
- `secret_env_names`: only environment-variable names whose values may be safely registered for exact masking;
- `blocked_command_patterns`: commands that broadly dump environment/credential state;
- `sensitive_assignment_keys`: key names whose assignment values should be masked;
- `max_output_bytes`: bounded input size for the reference implementation.

Do not add a mechanism that dumps the full environment just to find secrets.

## 3. Add shell command preflight
Before shell execution:

```bash
python scripts/command_preflight.py \
  --policy config/redaction-policy.json \
  --command "$PLANNED_COMMAND"
```

Interpret exit codes:
- `0`: continue;
- `2`: block and require an explicit one-shot human override or choose a safer command;
- `3`: configuration/input failure; fail closed.

Prefer safe alternatives such as checking whether a variable exists or listing config key names instead of returning values.

## 4. Sanitize tool output
Capture stdout/stderr/structured textual fields before they are exposed to model or persistence:

```bash
python scripts/secret_output_guard.py \
  --policy config/redaction-policy.json \
  --input raw-output.txt \
  --output safe-output.txt \
  --metrics redaction-metrics.json
```

Only `safe-output.txt` may flow downstream. If the command exits non-zero, suppress/quarantine the original tool result.

For structured results, sanitize each textual field or serialize into a temporary internal buffer, sanitize, then validate the sanitized structure before forwarding. Do not replace a schema-rejected sanitized payload with the raw original.

## 5. Protect streaming tools
For streaming output, use one of these architectures:
1. buffer up to the configured safety limit, sanitize, then release;
2. implement a stateful streaming sanitizer that preserves pattern fragments across chunk boundaries;
3. if neither is safe, mark that tool unsupported and quarantine its output.

Chunk-by-chunk stateless regex is unsafe because a token can span chunks.

## 6. Add final transcript-write verification
Immediately before durable write, run the serialized result through the sanitizer/residual check again. This detects alternate log paths or adapter bugs. Store only redacted output and value-free security metrics.

## 7. Run regression tests
From the topic root:

```bash
python tests/run_tests.py
```

The suite uses only synthetic fake credentials and validates exact masking, common token patterns, sensitive assignments, command preflight and metrics hygiene.

## 8. Production verification
Use synthetic canaries, never live credentials, to prove:
- stdout protected;
- stderr protected;
- structured errors protected;
- retry/replay protected;
- transcript persisted form protected;
- model-bound form protected;
- sanitizer failure does not pass raw data through.

An independent verifier must perform the final security check for high-risk deployments.

## Host integration pseudocode

```text
planned command
  -> preflight(command)
  -> if blocked: ask for explicit override / safe alternative
  -> execute tool
  -> capture bounded raw result (internal only)
  -> sanitize(raw result)
  -> residual check
  -> if failure: quarantine generic marker
  -> validate sanitized tool-result schema
  -> send sanitized result to model
  -> serialize sanitized result
  -> final residual check
  -> write transcript/log
```

## Failure handling
- invalid policy: fail closed;
- sanitizer crash: quarantine result;
- residual detected: suppress raw result and open sanitized security event;
- unsupported tool-result rewrite: move interception earlier or block that result type;
- confirmed real credential exposure: follow `workflows/workflows.md` incident workflow and rotate/revoke when required.

## Customization
Teams can add provider-specific token patterns, lower-confidence heuristics, structured field rules, or safe metadata-only tools. Every new rule should have a synthetic positive fixture plus representative negative fixtures to measure false positives.
