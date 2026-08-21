# Integration Guide

## 1. Place the package
Copy this directory into your agent host or reference it from orchestration tooling. Python 3.10+ is sufficient; the watchdog uses only the standard library.

## 2. Adapt runtime approval events
Emit JSONL lifecycle events at the actual boundaries, not from model text.

Required minimum event:
```json
{"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r-123","agent_id":"main","approval_route":"desktop"}
```

When the request reaches a decision-capable surface:
```json
{"ts":"2026-08-21T09:00:02+07:00","type":"surfaced","request_id":"r-123"}
```

Then exactly one terminal event:
```json
{"ts":"2026-08-21T09:00:08+07:00","type":"approved","request_id":"r-123"}
```

For subagents add `parent_agent_id` and an `approval_route` that identifies the parent/controller proxy.

## 3. Configure policy
Start with `config/policy.json`. Tune deadlines from measured behavior, not guesses. Keep `allow_implicit_approval=false`. If users genuinely require long reading/decision time, increase `decision_timeout_seconds`; do not increase the surface deadline to hide routing defects.

## 4. Run pre-production validation
```bash
python scripts/approval_watchdog.py tests/fixtures.jsonl \
  --policy config/policy.json \
  --now 2026-08-21T09:07:00+07:00
```

The bundled mixed fixture intentionally contains an unresolved hidden request, so this command should exit `2` and report timeout violations.

Run unit/regression tests:
```bash
python tests/test_watchdog.py
```

## 5. Host integration pattern
At the tool runner:
1. determine that approval is required;
2. allocate `request_id`;
3. emit `requested`;
4. suspend the gated action.

At the transport/UI layer:
1. deliver the request;
2. only when a decision-capable surface receives it, emit `surfaced`;
3. optionally emit `acknowledged` after explicit operator interaction;
4. send terminal decision back to runtime.

At the controller:
1. enforce surface deadline;
2. retry **delivery only** at most `max_surface_retries`;
3. enforce decision deadline;
4. on timeout, deny/cancel and escalate per policy;
5. resume gated action only if terminal state is `approved`;
6. verify execution exactly once.

## 6. Subagent integration
Do not assume a child can display its own prompt. Bind child approval requests to a parent/controller route. Before dispatching unattended child work, confirm the selected route can surface decisions. If not, either pre-authorize only the narrowly allowed action through normal policy configuration or avoid dispatching approval-gated work. Never switch to broad bypass solely for liveness.

## 7. Observability
Export counts and histograms for:
- `approval_requested_total`
- `approval_surfaced_total`
- `approval_terminal_total{state}`
- `approval_surface_latency_seconds`
- `approval_decision_latency_seconds`
- `approval_surface_timeout_total`
- `approval_decision_timeout_total`
- `approval_orphan_event_total`
- `approval_delivery_retry_total`

Do not put full command text, secrets, file contents, or MCP payloads into metric labels.

## 8. Incident recovery
When a workflow stalls:
1. run watchdog against the event stream at current time;
2. inspect the earliest blocking request;
3. retry only surface delivery if within retry budget;
4. otherwise transition to configured safe terminal fallback;
5. ensure the original gated action has not executed;
6. re-dispatch only after state is unambiguous.

## 9. Release gate
Before enabling in production, require an independent verifier to demonstrate:
- hidden-surface fixture is detected;
- slow decision expires/cancels without approval;
- unknown terminal event is rejected;
- subagent without route is rejected;
- duplicate/post-terminal events are rejected;
- normal approve and deny flows remain functional;
- no permission mode was weakened.
