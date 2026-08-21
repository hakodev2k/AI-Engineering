# Verification Report

## Verification model
This report separates package completeness from deployment-specific OAuth verification. The package must not claim that a real provider/account has been repaired without running against that provider.

## Implemented
- Evidence-backed problem definition and source list.
- Single-writer refresh lease contract.
- Generation re-read after lease acquisition.
- Generation compare-and-swap guard before metadata commit.
- Atomic metadata replacement for the local reference implementation.
- Scope-expansion rejection.
- Secret-like metadata field rejection.
- Wrong-owner lease-release rejection.
- Child-generation rebind/quarantine workflow.
- Bounded retry/error-classification rules.
- Redacted lifecycle audit script.
- Synthetic unit tests for lease ownership, CAS conflict, generation monotonicity, scope checks and secret-field rejection.

## Measured
The package defines the following measurable runtime counters/invariants for an integration:
- refresh executions per credential generation;
- lease contention and wait duration;
- CAS conflict count;
- committed generation monotonicity;
- child generation divergence and rebind latency;
- post-rotation 401 rate;
- retry count by OAuth error classification;
- secret scanner findings in auth logs.

No real OAuth provider/account is contacted by the package generation itself; therefore provider latency, production 401 reduction and real child-rebind success are not fabricated here.

## Package verification checks
1. Scripts intentionally operate on non-secret metadata and reject common token/secret fields.
2. `credential_lease_guard.py` has bounded commands with meaningful non-zero exit codes for busy lease, owner mismatch and generation conflict.
3. The commit path requires `new_generation = expected + 1` and rejects scope expansion.
4. The workflow requires re-reading generation after waiting for the lease, preventing a contender from refreshing based on a stale pre-wait observation.
5. Unknown refresh outcome is explicitly reconciled before retry, which matters when a provider rotates refresh tokens on successful use.
6. Rules forbid parallel refresh, blind 401 retry, raw-token logging, stale-generation overwrite and silent child failure.
7. The implementing Refresh Coordinator is not the sole verifier; the Verification Agent is independent.
8. Recovery loops are bounded by policy defaults (`max_refresh_attempts=2`, `max_auth_probe_attempts=2`).

## Required integration verification before production status = Verified
Run all of the following in the target runtime:

```bash
python -m unittest tests/test_credential_lease_guard.py
python scripts/credential_state_audit.py auth-events.jsonl --policy config/policy.json
```

Then execute provider-mocked concurrency tests with >=16 simultaneous refresh contenders and fault injection at these boundaries:
- before provider call;
- after provider success but before secret/metadata commit;
- after commit but before generation event;
- during child rebind.

A production integration is **Verified** only if:
- provider refresh call count for one old generation is exactly 1 under concurrency;
- stale CAS writes are rejected;
- no committed generation is malformed or regresses;
- no child performs authenticated requests with a superseded generation after grace period;
- parent/child authenticated probes succeed;
- secret scanning reports zero token values;
- deterministic OAuth failures do not enter retry loops.

## Failure handling
If any required check fails, status remains **Implemented** or **Measured**, not **Verified**. Preserve redacted evidence, stop automatic refresh when state is ambiguous, quarantine stale workers, and require human re-authentication for revoked/invalid grants.

## Definition of Done for an integration
- Evidence/baseline captured.
- One refresh authority established.
- Credential generation metadata available.
- Atomic secret+metadata commit semantics documented.
- Child binding/rebind implemented.
- Concurrency and crash-boundary tests pass.
- Metrics collected and compared with baseline.
- Auth probe succeeds on parent and child paths.
- No secrets found in logs/traces.
- Risks/provider-specific rotation semantics documented.
- No blocking verification issue remains.
