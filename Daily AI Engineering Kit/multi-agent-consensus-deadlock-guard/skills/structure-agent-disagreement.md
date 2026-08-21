# Skill: Structure Agent Disagreement

## Purpose
Convert an unstructured multi-agent conflict into falsifiable claims with bounded evidence needs.

## When to use
Use when two or more agents recommend incompatible actions, disagree on correctness/risk, or keep reopening the same decision.

## Inputs
- Disputed subject and scope
- Participants and their positions
- Current repository/task revision
- Existing evidence IDs
- Risk level

## Preconditions
- At least two distinct participants
- The disagreement affects a decision, implementation, review, or verification step

## Allowed tools
Read-only repository/search/log/test tools and deterministic scripts in this package. Mutating tools require the enclosing workflow's normal approval rules.

## Process
1. Create one `disagreement_id` for one narrowly defined subject.
2. Record each participant's claim and recommended action without rewriting it into agreement.
3. Attach evidence IDs, not confidence adjectives alone.
4. Separate facts from hypotheses and policy constraints.
5. Compute the current evidence fingerprint.
6. List exactly what new evidence could falsify each competing claim.
7. Assign risk from low/medium/high/critical.
8. Run `scripts/validate-disagreement.py`.
9. Hand off to the Evidence Resolver only when the record is valid.

## Expected output
A valid disagreement JSON matching `schemas/disagreement.schema.json`.

## Verification
- Two or more unique participants exist.
- Positions map to participants.
- Evidence fingerprint is present.
- Claims are mutually decision-relevant.
- Round >1 contains new evidence IDs.

## Failure handling
If the conflict cannot be reduced to falsifiable claims, stop with `human-decision-required` and preserve the ambiguous questions.

## Stop conditions
Stop if scope changes materially, a mandatory policy directly resolves the issue, or a dangerous action requires human approval before further evidence can be collected.
