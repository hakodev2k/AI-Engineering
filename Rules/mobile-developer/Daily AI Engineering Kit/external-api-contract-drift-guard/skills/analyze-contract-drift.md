# Skill: Analyze Contract Drift

## Purpose
Convert a deterministic contract diff into evidence-backed integration risk.

## When to use
After `diff-contracts.py` produces `contract-drift-report.json` and before any compatibility code is edited.

## Inputs
- current and candidate normalized contracts;
- `contract-drift-report.json`;
- integration entry points and client/adapter code;
- provider migration notes when supplied by the task.

## Preconditions
- both contract files parse successfully;
- deterministic diff exists;
- repository is readable.

## Process
1. Read each added, removed, and changed JSON path from the drift report.
2. Classify each item: additive, behavioral-risk, potentially-breaking, breaking, unknown.
3. Search repository references for operation names, field names, enum values, schema/type names, URLs, version identifiers, serializers, and generated clients.
4. Trace each matched consumer to request construction, deserialization, validation, persistence, business logic, and downstream output.
5. Identify compatibility assumptions such as non-null fields, closed enums, exact status codes, pagination shape, date formats, authentication scopes, retry semantics, or error schemas.
6. Record evidence for every impacted consumer using file path + symbol or test reference.
7. Identify unmapped drift items explicitly; never silently classify them as safe.
8. Produce a risk summary and hand off to `build-compatibility-plan.md`.

## Tools it may use
Repository search/read tools, Git diff/history, local non-destructive commands, provider documentation supplied or explicitly researched.

## Constraints
- Do not edit production code.
- Do not assume additive changes are harmless when clients use strict deserialization or exhaustive enums.
- Do not claim a consumer is unaffected without evidence.

## Expected output
A structured drift assessment containing item id, classification, affected consumers, evidence, assumptions, recommended action, and unresolved questions.

## Verification
Every breaking/potentially-breaking/unknown item has at least one disposition and evidence or is explicitly marked unmapped.

## Failure handling
Retry repository mapping twice using different search anchors. If still unresolved, stop and escalate the unmapped contract paths.

## Stop conditions
Stop before implementation if a breaking or unknown item lacks an owner, compatibility strategy, or required approval.
