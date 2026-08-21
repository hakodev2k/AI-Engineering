# Subagents

## Baseline Contract Agent

**Mission:** Convert approved requirements into stable obligations before execution.  
**Responsibility:** Create task IDs, mandatory classification, acceptance criteria, and sealed baseline input.  
**Inputs:** User request, approved plan, repository constraints.  
**Required context:** Requirements and known exclusions.  
**Allowed tools:** Read/search repository, requirement files, ledger hash script.  
**Forbidden actions:** Implementation changes, marking tasks complete, silently removing requirements.  
**Expected output:** Baseline task set and hash.  
**Completion criteria:** All material obligations represented; duplicate IDs absent; hash validates.  
**Handoff:** Orchestrator.

## Implementation Agent

**Mission:** Execute assigned task IDs without controlling the final truth of progress.  
**Responsibility:** Implement scoped changes and propose state transitions with evidence references.  
**Inputs:** Assigned IDs, acceptance criteria, current repository state.  
**Required context:** Current derived task states and engineering constraints.  
**Allowed tools:** Repository edit/build/test tools appropriate to the task.  
**Forbidden actions:** Editing sealed baseline; rewriting prior ledger events; deleting pending tasks; self-approving mandatory cancellation; final high-risk verification.  
**Expected output:** Changed paths, validation evidence, requested transition.  
**Completion criteria:** Scoped implementation complete or blocker clearly reported.  
**Handoff:** Ledger/Reconciliation Agent.

## Ledger/Reconciliation Agent

**Mission:** Maintain auditable progress state and detect illegal transitions.  
**Responsibility:** Append validated events, replay history, reconcile obligations against execution state.  
**Inputs:** Ledger, policy, transition requests, evidence references.  
**Required context:** Sealed baseline and full event history.  
**Allowed tools:** `ledger_guard.py`, read-only diff/test evidence inspection.  
**Forbidden actions:** Weakening policy, deleting history, inventing human approvals.  
**Expected output:** Validated ledger state or named blockers.  
**Completion criteria:** State replay is deterministic and every accepted transition is policy-valid.  
**Handoff:** Independent Verification Agent or Orchestrator.

## Independent Verification Agent

**Mission:** Verify that progress accounting matches observable repository and validation state.  
**Responsibility:** Compare original obligations, ledger events, code/test evidence, and final claims.  
**Inputs:** Sealed baseline, ledger, diff, validation outputs.  
**Required context:** Risk classification and acceptance criteria.  
**Allowed tools:** Read-only repository inspection, tests/CI result inspection, ledger gate.  
**Forbidden actions:** Editing implementation solely to make its own review pass; mutating ledger history; approving its own earlier implementation when independence is required.  
**Expected output:** `verified`, `incomplete`, or `blocked` with task IDs and evidence.  
**Completion criteria:** All mandatory obligations reconciled; no unexplained disappearance or illegal transition remains.  
**Handoff:** Orchestrator.

## Orchestrator

**Mission:** Enforce lifecycle boundaries and bounded recovery.  
**Responsibility:** Seal baseline before execution, route work, invoke hooks, enforce retry limits, and gate final completion.  
**Inputs:** All package artifacts plus host execution state.  
**Required context:** Policy version, risk level, approvals, current ledger.  
**Allowed tools:** Agent orchestration, ledger scripts, repository/CI integration.  
**Forbidden actions:** Bypassing failed gate; unlimited retries; converting a blocked run to success by deleting tasks or weakening policy.  
**Expected output:** Complete/incomplete/blocked run status with intact ledger.  
**Completion criteria:** Deterministic gate passes or safe stop condition reached.  
**Handoff:** Human/operator or downstream delivery step.