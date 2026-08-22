# Consensus Lifecycle Hooks

## pre-disagreement
**Trigger:** material conflict is detected.
**Preconditions:** participant identities and disputed subject are known.
**Action:** create the disagreement record and compute its fingerprint.
**Command:** `python scripts/fingerprint-disagreement.py <record>`
**Expected result:** one stable fingerprint for the current disagreement revision.
**Failure behavior:** block conflict resolution until the record is structurally valid.
**Blocking:** yes.

## pre-round
**Trigger:** before round 2 or later.
**Preconditions:** previous round record exists.
**Action:** validate the current record and verify an evidence delta exists.
**Commands:**
- `python scripts/validate-disagreement.py <current>`
- `python scripts/evaluate-deadlock.py <current> --previous <previous> --policy config/consensus-policy.json`
**Expected result:** status `continue` or a terminal escalation.
**Failure behavior:** do not start another debate round.
**Blocking:** yes.

## pre-dangerous-evidence-action
**Trigger:** evidence collection would mutate production, data, infrastructure, secrets, security controls, Git history, or public contracts.
**Action:** stop and obtain explicit human approval under the parent workflow.
**Expected result:** approval evidence bound to the exact action/scope.
**Failure behavior:** preserve the unmet evidence requirement and escalate.
**Blocking:** yes.

## pre-final-consensus
**Trigger:** a disagreement is marked resolved.
**Preconditions:** resolution reason and mode are present; high-risk review exists when required.
**Action:** run final deterministic gate.
**Command:** `python scripts/evaluate-final-gate.py <record> --policy config/consensus-policy.json [--review <review>] [--planner <coordinator-id>]`
**Expected result:** `verified`.
**Failure behavior:** return the reported review-required/human-decision-required/blocked state; never reinterpret failure as consensus.
**Blocking:** yes.

## post-resolution
**Trigger:** final gate returns verified.
**Action:** preserve the resolved record, evidence IDs, rejected positions, final fingerprint, and reviewer record.
**Expected result:** parent workflow receives a reproducible resolution artifact.
**Blocking:** yes if evidence cannot be persisted.
