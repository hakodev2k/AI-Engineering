# Hooks

## PrePlanSnapshot
**Trigger:** Before accepting a non-trivial plan as executable.  
**Action:** Capture trusted workspace state for declared dependencies.  
**Command:** `python scripts/workspace_guard.py capture --root . --snapshot .agent-state/plan.json --files <paths...>`  
**Expected result:** Exit 0 and snapshot ID emitted.  
**Failure behavior:** Do not begin protected implementation.

## PreResumeDriftCheck
**Trigger:** First action after pause/resume/handoff/compaction.  
**Action:** Compare current workspace to last trusted snapshot.  
**Command:** `python scripts/workspace_guard.py check --root . --snapshot .agent-state/plan.json --policy config/policy.json`  
**Expected result:** Exit 0 for no impacting drift; exit 10 for revalidation-required; exit 20 for hard-stop.  
**Failure behavior:** Route to revalidation or stop before mutation.

## PreWriteDriftCheck
**Trigger:** Immediately before Write/Edit/Patch/shell redirection or another source mutation.  
**Action:** Recheck snapshot.  
**Command:** Same `check` command.  
**Expected result:** Only exit 0 permits the mutation.  
**Failure behavior:** Block write; reread/replan. Host integrations must cover every mutation path, not only named editor tools.

## PreEvidenceReuse
**Trigger:** Before citing previous build/test output as current evidence.  
**Action:** Check workspace drift and evidence dependency freshness.  
**Command:** `python scripts/workspace_guard.py check ...` plus evidence dependency evaluation in orchestration.  
**Expected result:** Evidence dependencies unchanged and within configured TTL.  
**Failure behavior:** Mark evidence stale and rerun the minimum relevant verification.

## PostRevalidationSnapshot
**Trigger:** After stale assumptions are repaired.  
**Action:** Capture a new snapshot; retain old snapshot/report.  
**Expected result:** New snapshot self-checks clean.  
**Failure behavior:** Do not resume implementation.

## FinalFreshnessGate
**Trigger:** Immediately before completion/handoff.  
**Action:** Check current workspace after the last source mutation and ensure verification evidence is fresh.  
**Expected result:** Exit 0 plus no stale required evidence.  
**Failure behavior:** Completion remains `Implemented`/`Measured`, not `Verified`; revalidate or stop.
