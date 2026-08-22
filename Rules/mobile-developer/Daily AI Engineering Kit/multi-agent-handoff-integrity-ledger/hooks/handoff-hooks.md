# Handoff Hooks

## PreHandoffWrite
**Trigger:** producer is about to persist a handoff record.

**Action:** validate the record against policy and required fields.

**Command:**
```bash
python scripts/validate-handoff.py --policy config/handoff-policy.json --record "$HANDOFF_RECORD"
```

**Failure behavior:** block persistence. Do not downgrade validation failure to warning.

## PreHandoffReceive
**Trigger:** receiving actor is about to consume an accepted candidate.

**Action:** recompute referenced artifact fingerprints.

**Command:**
```bash
python scripts/verify-artifacts.py --record "$HANDOFF_RECORD" --repo-root "${REPO_ROOT:-.}"
```

**Failure behavior:** block stage start and require handoff regeneration from current evidence.

## PostMaterialChange
**Trigger:** implementation changes a file referenced by the accepted handoff.

**Action:** mark the handoff stale in the orchestrator state and require a new handoff before further delegation.

**Command:** host-specific orchestration action; deterministic detection may reuse `verify-artifacts.py`.

**Failure behavior:** do not continue downstream delegation with stale evidence.

## PreDangerousAction
**Trigger:** receiving stage plans a dangerous action listed in `rules/handoff-governance.md`.

**Action:** verify an explicit applicable human approval reference exists in the current handoff or obtain a new one.

**Failure behavior:** block the action. Approval is never inferred.

## PreComplete
**Trigger:** workflow is about to report success.

**Action:** validate the final handoff and verify artifacts again; check that `verification_state=verified` is present only when verification evidence is referenced.

**Commands:**
```bash
python scripts/validate-handoff.py --policy config/handoff-policy.json --record "$HANDOFF_RECORD"
python scripts/verify-artifacts.py --record "$HANDOFF_RECORD" --repo-root "${REPO_ROOT:-.}"
```

**Failure behavior:** workflow may report `completed-unverified` or `blocked`, but not `verified`.