# MCP Cancellation Terminal Response Guard

**Category:** Performance  
**Status model:** Implemented → Measured → Verified

## Problem
An MCP tool may stop working after a cancel signal yet leave the original request unresolved. Other implementations collapse explicit cancellation into timeout errors, making retry logic unsafe. A single lost terminal event can wedge a shared session or trigger destructive restart/retry behavior.

## Evidence
See `evidence/research.md`. Independent current signals include OpenAI Codex #20925 and #32470, MCP TypeScript SDK #2165, VS Code Copilot #14130, and MCP SEP-1539.

## Existing approach and limitation
Generic request timeout, cancellation notifications, and session restart are insufficient because they do not prove terminal state, do not separate cancellation causes, and may retry side-effecting work whose remote outcome is unknown.

## Proposed improvement
Treat cancellation as a deterministic lifecycle contract. Track each request through `pending`, `cancel_requested`, terminal, or `unknown`; use separate idle and absolute deadlines; wait only a bounded terminal grace period; reconcile unknown outcomes before retry; and quarantine automatic retry for unknown side effects.

## Architecture
```text
MCP tools/call
    |
request lifecycle record
    |
progress / terminal / timeout / user cancel / transport loss
    |
    v
cancellation_guard.py
    |
 +-- continue / await-terminal
 +-- request-cancel
 +-- reconcile
 +-- quarantine side-effect retry
    |
    v
bounded recovery + metrics + independent verification
```

## Package tree
```text
mcp-cancellation-terminal-response-guard/
├── README.md
├── config/
│   └── cancellation-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-cancel.md
├── rules/
│   └── cancellation-contract.md
├── scripts/
│   └── cancellation_guard.py
├── skills/
│   └── cancellation-diagnosis.md
├── subagents/
│   └── protocol-verifier.md
├── tests/
│   └── test_cancellation_guard.py
└── workflows/
    └── cancel-reconcile.md
```

## Installation
Python 3.10+; no third-party dependencies for the reference script or tests. Integrate the lifecycle record at the actual MCP client boundary so state comes from protocol events rather than model text.

## Configuration
`config/cancellation-policy.json` separates:
- `idle_timeout_seconds`: inactivity deadline, reset by real progress.
- `absolute_timeout_seconds`: maximum total request lifetime.
- `cancel_grace_seconds`: bounded wait for terminal response after cancellation.
- `max_reconcile_attempts`: bounded recovery loop.
- retry policy for read-only and side-effecting unknown outcomes.

Tune values from measured tool durations. Never remove deadlines simply because a tool is slow.

## Usage
Create a request-state JSON document from runtime events and evaluate it:
```bash
python scripts/cancellation_guard.py request-state.json \
  --policy config/cancellation-policy.json
```

The caller maps exits to protocol actions as described by `hooks/post-cancel.md`.

## Workflow
Follow `workflows/cancel-reconcile.md`: Observe → measure baseline → diagnose cause → enforce lifecycle deadlines → cancel once → await bounded terminal response → reconcile unknown state → decide retry safety → measure again → independently verify.

## Metrics
In-flight age p50/p95/max, terminal-outcome percentage, cancel-to-terminal latency, unknown outcome rate, session restarts, duplicate effects after retry, and recovery time.

## Verification
Run:
```bash
python -m unittest tests/test_cancellation_guard.py
```
Then perform controlled MCP integration scenarios for normal completion, user cancel, idle timeout, absolute timeout, lost terminal event, and transport loss. `subagents/protocol-verifier.md` defines independent review criteria.

## Safety
- A cancel notification is not proof of cancellation completion.
- Unknown side-effecting requests do not auto-retry by default.
- Progress may reset idle timeout but not the absolute deadline.
- Recovery loops are bounded.
- Preserve request/session evidence before restarting a shared server.
- Do not log secrets or full sensitive tool payloads merely for correlation.

## Failure handling
**Detection:** deadline, cancel grace expiry, missing terminal event, transport loss, or later calls wedging.  
**Evidence:** preserve request ID, session ID, timestamps, reason, and side-effect class.  
**Retry:** bounded reconciliation (default 2); read-only retry only under policy; unknown side effects receive zero automatic retries by default.  
**Fallback:** mark request `unknown`, quarantine unsafe retry, and re-establish the session only when required.  
**Escalation:** MCP/runtime owner or human operator for side-effect ambiguity.  
**Stop condition:** reconciliation budget exhausted or protocol state untrustworthy.

## Definition of Done
### Implemented
Every request is correlated and cancellation/timeout causes are classified outside the model.

### Measured
Baseline and post-control request-age, cancellation, unknown-state, restart, and recovery metrics exist.

### Verified
No tested scenario can remain indefinitely pending; cancellation and timeout are distinguishable in telemetry; unknown side effects cannot auto-retry; bounded reconciliation is enforced; and session recovery does not unnecessarily destroy unrelated work.

## Customization
Adapters can add transport-specific health checks, MCP task/status reconciliation, idempotency-key integration, per-tool timeout profiles, or circuit breakers. Any extension must preserve the invariant that unknown side effects are not blindly replayed.
