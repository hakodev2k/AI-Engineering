# Skill: Repair Structured Output

## Purpose
Repair a structurally invalid AI payload under a fixed contract without changing meaning or inventing unsupported facts.

## Inputs
Raw output, deterministic validation report, fixed schema, repair-attempt count.

## Process
1. Reject repair if attempt count is already 2.
2. Build the repair contract using `scripts/build_repair_request.py`.
3. Include exact validation findings, not vague instructions.
4. Tell the repairing model to return only corrected JSON.
5. Prohibit schema changes and unsupported fact invention.
6. Preserve the repaired payload as a new artifact; never overwrite raw evidence.
7. Re-run full deterministic validation.
8. If still invalid, permit one further repair attempt only.
9. After two failed attempts, stop and escalate with evidence.

## Expected output
Repaired payload, attempt number, validation report, preserved raw hash.

## Stop conditions
Unknown missing facts, contract change required, security/business rule conflict, repair cap reached, or approval-required action.
