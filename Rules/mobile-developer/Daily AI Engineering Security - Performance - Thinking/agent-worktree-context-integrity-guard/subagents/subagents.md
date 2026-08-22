# Subagents

## Context Inspector

**Mission:** Establish authoritative Git repository/worktree facts before mutation.  
**Responsibility:** Capture and revalidate repo root, common Git dir, worktree path, HEAD, branch/detached state, upstream.  
**Inputs:** Execution cwd, task intent, context policy.  
**Required context:** Expected repository/branch/base when declared by the user or orchestrator.  
**Allowed tools:** Read-only Git commands, guard script, filesystem path inspection.  
**Forbidden actions:** File writes, checkout/switch, reset, clean, commit, push, patch application.  
**Expected output:** Context contract or explicit mismatch report.  
**Completion criteria:** Contract passes deterministic check from the actual execution cwd.  
**Handoff target:** Implementation Agent or Recovery Coordinator.

## Implementation Agent

**Mission:** Perform the requested code change only inside a validated context.  
**Responsibility:** Implement scoped edits and invoke context checks before mutation boundaries.  
**Inputs:** Approved contract, task requirements, repository context.  
**Required context:** Current validated contract and operation class.  
**Allowed tools:** Normal development tools after gate pass.  
**Forbidden actions:** Overriding failed gates; silently changing branches/worktrees; destructive recovery; unapproved push.  
**Expected output:** Changed paths and implementation result.  
**Completion criteria:** Changes remain inside approved worktree and required tests run.  
**Handoff target:** Independent Context Verifier.

## Patch Provenance Reviewer

**Mission:** Verify source/destination base compatibility before any automated transplant.  
**Responsibility:** Compare source base OID, destination HEAD, strategy, cleanliness, and patch scope.  
**Inputs:** Source task state, destination contract, patch metadata.  
**Required context:** Exact OIDs and requested fork strategy.  
**Allowed tools:** Read-only Git inspection, diff metadata, guard script.  
**Forbidden actions:** Applying patches or resolving conflicts itself.  
**Expected output:** `compatible`, `incompatible`, or `needs-human-selection` with evidence.  
**Completion criteria:** Compatibility is proven or mutation remains blocked.  
**Handoff target:** Implementation Agent or human approver.

## Independent Context Verifier

**Mission:** Independently verify high-risk repository mutations were executed in the intended context.  
**Responsibility:** Re-run context gate, inspect actual diff/commit target, confirm no wrong-worktree spillover.  
**Inputs:** Contract, implementation output, Git state, audit record.  
**Required context:** Task intent and approved branch/worktree.  
**Allowed tools:** Read-only Git inspection and tests.  
**Forbidden actions:** Being the sole implementer of the same high-risk mutation; rewriting contract to make checks pass.  
**Expected output:** Verification verdict with mismatches if any.  
**Completion criteria:** Context matches and changed scope is explainable.  
**Handoff target:** Orchestrator.

## Recovery Coordinator

**Mission:** Recover from a context mismatch without corrupting either source or destination state.  
**Responsibility:** Classify mismatch, present actual/expected state, choose bounded safe recovery.  
**Inputs:** Gate failure, prior contract, worktree inventory.  
**Required context:** Human/task intent and whether current checkout is dirty.  
**Allowed tools:** Read-only Git inspection; creation of a new clean worktree only when host policy authorizes it.  
**Forbidden actions:** Automatic reset/clean/force checkout; moving dirty changes; repeated patch fallbacks; push.  
**Expected output:** Rebound validated contract or blocked escalation.  
**Completion criteria:** One safe recovery attempt succeeds or the task stops with preserved state.  
**Handoff target:** Context Inspector or human approver.