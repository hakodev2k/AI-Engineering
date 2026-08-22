# Hooks

## PreTask — inventory trust roots
**Trigger:** before any model-driven write/tool execution.  
**Action:** run the scanner against the workspace root.  
**Command:** `python3 scripts/nested_trust_guard.py --root . --policy config/policy.json --output .nested-trust-report.json`  
**Expected result:** exit 0 and sanitized report.  
**Failure behavior:** exit 2/3/4 blocks high-risk execution; do not bypass automatically.

## PreDelegation — attest child root
**Trigger:** before changing cwd/project root or spawning a subagent into a child directory.  
**Action:** verify the child has a current trust-report entry and a same/stronger policy attestation.  
**Command/script:** scanner plus host policy-comparison step described in `skills/core-skills.md`.  
**Expected result:** child root classified and allowed.  
**Failure behavior:** remain at parent root; require review.

## PreMetadataWrite — protect persistence surfaces
**Trigger:** planned write matching nested `/.git/`, `/.claude/`, `/.codex/`, or `/.agents/`.  
**Action:** compare exact target with approved metadata-write scope.  
**Expected result:** explicit scoped approval exists.  
**Failure behavior:** block write. Never convert to blanket workspace permission.

## PreGitOutsideSandbox — nested-hook check
**Trigger:** Git operation will run with more privilege than the agent write sandbox.  
**Action:** ensure the current nested-root report contains no unapproved active hooks for the target repository.  
**Expected result:** hook set reviewed/approved or empty.  
**Failure behavior:** stop before Git can trigger deferred code.

## PostChange — topology drift check
**Trigger:** after dependency, submodule, vendor, fixture, agent-setting or repository-structure changes.  
**Action:** rerun scanner and compare root/hook/config counts with baseline.  
**Expected result:** all new roots intentionally classified.  
**Failure behavior:** block finalization and escalate any new unknown root.

## FinalVerification — independent attestation
**Trigger:** before declaring task complete.  
**Action:** Verification Agent reruns scanner and validates actual changed paths against approvals.  
**Expected result:** zero blocking violations, zero unapproved control-file changes.  
**Failure behavior:** completion status remains not verified.
