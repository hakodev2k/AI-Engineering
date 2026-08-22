# Integration Guide

## 1. Data contract
Export one JSON object per request. The sentinel accepts flat fields or common nested `usage` / `message.usage` layouts.

Recommended normalized fields:

```json
{
  "request_id": "req-123",
  "timestamp": "2026-08-21T05:00:00Z",
  "model": "model-name",
  "version": "client-version",
  "cache_read_input_tokens": 420000,
  "cache_creation_input_tokens": 2500,
  "input_tokens": 1000,
  "miss_reason": ""
}
```

Do not export prompts, tool output, source code, secrets, or user content for this detector.

## 2. Install
Requires Python 3.10+ and no third-party packages.

```bash
python scripts/cache_sentinel.py --help
python -m unittest tests/test_cache_sentinel.py
```

## 3. Establish a baseline
Start with `config/policy.json` in observe-only mode. Run at least two healthy representative sessions. Record:
- median warm cache-read ratio;
- typical cache creation per incremental request;
- normal session rewrite volume;
- legitimate cache misses after intentional model/system/client changes.

Do not tune thresholds around a known pathological session.

## 4. Run analysis

```bash
python scripts/cache_sentinel.py session.jsonl \
  --policy config/policy.json \
  --output cache-report.json
```

Interpretation:
- `status=ok`: no repeated collapse incident matched the configured policy;
- `status=incident`: repeated collapse pattern was detected;
- `estimated_rewrite_tokens`: diagnostic sum of cache creation on detected collapse events, not a billing claim.

## 5. Integrate with agent runtimes
Place metadata collection at the request/response accounting boundary where provider usage counters are already available. The integration should:
1. append one normalized metadata record per completed model request;
2. preserve request ID, timestamp, model/client version, and cache miss reason when available;
3. deduplicate repeated transcript blocks that share a request ID;
4. run the sentinel at session checkpoints, after long waits/resumes, and after integration/client updates;
5. keep the report separate from the model prompt unless the agent explicitly needs a compact incident summary.

## 6. Hook-aware clients
If hooks inject `additionalContext`, system metadata, timestamps, or dynamic tool descriptions, record a stable hook-config/version identifier next to the session metadata. Do not log the injected content solely for cache diagnosis. When a regression begins immediately after a hook transition, test a reduced fixture with that hook enabled/disabled rather than repeatedly burning full-context tokens.

## 7. Resume and multi-client workflows
Record process/client version at each resume boundary. If the same session can be resumed from multiple front ends or binaries, require version compatibility before automated continuation when historical evidence shows `system_changed`/cache rewrites.

## 8. Blocking mode
After healthy/pathological fixtures are validated, set `fail_on_incident=true`. Exit code 2 can then stop an automated long-running loop before more expensive requests are issued.

Blocking mode should not terminate an irreversible operation mid-flight. Apply the gate between model requests or at a safe checkpoint.

## 9. Customization
Tune thresholds from your workload:
- `warm_cache_min_read_tokens`: avoids tiny-session noise;
- `warm_cache_min_read_ratio`: defines a clearly warm predecessor;
- `collapse_max_read_ratio`: how far reuse may fall before collapse classification;
- `large_rewrite_min_tokens`: absolute rewrite floor;
- `rewrite_vs_previous_read_ratio`: relative rewrite floor versus previous warm read;
- `incident_window_requests` and `incident_min_collapses`: repeated-thrash requirement.

## 10. Verification
For every mitigation, capture baseline and candidate JSONL using the same representative task. Require:
- zero repeated-collapse incident in candidate;
- lower rewrite volume or return to established healthy baseline;
- no correctness/safety context removed;
- existing task tests/evals pass;
- independent verification when the mitigation changes shared agent infrastructure.

## 11. Failure handling
- malformed input/config: exit 3; fix data, do not guess;
- I/O/runtime failure: exit 4; preserve raw metadata;
- incident: stop unlimited retries, inspect first collapse, use at most two expensive reproductions;
- unknown root cause: report correlation only and escalate with minimal evidence.
