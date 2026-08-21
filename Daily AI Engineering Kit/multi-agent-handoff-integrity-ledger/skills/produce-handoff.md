# Skill: Produce a Handoff

## Purpose
Create a complete, reviewable transfer artifact when responsibility moves from one agent or human to another.

## When to use
Use at every stage boundary where the next actor depends on prior analysis, implementation, review, approval, or evidence.

## Inputs
- current task and stage;
- producer role and receiver role;
- scope and acceptance criteria;
- artifacts created or inspected;
- assumptions and decisions;
- unresolved risks;
- approvals and constraints;
- completion and verification state.

## Preconditions
- producer has finished or intentionally stopped its stage;
- referenced artifacts exist;
- producer can distinguish evidence from inference.

## Process
1. State the exact scope completed and excluded.
2. Record the producer and intended receiver.
3. List inputs that materially influenced the stage.
4. Record artifacts with repository-relative paths and SHA-256 fingerprints when they are files.
5. Separate decisions from assumptions.
6. Mark every assumption as verified or unverified.
7. Record unresolved risks with severity and proposed owner.
8. Record approvals only when an explicit approval reference exists.
9. Preserve completion and verification states exactly; never promote them.
10. Add next actions expected from the receiver.
11. Write the record using `schemas/handoff-record.schema.json`.
12. Run `scripts/validate-handoff.py`.
13. Run `scripts/verify-artifacts.py`.
14. Hand the record to the Handoff Reviewer.

## Allowed tools
Repository read tools, file hashing, test/build outputs, version-control diff inspection, issue/PR metadata, structured writing.

## Constraints
- do not embed secrets;
- do not hide failed checks;
- do not claim verification without independent evidence;
- do not omit a known blocking risk to make the handoff pass.

## Expected output
A valid handoff JSON record ready for independent review.

## Verification
Both deterministic scripts must exit 0 before semantic review. Reviewer must then return `accepted`, `revise`, or `blocked`.

## Failure handling
A validation or review failure may be revised at most twice. If the same issue persists, stop and escalate.

## Stop conditions
Stop when a blocking risk lacks approval, referenced evidence is stale/missing, or the producer cannot distinguish fact from assumption.