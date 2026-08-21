# Skill: Context Compression

## Purpose

Reduce active context without losing evidence required for safe engineering decisions.

## When to use

Use when context usage approaches the configured limit, after a branch of investigation is complete, before multi-agent handoff, or before a long implementation phase.

## Inputs

- current context ledger;
- configured budget;
- completed and unresolved decision questions;
- source freshness information.

## Preconditions

Critical evidence is identified and all summaries can be traced back to their source identifiers.

## Process

1. Calculate current budget usage.
2. Never compress unresolved `critical` evidence first.
3. Merge duplicate `reference` entries that support the same conclusion.
4. Convert completed `supporting` investigations into concise evidence summaries containing:
   - conclusion;
   - source identifiers;
   - assumptions;
   - unresolved caveats;
   - reread condition.
5. Mark raw supporting context as inactive after summary validation.
6. Retire hypotheses disproven by evidence, retaining only the reason they were rejected when useful.
7. Remove repeated build/test output while preserving command, exit status, failing identifiers, and the relevant error excerpt.
8. For multi-agent handoff, include only task state, decisions, critical evidence, changed files, unresolved questions, and next action.
9. Recalculate budget.
10. If still over budget, request a human-approved exception or split the task into checkpoints rather than deleting critical evidence.

## Tools

Ledger editor, deterministic budget calculator, file reads for spot verification.

## Constraints

- Do not summarize secrets.
- Do not convert exact public contract values into approximate prose.
- Do not merge conflicting evidence into a single conclusion.
- Do not erase unresolved risks.

## Expected output

A smaller active context set plus traceable summaries in `context-ledger.json`.

## Verification

Randomly choose at least one compressed critical/supporting conclusion and compare its summary against the original source. Confirm no materially different meaning was introduced.

## Failure handling

If a summary cannot preserve the required meaning, keep the source active. If the budget still cannot be met safely, stop compression and escalate.

## Stop conditions

Stop when the configured budget is satisfied without losing required evidence, or when further compression would make a critical claim unverifiable.
