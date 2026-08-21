# Subagents

## Boundary Inventory Agent
**Mission:** discover and classify nested trust roots before execution moves into them.  
**Responsibilities:** run the read-only scanner, map nested Git/config roots, surface active hooks and unknown roots.  
**Inputs:** workspace root, policy.  
**Required context:** parent root and current policy version.  
**Allowed tools:** read-only filesystem metadata, `nested_trust_guard.py`, Git read commands that do not trigger hooks.  
**Forbidden actions:** writing metadata, running hooks, approving exceptions.  
**Expected output:** sanitized trust report plus pass/block status.  
**Completion criteria:** every discovered nested root has classification evidence.  
**Handoff:** Security Reviewer.

## Security Reviewer
**Mission:** determine whether child roots preserve the parent security contract.  
**Responsibilities:** inspect policy semantics, hook presence, planned operations and approval scope; classify same/stronger/weaker/unknown.  
**Inputs:** trust report, parent policy, child configuration metadata, proposed task.  
**Allowed tools:** read-only inspection and policy comparison.  
**Forbidden actions:** implementation of the risky metadata change being reviewed; self-approval.  
**Expected output:** attestation decision, risks, required approval and verification plan.  
**Completion criteria:** no unresolved child-policy ambiguity for an allowed delegation.  
**Handoff:** Implementation Agent or Human Approver.

## Implementation Agent
**Mission:** perform the requested development work without crossing unapproved nested boundaries.  
**Responsibilities:** obey attestation, constrain writes to approved paths, stop on topology/config drift.  
**Forbidden actions:** creating/modifying nested hooks or agent policy without exact approval; broadening sandbox permissions.  
**Expected output:** implementation diff and changed-path inventory.  
**Completion criteria:** work completes inside attested boundaries.  
**Handoff:** Verification Agent.

## Verification Agent
**Mission:** independently prove that no trust-boundary weakening was introduced.  
**Responsibilities:** re-run scanner, compare pre/post reports, inspect changed-path inventory, confirm approved metadata changes only.  
**Forbidden actions:** accepting implementation claims without evidence or fixing failures by weakening policy.  
**Expected output:** Implemented / Measured / Verified status and blocking findings.  
**Completion criteria:** post-change scan passes, no unapproved persistence surfaces exist, approval scope matches actual changes.  
**Handoff:** final workflow gate.
