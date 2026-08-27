# Tool Approval Context Integrity Gate

**Category:** Security

## Problem
Approval-bearing AI tool calls can lose or substitute the exact arguments, leaf-tool identity, delegation provenance, destination, or consequence context between model output and execution. The result is an approval that does not reliably authorize the action that actually runs.

## Evidence
Current August 2026 evidence and source links are documented in `evidence/research.md`, including independent Agent Client Protocol and Mastra reports plus GitHub's tool-approval security guidance.

## Existing approach
Human approval prompts, static `needsApproval` metadata, tool allow/deny lists, and approval UI cards.

## Existing limitations
These controls can still fail when malformed fields default silently, nested agents hide the privileged leaf action, or the approved call drifts before execution.

## Proposed improvement
Create a canonical approval envelope and bind the decision to a SHA-256 fingerprint of the exact leaf tool, parsed arguments, delegation chain, consequence class, and destination. Recompute immediately before side effects and fail closed on mismatch.

## Architecture
```text
approval request
  -> scripts/approval_guard.py --mode request
  -> canonical envelope + fingerprint
  -> human/policy decision bound to fingerprint
  -> scripts/approval_guard.py --mode execute
  -> exact-match allow OR fail-closed block
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
scripts/approval_guard.py
tests/test_approval_guard.py
skills/approval-context-analysis.md
rules/approval-integrity.md
subagents/security-reviewer.md
workflows/diagnose-and-harden.md
hooks/pre-approval.md
```

## Installation
Requires Python 3.10+ and only the standard library.

## Configuration
Edit `config/policy.json` to classify consequences and control required approval fields. Keep high-risk defaults fail-closed.

## Usage
Generate an approval fingerprint:
```bash
python scripts/approval_guard.py --event approval-request.json --policy config/policy.json --mode request
```

Validate the actual execution against the approved fingerprint:
```bash
python scripts/approval_guard.py --event execution-event.json --policy config/policy.json --mode execute
```

## Workflow
Follow `workflows/diagnose-and-harden.md`: Observe -> Measure baseline -> Diagnose -> Form hypothesis -> Implement -> Measure again -> independently verify. Retries are bounded to two.

## Metrics
- Approval-envelope completeness rate.
- Fingerprint mismatch blocks.
- Missing/unparseable argument blocks.
- Nested leaf-tool visibility rate.
- High-risk consequence/destination coverage.
- Regression-test pass rate.

## Verification
Run:
```bash
python -m unittest tests/test_approval_guard.py
```
Required attack fixtures: argument drift, missing/unparsed input, and hidden leaf tool. Exact benign approved calls must still pass.

## Safety
Never log secrets inside the approval envelope. High-risk execution is blocked on missing context or mismatch. The implementing agent cannot be the sole verifier.

## Failure handling
**Detection:** non-zero guard exit or failed regression.  
**Evidence:** reason codes plus redacted envelope/fingerprint.  
**Retry policy:** maximum two diagnosis/implementation revisions.  
**Fallback:** disable the affected high-risk tool or require manual out-of-band execution.  
**Escalation:** security/release owner.  
**Stop condition:** irreversible action with ambiguous approval, secret exposure, or exhausted retries.

## Definition of Done
**Implemented:** request and execution gates integrated.  
**Measured:** baseline and post-change integrity metrics captured.  
**Verified:** unit tests pass, independent reviewer confirms exact request/execution binding, no secrets are exposed, and no blocking issue remains.

## Customization
Add consequence classes and destination rules for your platform, but do not weaken exact fingerprint binding for convenience.
