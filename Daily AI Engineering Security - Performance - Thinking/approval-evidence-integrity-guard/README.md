# Approval Evidence Integrity Guard

**Category:** Security

## Problem
Approval systems can preserve a backend decision while dropping the action, target, requested scope, or rationale from the surface where a human or automated reviewer makes or audits the decision. That converts informed approval into a potentially blind confirmation.

## Evidence
See `evidence/research.md` for current public reports across Claude Code, Codex, remote/mobile approval, and MCP guidance.

## Existing approach
Agent products use permission prompts, hooks, auto-review, remote approval, and audit logs. These mechanisms are useful but are commonly tested per layer rather than as a producer→transport→UI→audit integrity chain.

## Existing limitations
Optional metadata can disappear between layers; generic approval status can remain visible even when the decision subject is missing; cross-client views can disagree; reviewer rationale can be dropped.

## Proposed improvement
Treat decision evidence as a security contract. An affirmative choice is valid only when action, target, scope, and rationale are concrete and, when human approval is required, actually visible to the human. Missing evidence fails closed.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `skills/approval-evidence-review.md` — reusable evidence review procedure.
- `rules/approval-evidence.rules.md` — enforceable invariants.
- `subagents/approval-verifier.md` — independent verification role.
- `workflows/verify-approval-evidence.md` — bounded diagnose/fix/verify workflow.
- `hooks/pre-render-approval-gate.md` — deterministic gate before affirmative rendering.
- `scripts/approval_evidence_guard.py` — dependency-free validator.
- `tests/test_approval_evidence_guard.py` — positive and fail-closed regression tests.

## Package tree
```text
approval-evidence-integrity-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-render-approval-gate.md
├── rules/approval-evidence.rules.md
├── scripts/approval_evidence_guard.py
├── skills/approval-evidence-review.md
├── subagents/approval-verifier.md
├── tests/test_approval_evidence_guard.py
└── workflows/verify-approval-evidence.md
```

## Installation
Requires Python 3.9+ only for the reference validator/tests. Copy the directory into the host policy repository and invoke the hook before rendering affirmative approval choices.

## Configuration
Normalize approval records to JSON fields: `decision`, `action`, `target`, `scope`, `rationale`, `requires_human`, and `human_visible`.

## Usage
```bash
python3 scripts/approval_evidence_guard.py approval-record.json
python3 tests/test_approval_evidence_guard.py
```
Exit `0` = structurally valid; `1` = blocking evidence failure; `2` = invalid input.

## Workflow
Observe → baseline evidence completeness → diagnose first divergence → implement one layer fix → replay fixtures → independent verification. Retries are capped at two implementation cycles per defect.

## Metrics
Evidence-complete approval rate, producer/UI/audit parity rate, malformed affirmative requests blocked, false-block rate, cross-surface divergence count.

## Verification
**Implemented:** validator, rules, workflow, and tests exist.  
**Measured:** run the validator over real approval traces and record completeness/parity metrics.  
**Verified:** independent verifier confirms valid fixtures pass, malformed affirmative fixtures fail closed, and required fields match producer→UI→audit.

## Safety
The package never executes the action being approved. It fails closed on missing evidence and does not infer permission scope from conversational context.

## Failure handling
Detection is deterministic. Preserve the failing request, block the affirmative path, allow deny/cancel, and escalate after two unsuccessful fix/retest cycles. Never weaken evidence requirements to unblock execution.

## Definition of Done
Evidence documented; baseline measured; limitation and root cause identified; guard integrated; tests pass; before/after metrics recorded; independent verification complete; no affirmative approval can proceed with missing required evidence; no blocking issue remains.

## Customization
Hosts may add domain-specific required fields (cost, environment, destination, data classification) but MUST NOT remove action, target, scope, or rationale for privileged affirmative approvals.
