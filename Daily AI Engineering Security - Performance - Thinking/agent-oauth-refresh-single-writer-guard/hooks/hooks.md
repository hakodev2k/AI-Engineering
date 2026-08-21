# Hooks

## Hook 1 — Pre-Agent Dispatch Credential Binding
**Trigger:** before a long-running/background child is spawned.

**Action:** read non-secret credential metadata, record `credential_id` and `generation` in child registry, bind the child to a reloadable credential provider/reference.

**Command/script:** integration-specific broker call; optionally `python scripts/credential_lease_guard.py inspect --state <metadata.json>`.

**Expected result:** child starts with a generation reference, not a token copied into its prompt/config.

**Failure behavior:** block authenticated child dispatch if current generation metadata is malformed or unavailable.

---

## Hook 2 — Pre-Refresh Single-Writer Gate
**Trigger:** refresh skew reached or an expiry-classified failure requests refresh.

**Action:** acquire exclusive credential lease, then re-read current generation.

**Command/script:** `python scripts/credential_lease_guard.py acquire --root .auth-guard --credential <id> --owner <process-id>`.

**Expected result:** exactly one owner receives exit code 0; contenders receive a busy result and must re-read state rather than refresh in parallel.

**Failure behavior:** no lease means no refresh. Expired leases may be reclaimed only under configured TTL semantics.

---

## Hook 3 — Pre-Commit Generation CAS
**Trigger:** immediately before persisting refreshed credential material.

**Action:** verify metadata state's current generation still equals the generation used to obtain the refresh result.

**Command/script:** `python scripts/credential_lease_guard.py check-generation --state <metadata.json> --expected <generation>`.

**Expected result:** exit 0 only when generation matches and metadata schema is valid.

**Failure behavior:** discard the stale refresh result from the commit path, re-read current state, and reconcile. Never overwrite the newer generation.

---

## Hook 4 — Post-Commit Child Rebind
**Trigger:** atomic credential generation commit succeeds.

**Action:** emit a secret-free `{credential_id, generation, updated_at}` event and mark older children `REBIND_REQUIRED`.

**Expected result:** children converge within `child_rebind_grace_seconds` or are quarantined.

**Failure behavior:** parent workflow cannot claim complete while required child work is authenticated with a stale generation.

---

## Hook 5 — Post-Incident Audit
**Trigger:** auth incident closes or a refresh implementation changes.

**Action:** analyze redacted event JSONL for overlapping refreshes, generation regressions, stale child use, retry-budget violations and suspicious secret-looking fields.

**Command/script:** `python scripts/credential_state_audit.py events.jsonl --policy config/policy.json`.

**Expected result:** exit 0 and a JSON summary with zero critical violations.

**Failure behavior:** block verification/deployment; preserve evidence and escalate.

---

## Hook 6 — Final Verification
**Trigger:** before marking recovery/package integration verified.

**Action:** run synthetic tests plus authenticated non-destructive probes in the host integration.

**Command/script:** `python -m unittest tests/test_credential_lease_guard.py` plus integration-specific probe.

**Expected result:** single-writer and CAS tests pass; all active children current/quarantined; no token values in collected logs.

**Failure behavior:** status remains Implemented or Measured, never Verified.
