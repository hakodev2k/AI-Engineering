# Integration Guide

## Integration point
Place the guard between **host context producers** and the final **model request context builder**. Do not run it after the request has already been serialized or persisted as model-visible transcript content.

Recommended flow:

`producer → classify → normalize → fingerprint → admission decision → bounded ledger → final context → token measure → model`

## 1. Map host events
For each host-generated context item provide:

```json
{
  "turn": 42,
  "source": "rules",
  "logical_key": "rule:dotnet-security",
  "version": "sha-or-version-if-available",
  "content": "...",
  "always_include": false
}
```

`logical_key` must represent the durable identity of the fact/state, not a random event ID. Good examples:
- `rule:dotnet-security`
- `file:src/Orders/OrderService.cs`
- `hook:test-summary`
- `reminder:task-tools`

Bad examples:
- a new UUID every turn;
- timestamp-only IDs;
- one global key for all files.

## 2. Classify correctness-sensitive sources
Keep `deduplicate=false` for:
- user messages;
- current tool results;
- safety policy;
- authorization decisions;
- active recovery errors.

Unknown producers must initially fail open: include them until replay semantics are understood.

## 3. Start in observe mode
Copy `config/policy.json` and set:

```json
"mode": "observe"
```

In observe mode the reference guard reports duplicate candidates without suppressing them. Capture a representative long-running session and inspect per-source repeat volume.

## 4. Build baseline
Export events to JSONL and run:

```bash
python scripts/context_injection_guard.py \
  --policy config/policy.json \
  --input examples/sample-events.jsonl \
  --output /tmp/context-decisions.jsonl
```

For a production integration, use the actual captured event stream rather than the sample.

Measure with:

```bash
python scripts/context_metrics.py \
  --events examples/sample-events.jsonl \
  --decisions /tmp/context-decisions.jsonl \
  --target-reduction 0.30
```

The estimator is only a portable baseline. Prefer the model provider's token-count endpoint for final production metrics.

## 5. Enable enforcement narrowly
After a repeat producer is proven safe to deduplicate:
1. ensure it has stable `logical_key` semantics;
2. create unchanged and changed-version tests;
3. set `deduplicate=true` for that source;
4. switch policy mode to `enforce`;
5. replay the same captured session;
6. compare token metrics and context coverage.

Do not enable all sources at once merely because they are host-generated.

## 6. Persist bounded ledger state
The reference script keeps the ledger in memory for one replay. A real host can keep a session-scoped ledger containing only:
- logical key;
- fingerprint;
- last-seen turn;
- optional version.

Do not persist duplicate payload content solely for the guard. Enforce `ledger_max_entries` or an equivalent LRU/TTL bound.

## 7. Changed content
A changed fingerprint for the same logical key is always included. The new version becomes the active ledger value. This makes an edited rule/file/reminder visible immediately.

## 8. Freshness window
`freshness_turns` prevents an unchanged state item from being silent forever. If the same item has not been seen within the configured window, it is included again. Tune this only from measurement and task semantics.

## 9. Oversized events
The reference guard rejects oversized suppressible host attachments because they can unexpectedly consume context. Required sources remain included. Production hosts may instead spill large optional content to an explicit retrieval artifact, but that must be a deliberate integration with a stable reference and must not hide required content.

## 10. Metrics
Record at minimum:
- baseline input tokens;
- guarded input tokens;
- suppressed tokens;
- duplicate event/token ratio;
- per-source contribution;
- context-builder p50/p95 latency;
- required-context violations;
- quality regression results;
- policy version.

## 11. CI gate
Run:

```bash
python tests/test_guard.py
```

Then replay a representative production-like fixture. CI must fail if a required event is suppressed or a changed version is absent.

## 12. Rollback
If a quality regression is detected:
1. set the implicated source to `deduplicate=false`;
2. preserve the failing fixture and decision metadata;
3. identify key collision, unsafe normalization, stale-window behavior, or source misclassification;
4. allow at most two remediation iterations;
5. keep include-all behavior if the source cannot be proven replay-safe.

## Host-specific adaptation notes
### Claude Code-like hosts
Focus first on rule reminders, file-change attachments, task reminders, and hook-success attachments. The public evidence in `evidence/research.md` shows these are known repeat producers.

### MCP/agent orchestrators
Apply this guard to host-generated wrapper context, not blindly to MCP tool results. A tool result may represent a new external observation even when text happens to match a prior result.

### Multi-agent systems
Use separate ledgers per agent/context boundary unless two agents demonstrably share identical source/version semantics. Do not allow one agent's fingerprint to suppress another agent's required handoff.
