# Evidence Retention Hooks

## 1. Pre-task evidence boundary
**Trigger:** before collecting task evidence.  
**Preconditions:** task scope and owner known.  
**Action:** define claims, approved evidence sources, sensitivity handling, and artifact directory.  
**Command/script:** procedural; then validate any initial bundle with `scripts/validate-evidence-bundle.py`.  
**Expected result:** no secret values are scheduled for collection; task evidence is scoped.  
**Failure behavior:** block collection of ambiguous/sensitive content.  
**Blocking:** yes.

## 2. Post-evidence bundle validation
**Trigger:** after adding/removing/changing evidence metadata or claim mappings.  
**Preconditions:** `artifacts/evidence-bundle.json` exists.  
**Action:** run:
```bash
python scripts/validate-evidence-bundle.py --bundle artifacts/evidence-bundle.json --policy config/evidence-retention-policy.json --output artifacts/bundle-validation.json
```
**Expected result:** `status=verified` and a current bundle fingerprint.  
**Failure behavior:** do not budget or hand off stale/invalid evidence.  
**Blocking:** yes.

## 3. Context budget hook
**Trigger:** before a long agent handoff, planning refresh, review, or context compaction.  
**Preconditions:** bundle validation is current.  
**Action:** run:
```bash
python scripts/apply-retention-policy.py --bundle artifacts/evidence-bundle.json --validation artifacts/bundle-validation.json --policy config/evidence-retention-policy.json --output artifacts/retention-plan.json
```
**Expected result:** `status=verified`, estimated bytes within budget, sensitive evidence reference-only.  
**Failure behavior:** refresh stale mandatory evidence or rebudget, at most two cycles.  
**Blocking:** yes.

## 4. Critical evidence review hook
**Trigger:** retention plan contains evidence with `importance=critical`.  
**Preconditions:** exact bundle/retention fingerprints available.  
**Action:** independent Evidence Reviewer produces `artifacts/evidence-review.json`.  
**Expected result:** approved review bound to both fingerprints; reviewer differs from implementation owner.  
**Failure behavior:** stale/self/unapproved review blocks.  
**Blocking:** yes when policy requires review.

## 5. Pre-deletion / retention-weakening approval hook
**Trigger:** proposed source-evidence deletion, audit/security artifact removal, production-log purge, policy weakening, or another configured dangerous action.  
**Preconditions:** exact action/scope known.  
**Action:** stop before mutation and request explicit human approval outside the agent.  
**Expected result:** an approval reference bound to the actual action/scope.  
**Failure behavior:** no side effect occurs.  
**Blocking:** yes.

## 6. Final evidence retention gate
**Trigger:** before claiming evidence context is safe for handoff/completion.  
**Preconditions:** current bundle, validation, retention plan and required review/approval.  
**Action:** run:
```bash
python scripts/evaluate-retention-gate.py --bundle artifacts/evidence-bundle.json --validation artifacts/bundle-validation.json --retention artifacts/retention-plan.json --policy config/evidence-retention-policy.json --implementation-owner implementation-agent --review artifacts/evidence-review.json --output artifacts/retention-gate.json
```
Omit `--review` only when it is not required.  
**Expected result:** `status=verified`.  
**Failure behavior:** preserve artifacts and stop.  
**Blocking:** yes.

## 7. Final engineering verification hook
**Trigger:** after evidence retention gate passes.  
**Preconditions:** task implementation/execution completed.  
**Action:** execute the repository's build/tests/static analysis/security/API/database checks required by the actual task.  
**Expected result:** task-specific verification evidence is produced and, if retained, added back through the same bundle process.  
**Failure behavior:** mark engineering claim blocked/failed; a green retention gate does not override failed engineering verification.  
**Blocking:** yes for task success.
