# Provider Quota Admission Breaker

**Category:** Performance

## Problem
After a provider resource is authoritatively known to be exhausted, multi-agent orchestration can still dispatch more requests against the same resource. Those calls cannot make progress and repeat cost, latency, model turns, retries, and quota consumption.

## Evidence
See `evidence/research.md`. Current signals include `openai/codex#39582`, `#16891`, and `#30471`. The evidence distinguishes typed terminal exhaustion from ambiguous HTTP 403/429 behavior.

## Existing approach
Typical systems rely on per-request retry/backoff, user-visible rate-limit errors, local token budgets, or manual model switching. These mechanisms do not necessarily prevent later siblings/follow-up tasks from rediscovering the same terminal provider state.

## Existing limitations
- Failure reason can be flattened before orchestration sees it.
- Resource scope can be lost.
- Per-request retries repeat known failures.
- Global cancellation would incorrectly stop unrelated work.
- HTTP status alone is too ambiguous for a safe shared breaker.

## Proposed improvement
A conservative resource-scoped admission breaker. It trips only from machine-readable terminal exhaustion plus authoritative resource identity; blocks later matching requests before network dispatch; leaves unrelated providers and local/MCP work running; and permits one generation-safe half-open probe after reset/cooldown.

## Architecture
```text
provider-quota-admission-breaker/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-model-admission.md
├── rules/
│   └── provider-resource-admission.md
├── scripts/
│   └── quota_gate.py
├── skills/
│   └── quota-admission-analysis.md
├── subagents/
│   └── quota-evidence-analyst.md
├── tests/
│   ├── fixtures.json
│   └── test_quota_gate.py
└── workflows/
    └── diagnose-and-deploy.md
```

## Installation
Requires Python 3.10+ only for the deterministic reference script/tests. Production runtimes can implement the same state machine in their native language.

## Configuration
Define an authoritative `resource_key` policy. Prefer the finest stable provider boundary available without exposing credentials, for example a redacted/hash identity derived from provider + deployment + credential slot + model/quota bucket. Unknown scope must remain request-local.

Runtime state example:
```json
{
  "resources": {
    "openai:acct-a:gpt-x": {
      "status": "closed",
      "generation": 4,
      "reset_at": "2026-08-20T07:00:00Z",
      "probe_claimed": false
    }
  }
}
```

## Usage
Evaluate a request before network dispatch:
```bash
python scripts/quota_gate.py decision --state runtime/quota-state.json --request runtime/request.json
```
Exit code 3 represents an intentional denial; exit code 2 represents invalid input/state.

Verify packaged scenarios:
```bash
python scripts/quota_gate.py verify tests/fixtures.json
python -m unittest tests/test_quota_gate.py
```

## Workflow
Follow `workflows/diagnose-and-deploy.md`: Observe → baseline → diagnose → hypothesis → implement → measure again → independent verification. Maximum two implementation iterations.

## Metrics
- Same-resource provider calls after terminal trip: target **0**.
- Unrelated-resource/local work incorrectly denied: target **0** in regression fixtures.
- Half-open probes: target **≤1 per generation**.
- Avoided provider calls and post-exhaustion quota/cost.
- Admission decision p95 latency.
- Time from reset to verified recovery.

## Verification
The package includes deterministic mixed-resource fixtures covering closed-resource denial, unrelated-resource continuation, local-work continuation, unknown scope, first half-open probe, and second-probe rejection. Runtime integration should additionally race a dispatch against breaker activation and prove no matching request escapes after the state generation changes.

## Safety
The gate is deliberately conservative. It never derives a shared terminal condition from free text or an HTTP status alone, never exposes credential material in resource keys/logs, and never uses global cancellation as the default response.

## Failure handling
**Detection:** post-trip provider call, false-positive denial, invalid state, or recovery probe race. **Evidence:** admission log + request resource key + generation. **Retry:** at most two implementation iterations; one half-open probe per generation. **Fallback:** request-local failure when resource scope is uncertain. **Escalation:** require human/platform-owner review for broader cancellation or irreversible state changes. **Stop condition:** ambiguous evidence or repeated regression.

## Definition of Done
- **Implemented:** typed resource state, pre-dispatch admission, bounded recovery semantics, scripts/tests and operator rules exist.
- **Measured:** baseline and optimized post-exhaustion call counts are collected in the target runtime.
- **Verified:** no same-resource request is dispatched after a confirmed trip in the regression workload; unrelated work continues; ambiguous status does not open a shared breaker; half-open probes are bounded; no secrets are logged.

The reusable package itself provides the implementation/reference checks; production performance improvement is not considered verified until the target runtime captures before/after metrics.

## Customization
Adapt the resource key and typed error mapping to the provider while preserving the rules in `rules/provider-resource-admission.md`. Do not broaden scope merely to increase avoided-call counts.