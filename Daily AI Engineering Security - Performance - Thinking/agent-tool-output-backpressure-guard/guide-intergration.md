# Integration Guide

## Integration boundary

Place this guard between the host's tool/subagent output stream and any of these consumers:

1. active model context;
2. session/transcript persistence;
3. UI/terminal replay buffer;
4. long-term artifact storage.

Do not make the model responsible for byte accounting. The model receives the bounded result produced by deterministic host logic.

## 1. Capture baseline first

Before enforcing limits, collect representative values for:

- p50/p95/p99 bytes per tool call;
- bytes per session;
- largest inline session record;
- repeated-payload overhead;
- peak process/renderer RSS;
- resume p50/p95;
- tool-output tokens injected into model context where telemetry exposes them.

Run:

```bash
python scripts/session_bloat_audit.py \
  --policy config/output-policy.json \
  --session path/to/session.jsonl \
  --report output-audit.json
```

Start with observe-only telemetry in your host even though the reference capture script enforces the configured limits.

## 2. Wrap the tool stream

A host can pipe stdout/stderr or a serialized tool result through:

```bash
producer-command | python scripts/output_backpressure.py capture \
  --policy config/output-policy.json \
  --session-counter .agent-output/session-123.json \
  --session-id session-123 \
  --tool-id build-456
```

Interpret exit codes:

- `0`: accepted; output may still be reference-only after a soft threshold;
- `2`: hard output/rate/session budget reached;
- `3`: invalid policy/arguments;
- `4`: I/O/accounting failure.

The host must capture the producer's actual exit status separately. A guard exit code is not a substitute for tool exit status.

## 3. Persist large output by reference

For large results, store one content-addressed artifact and inject metadata similar to:

```json
{
  "tool_id": "build-456",
  "captured_bytes": 3145728,
  "sha256": "...",
  "clipped": false,
  "artifact": {
    "path": ".agent-output-artifacts/<sha>.bin",
    "sha256": "...",
    "bytes": 3145728
  },
  "head_preview_utf8": "...",
  "tail_preview_utf8": "...",
  "full_output_inline": false,
  "retrieval_required_for_full_output": true
}
```

Do not copy the artifact body back into the session record. The reference is the session payload.

## 4. Preserve correctness semantics

A truncated/reference result must be visibly different from a complete inline result. If a test, security scan, migration, or deployment decision depends on omitted content, explicitly retrieve the artifact and inspect the required region.

Recommended policy:

- final exit code and structured test summary remain inline;
- bounded head and tail remain inline;
- verbose middle sections move to artifact storage;
- binary output never gets lossy UTF-8 treatment as the authoritative artifact;
- omitted output cannot count as verified evidence until required data is fetched.

## 5. Integrate rate protection

The reference script tracks bytes over a sliding time window. A runtime may add stronger producer control:

```text
soft rate threshold -> telemetry + switch to reference mode
hard rate threshold -> stop capture + host decides whether producer cancellation is authorized
```

Keep process lifecycle/cancellation separate from output accounting. Never kill by process name or guess ownership.

## 6. Session persistence and resume

Before serializing an oversized record:

```text
full payload -> artifact store -> digest/reference -> session JSONL
```

On resume:

```text
session JSONL -> load metadata/previews -> render/restore conversation
                                  -> fetch artifact only on explicit demand
```

Run the auditor before migrating old large sessions. Back up session state before transformation.

## 7. Metrics

Emit at minimum:

- `agent_output_captured_bytes_total{tool_class}`;
- `agent_output_inline_bytes_total`;
- `agent_output_artifact_bytes_total`;
- `agent_output_limit_hits_total{reason}`;
- `agent_output_duplicate_bytes_total`;
- `agent_output_artifact_fetch_total`;
- `agent_session_resume_latency_ms`;
- `agent_session_peak_rss_bytes`;
- `agent_output_clipped_results_total`.

## 8. Rollout

Phase 1: baseline only.  
Phase 2: reference mode after soft limit; hard limits high enough to avoid normal traffic.  
Phase 3: enforce measured per-tool/session/rate hard limits.  
Phase 4: add lazy replay and artifact TTL with reachability checks.

At each phase compare metrics against the same workload corpus.

## 9. Failure handling

### Artifact write fails
Fail closed when policy requires it. Do not discard full output and return a fake success record.

### Session counter is corrupt
Stop capture and repair/reconcile accounting. Do not reset it silently to zero.

### Hard limit fires
Keep previews/reference, record reason, diagnose producer, retry at most `max_recovery_attempts`.

### Full artifact is missing later
Mark evidence unavailable and re-run only if the operation is safe/idempotent. Missing historical output is not permission to repeat side effects blindly.

### Diagnostic quality regresses
Raise the *targeted* budget or improve structured extraction for that workload class after measurement. Do not disable the global guard.

## 10. Verification

Run deterministic tests:

```bash
python -m unittest -v tests/test_output_backpressure.py
```

Then run a target-runtime benchmark with:

- normal command output;
- 10–100 MB deterministic output;
- infinite/repetitive output with a host timeout;
- large subagent result;
- repeated identical payloads;
- large retained session resume.

A rollout is verified only when resource metrics improve and required diagnostic/verification evidence remains available.