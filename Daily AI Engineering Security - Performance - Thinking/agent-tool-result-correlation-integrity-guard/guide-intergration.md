# Integration Guide

## Goal

Insert a deterministic correlation boundary between model tool requests, real tool execution, and model continuation.

## Integration points

### 1. Session start
Create a session-scoped ledger outside prompt history. Store at minimum `session_id`, `active_generation`, `invocations`, and `results`.

### 2. Model turn start
Increment or initialize the generation counter. A retry, fallback, response regeneration, or reconstructed turn MUST receive a new generation unless the host can prove it is the same execution attempt.

### 3. Before tool execution
For every tool call, persist:

- `session_id`
- `generation`
- `agent_id`
- provider `tool_call_id`
- tool name
- argument digest
- side-effect classification
- state such as `issued` or `executing`

Register before dispatch so a fast result cannot arrive before its identity exists.

### 4. On result arrival
Append a result record carrying the same composite identity and payload. Do not overwrite a previous result. Run:

```bash
python scripts/correlation_guard.py \
  --ledger runtime-ledger.json \
  --policy config/correlation-policy.json \
  --report correlation-report.json
```

Only exit code `0` permits normal continuation.

### 5. Before model continuation
Run the guard again after all expected tool events for the turn have arrived. The default policy blocks continuation while active calls remain unresolved.

### 6. Retry/fallback handling
When a provider retry or model fallback occurs:

1. freeze the old generation for new dispatches;
2. inspect live background/tool executions;
3. classify completed side effects as facts rather than replay requests;
4. quarantine late old-generation results;
5. increment generation;
6. require idempotency proof or explicit human approval before replaying uncertain side effects.

### 7. Multi-agent runtimes
Give each subagent a stable `agent_id`. Tool-call IDs from two agents are never equivalent unless all composite identity fields match.

## Example ledger

```json
{
  "active_generation": 7,
  "invocations": [
    {
      "session_id": "run-42",
      "generation": 7,
      "agent_id": "implementation-agent",
      "tool_call_id": "call_abc",
      "state": "issued",
      "side_effectful": false
    }
  ],
  "results": [
    {
      "session_id": "run-42",
      "generation": 7,
      "agent_id": "implementation-agent",
      "tool_call_id": "call_abc",
      "payload": {"exit_code": 0, "summary": "tests passed"}
    }
  ]
}
```

## Telemetry

Record counts rather than raw sensitive tool payloads when possible:

- accepted result count;
- identical duplicates ignored;
- conflicting duplicates blocked;
- orphan results blocked;
- stale results quarantined;
- unresolved calls at continuation boundary;
- side-effect replays blocked;
- reconciliation attempts and outcome.

## Rollout

Start in observe-only mode for a representative workload, establish a baseline, then enable fail-closed behavior for orphan/conflicting results. Finally enable strict unresolved-call blocking after verifying that the host correctly models long-running/background calls.

## Production validation

Run `python -m unittest tests/test_correlation_guard.py`. Add runtime-specific fixtures for retries, fallback, stream reconnect, parallel subagents, cancelled calls, and side-effectful tools. Measure before/after duplicate execution and manual recovery rates. Do not claim improvement from test coverage alone.