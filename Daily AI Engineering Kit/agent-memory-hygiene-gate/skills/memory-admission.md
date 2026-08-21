# Skill: Memory Admission

## Purpose
Decide whether an observation deserves durable agent memory and normalize it into an evidence-backed record.

## When to use
Use after a task produces information that may materially help future tasks across sessions.

## Inputs
- candidate fact or preference;
- source/evidence reference;
- observed timestamp;
- intended scope;
- optional existing memory records.

## Preconditions
- Candidate is not a secret or forbidden sensitive category.
- Provenance can be stated.
- The information is expected to outlive the current task.

## Process
1. Separate durable fact from transient execution state.
2. Rewrite the candidate as one atomic claim.
3. Assign a memory kind allowed by policy.
4. Record exact scope where the claim applies.
5. Record source URI or stable evidence reference.
6. Record observed-at timestamp.
7. Estimate confidence from evidence quality, not intuition.
8. Choose an expiry date proportional to expected volatility.
9. Search existing memory for semantic duplicates or contradictions.
10. If duplicate, prefer consolidation over adding another record.
11. If contradiction exists, mark conflict and stop automatic persistence.
12. Run `scripts/validate-memory.py`.
13. Send the candidate and conflict evidence to Memory Reviewer.
14. Persist only after deterministic validation and reviewer `pass`.

## Tools
Repository/file search, connected source reads, JSON editor, validator script.

## Constraints
- One record must contain one durable claim.
- Current-task status, temporary IDs, retries, stack traces and speculative hypotheses are not durable facts.
- Secrets, credentials, private keys and raw customer data are forbidden.
- Memory cannot override fresher evidence or current instructions.

## Expected output
A normalized memory record matching `schemas/memory-record.schema.json`, plus reviewer status.

## Verification
Validator exits 0; provenance exists; expiry is within policy; reviewer returns `pass`; no unresolved conflict exists.

## Failure handling
Revise at most twice for missing scope/provenance/TTL issues. If conflict or forbidden data remains, stop persistence and report the reason.

## Stop conditions
Stop when persisted, rejected by policy, reviewer blocks, unresolved conflict exists, or two revisions fail.