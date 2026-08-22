# Ambiguity Resolution Skill

## Purpose

Detect hidden choices in an acceptance contract and decide whether each can be resolved from evidence, safely assumed, or must be escalated.

## When to use

Use after requirement decomposition and whenever implementation discovers new behavior not covered by the accepted contract.

## Inputs

- acceptance contract;
- source request;
- repository evidence;
- existing tests/contracts;
- project safety rules.

## Preconditions

A draft contract exists and obligation IDs are stable.

## Process

1. Review every obligation for vague terms such as fast, valid, recent, active, normal, appropriate, supported, should, or usually.
2. Ask whether two competent developers could implement different behaviors while still claiming compliance.
3. Check missing boundary values, null/missing input behavior, ordering, concurrency, retries, and failure semantics.
4. Check whether source-backed facts conflict with current code or tests.
5. Check whether assumptions affect public behavior or irreversible side effects.
6. Classify each ambiguity:
   - `blocking`: implementation can materially diverge;
   - `non_blocking`: does not affect accepted external behavior;
   - `resolved_by_evidence`: repository/source evidence determines behavior;
   - `requires_approval`: business or safety choice needs a human.
7. Link every ambiguity to affected obligation IDs.
8. If safe project policy allows an assumption, record the assumption and its rationale explicitly.
9. Re-run the unresolved-obligation checker.
10. Stop when no blocking ambiguity remains or when human resolution is required.

## Tools

Repository search, file/history reading, test inspection, contract validation scripts.

## Constraints

- Never resolve a material product decision by preference.
- Never use majority-of-code-patterns as proof when an explicit source contradicts them.
- Never downgrade a dangerous ambiguity merely to allow implementation.

## Expected output

Updated ambiguities, assumptions, approvals, and obligation references in `acceptance-contract.json`.

## Verification

The contract must contain zero ambiguity entries with `severity: blocking` and `status: open` before implementation.

## Failure handling

After two evidence-gathering attempts for the same ambiguity, stop searching broadly and escalate with the exact missing decision.

## Stop conditions

Stop when ambiguities are resolved, explicitly accepted as safe assumptions, or escalated for approval.
