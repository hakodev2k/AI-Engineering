# MCP OAuth Poisoned Provider Recovery Guard

**Category:** Performance

## Problem
Long-lived MCP clients can rebuild a failed transport while reusing an unhealthy OAuth provider object. Current 2026 reports show lock/auth-flow failures and integrations that remain parked through repeated reconnects while a fresh process/provider connects successfully.

## Evidence
See `evidence/research.md` for current reports, approaches, limitations, and root causes.

## Existing approach
Transport/session reconnect with backoff, cached OAuth providers/token stores, token-refresh retry, and whole-gateway restart as last resort.

## Existing limitations
Transport recreation may retain corrupted provider state; backoff does not repair state; gateway restart disrupts healthy integrations; retry loops may be effectively unbounded; provider generations are often unobservable.

## Proposed improvement
Classify provider-poison signals separately from ordinary transport failure, track provider generations, recreate the provider within a bounded budget, and open a circuit instead of retrying forever.

## Architecture
- `config/recovery_policy.json` — bounded retry/recreation policy.
- `scripts/oauth_recovery_guard.py` — JSONL trace analyzer/state machine.
- `tests/test_oauth_recovery_guard.py` — regression suite.
- `skills/provider-aware-recovery-analysis.md` — measurement/diagnosis skill.
- `rules/bounded-provider-recovery.md` — enforceable liveness/security rules.
- `subagents/mcp-recovery-investigator.md` — independent verifier.
- `workflows/measure-diagnose-recover.md` — main recovery flow.
- `workflows/benchmark-and-regression.md` — before/after verification.
- `hooks/reconnect-preflight.md` — integration point.
- `evidence/research.md` — research record.

## Actual package tree
```text
.
├── README.md
├── config/recovery_policy.json
├── evidence/research.md
├── hooks/reconnect-preflight.md
├── rules/bounded-provider-recovery.md
├── scripts/oauth_recovery_guard.py
├── skills/provider-aware-recovery-analysis.md
├── subagents/mcp-recovery-investigator.md
├── tests/test_oauth_recovery_guard.py
└── workflows
    ├── benchmark-and-regression.md
    └── measure-diagnose-recover.md
```

## Installation
Python 3.10+; standard library only. The reference script does not perform OAuth or access credentials.

## Configuration
Tune retry/recreation thresholds in `config/recovery_policy.json` from measured traces. Do not raise bounds merely to suppress alerts.

## Usage
Create a JSONL trace with `server` and `event` (`connect_failure`, `timeout`, `lock_error`, `provider_recreated`, `success`) then run:

```bash
python scripts/oauth_recovery_guard.py trace.jsonl --policy config/recovery_policy.json --output report.json
```

Exit `0` means no server ended circuit-open; `2` means at least one circuit is open; `4` means invalid input/config.

## Workflow
Measure → diagnose → hypothesize → integrate provider-aware recovery → measure again → bounded re-evaluation → independent verification.

## Metrics
Time-to-recovery; attempts; provider recreations; circuit opens; p50/p95 connect latency; parked duration; warnings/hour; recovery without process restart; unrelated-server disruption.

## Verification
```bash
python -m unittest discover -s tests -v
```
The suite validates state-machine invariants; production verification additionally requires replay/measurement on real redacted traces.

## Safety
The package never reads tokens. Logs must redact credentials. Recovery is server-scoped. It does not recommend unbounded retries or global restart as an automatic action.

## Failure handling
Unknown failures remain unknown. Exhausted retries/recreations open a circuit and escalate. Maximum two fix/retest iterations per workflow.

## Definition of Done
- **Implemented:** all package files exist and analyzer executes.
- **Measured:** baseline and candidate recovery traces have comparable metrics.
- **Verified:** lock poison triggers provider recreation; retries/recreations are bounded; healthy success resets counters; server isolation test passes; independent verification complete.

## Customization
Hosts should map state-machine actions to their own transport/provider factory while preserving `rules/bounded-provider-recovery.md`.
