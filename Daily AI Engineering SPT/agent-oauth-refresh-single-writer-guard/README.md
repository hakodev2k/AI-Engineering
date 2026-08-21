# Agent OAuth Refresh Single-Writer Guard

## Topic
Prevent stale-token child failures, concurrent refresh races, and credential-state corruption in long-running AI-agent fleets.

## Category
**Security** — OAuth credential lifecycle, service identity, secret handling, authn/authz boundaries, safe recovery.

## Problem
Long-running parents, background agents, workflow workers, daemons, and remote-control processes can cross OAuth token-expiry/rotation boundaries. If each worker snapshots a token at spawn, if several processes refresh the same rotating refresh token, or if refresh persistence is incomplete/non-atomic, the system may enter correlated 401 failures, forced re-login, stale child execution, or last-writer-wins credential corruption.

The problem is especially dangerous for agents because failures can occur after hours of autonomous work and may trigger blind retries or silent child loss.

## Evidence
Current public signals are documented in [`evidence/research.md`](evidence/research.md). The strongest recent signals include Claude Code issues opened in August 2026 describing child-only 401 failures across parent refresh, duplicate proactive refresh scheduling, and refresh persistence missing required metadata. RFC 6749 and RFC 9700 provide the protocol/security baseline; they do not define a complete client-side multi-process refresh orchestration contract.

## Existing approach
Common implementations rely on one or more of:
- refresh-on-401;
- proactive expiry timers;
- a shared credential file;
- independent worker refresh;
- token snapshots captured at worker spawn;
- provider-side refresh-token rotation/replay protection.

## Existing limitations
These approaches can leave stale children alive after parent refresh, allow concurrent rotation attempts, overwrite newer generations, persist incomplete credential state, or retry deterministic authorization failures. Manual `/login` may recover an interactive session but is not an unattended reliability/security design.

## Proposed improvement
Treat OAuth refresh as a single-writer state transition rather than a convenience API call:

```text
Observe generation
  -> Acquire exclusive refresh lease
  -> Re-read generation
  -> If advanced: adopt winner
  -> Else refresh once
  -> Validate response/scopes/expiry
  -> CAS + atomic commit generation G+1
  -> Emit secret-free generation event
  -> Rebind/quarantine stale children
  -> Authenticated verification probes
  -> Release lease
```

Raw token material remains in the host application's secret plane. The scripts in this package intentionally operate only on non-secret metadata.

## Architecture

### Secret plane
Existing credential broker, OS keychain, encrypted DB, secret manager, or provider-specific credential store. Only trusted auth code reads/writes token material.

### Metadata/control plane
`credential_id`, monotonic `generation`, expiry, scopes, update time, lease owner, child binding, and redacted lifecycle events.

### Verification plane
Independent audit/tests verify single-writer behavior, generation monotonicity, child convergence, bounded retries, authenticated recovery, and secret silence.

## Package structure

```text
agent-oauth-refresh-single-writer-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── credential_lease_guard.py
│   └── credential_state_audit.py
├── tests/
│   └── test_credential_lease_guard.py
└── verification/
    └── report.md
```

## Installation
Requires Python 3.10+ for the reference scripts. No third-party packages are required.

```bash
python scripts/credential_lease_guard.py --help
python scripts/credential_state_audit.py --help
python -m unittest tests/test_credential_lease_guard.py
```

The local directory lease is a reference primitive for a single host/filesystem. For multiple machines, replace it with a distributed lease/transaction mechanism that provides the same single-writer and ownership semantics.

## Configuration
See [`config/policy.json`](config/policy.json).

Key defaults:
- 30-second refresh lease TTL;
- 5-minute proactive refresh skew;
- 15-second child rebind grace;
- maximum 2 refresh attempts;
- deterministic OAuth errors fail closed;
- atomic persistence, single writer, generation CAS and child rebind are required.

Provider-specific integrations should tune timings and error classifications without removing the invariants in [`rules/engineering-rules.md`](rules/engineering-rules.md).

## Usage

### Inspect non-secret metadata

```bash
python scripts/credential_lease_guard.py inspect \
  --state runtime/credential-metadata.json
```

### Acquire refresh authority

```bash
python scripts/credential_lease_guard.py acquire \
  --root .auth-guard \
  --credential provider-account-1 \
  --owner worker-123 \
  --ttl 30
```

A busy/non-zero result means the caller must **not** invoke the provider refresh endpoint. It should wait briefly, then re-read the current generation.

### Revalidate before commit

```bash
python scripts/credential_lease_guard.py check-generation \
  --state runtime/credential-metadata.json \
  --expected 12
```

### Audit lifecycle events

```bash
python scripts/credential_state_audit.py auth-events.jsonl \
  --policy config/policy.json
```

Only redacted lifecycle events should enter the audit log.

## Workflow
Use [`workflows/workflows.md`](workflows/workflows.md) for three complete flows:
1. diagnose OAuth generation failure;
2. refresh and rebind;
3. concurrency regression test.

Detailed integration sequencing is in [`guide-intergration.md`](guide-intergration.md).

## Skills
[`skills/core-skills.md`](skills/core-skills.md) includes reusable procedures for:
- credential generation diagnosis;
- single-writer refresh;
- child credential rebind;
- auth recovery verification.

Each skill defines triggers, inputs, procedure, decisions, constraints, metrics, failure handling and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) provides enforceable **MUST / MUST NOT / SHOULD** rules. Important invariants include:
- at most one refresh execution per credential generation;
- no stale-generation overwrite;
- no raw-token logging;
- no blind/unbounded 401 retry;
- stale children converge or are quarantined;
- interactive re-authentication requires human action.

## Delegation
[`subagents/subagents.md`](subagents/subagents.md) separates evidence analysis, refresh execution, child rebind and verification. The Refresh Coordinator is intentionally not the sole verifier.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines predictable enforcement points for pre-dispatch binding, pre-refresh lease acquisition, pre-commit CAS, post-commit rebind, incident audit and final verification.

## Metrics
Track at minimum:
- refresh executions per old generation;
- lease contention/wait duration;
- CAS conflicts;
- committed generation monotonicity;
- active child generations;
- child rebind latency;
- 401/403 rate by generation/process type;
- retry count by classified OAuth error;
- authenticated probe success;
- secret scanner findings.

Target invariants:
- **refresh executions/generation <= 1**;
- **stale child requests after grace = 0**;
- **accepted malformed generations = 0**;
- **secret values in logs = 0**;
- **unbounded retries = 0**.

## Verification
See [`verification/report.md`](verification/report.md).

The package distinguishes:
- **Implemented:** guard logic/integration exists;
- **Measured:** runtime metrics have been captured;
- **Verified:** concurrency, crash-boundary, child-rebind, authenticated-probe, and secret-scan checks all pass in the target runtime/provider.

This repository package does not claim a real provider/account is verified merely because its reference files were generated.

## Safety
- Refresh tokens never belong in prompts, model-visible context, traces, metric labels, or generated incident reports.
- Do not automate interactive consent/re-login as a recovery shortcut.
- Do not downgrade TLS, scopes, token binding, replay protection, or provider-side security controls for availability.
- If refresh outcome is ambiguous, reconcile state before retrying; a successful rotating refresh may already have invalidated the old token.
- Quarantine stale children rather than silently continuing with invalid credentials.

## Failure handling

### Detection
401/403 bursts, parent/child generation divergence, duplicate refresh owners, malformed metadata, CAS conflicts, repeated re-login.

### Evidence
Use redacted events and `credential_state_audit.py`; keep secret material out of diagnostics.

### Retry policy
Default maximum two refresh attempts, only for policy-listed transient failures. Deterministic OAuth errors stop immediately.

### Fallback
Adopt a newer generation written by another owner; preserve last committed state; quarantine stale children; require explicit human re-auth when the grant is invalid/revoked.

### Escalation
Escalate when refresh outcome is ambiguous, generation cannot be reconciled, provider rotation semantics are unknown, or retry budget is exhausted.

### Stop condition
No further automatic refresh occurs once a deterministic failure or unreconciled state is reached.

## Definition of Done
An integration is complete only when:
- current evidence/baseline is documented;
- a single refresh authority is enforced;
- generation metadata is monotonic and observable;
- stale writes are rejected;
- secret+metadata persistence is atomic as one logical operation;
- child rebind/quarantine is implemented;
- bounded recovery/error classification is implemented;
- concurrency and crash-boundary tests pass;
- parent/child authenticated probes pass;
- metrics improve or remain within agreed thresholds;
- secret scan reports no token leakage;
- provider-specific refresh semantics and residual risks are documented;
- independent verification reports no blocking issue.

## Customization
Replace the reference filesystem lease with Redis/SQL/etcd/Consul/cloud-lock primitives as needed, but keep ownership, TTL, generation re-read and CAS semantics. Adapt child rebind to your agent framework, SDK client factory, MCP host, job runner, or worker pool. Keep the model outside the secret plane and keep all retry loops bounded.
