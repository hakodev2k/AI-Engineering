# Lifecycle Hooks

## Pre-tool hook
**Trigger:** before any agent-generated high-impact tool call.  
**Preconditions:** request JSON exists; repository root is known.  
**Action:** run `python scripts/tool_argument_gate.py --request <request.json> --policy config/policy.yaml --repo-root <repo> --output gate-result.json`.  
**Expected:** exit `0`, `2`, or `4` with JSON.  
**Failure:** any other exit blocks execution.  
**Blocking:** yes.

## Post-edit hook
**Trigger:** request arguments, tool name, repository root, or target environment change after a gate result.  
**Action:** invalidate stale gate/approval evidence and rerun the pre-tool hook.  
**Expected:** gate result corresponds to current request.  
**Failure:** block execution.  
**Blocking:** yes.

## Pre-approval execution hook
**Trigger:** gate status `approval_required`.  
**Action:** require `skills/high-risk-command-review.md` and explicit human approval tied to the exact request and target.  
**Expected:** valid approval evidence.  
**Failure:** stop.  
**Blocking:** yes.

## Post-execution verification hook
**Trigger:** after a tool call reports completion.  
**Action:** hand execution evidence to `subagents/tool-request-verifier.md`; run only predefined non-destructive verification checks.  
**Expected:** verification status `verified`.  
**Failure:** report `inconclusive` or `blocked`; do not claim success.  
**Blocking:** yes for workflow completion.

## Package verification hook
**Trigger:** package installation/update.  
**Action:** run `python -m unittest tests/test_tool_argument_gate.py` and `python scripts/verify_package.py`.  
**Expected:** zero exit codes.  
**Failure:** integration is incomplete.  
**Blocking:** yes.
