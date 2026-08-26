# Context Assembly and Token Budgeting

## Purpose
Construct compact, diverse, attributable evidence sets that fit model limits and maximize answer utility.

## When to use
Use after ranking and before generation.

## Inputs
Ranked passages, token budget, source metadata, question, model context limits, citation requirements.

## Context to inspect
Inspect duplicate passages, parent relationships, source diversity, passage length, prompt overhead, generation reserve, and lost-in-the-middle failures.

## Core knowledge
More context is not always better. Redundant or conflicting evidence consumes attention and cost. Context assembly should preserve provenance and reserve tokens for instructions and output.

## Procedure
1. Calculate available evidence budget after fixed prompt and output reserve.
2. Deduplicate near-identical candidates.
3. Group adjacent passages when continuity materially helps.
4. Preserve source IDs and citation anchors.
5. Select high-value evidence under budget.
6. Maintain useful source diversity where appropriate.
7. Detect explicit conflicts rather than silently choosing one.
8. Order context according to model and task behavior.
9. Truncate only at safe semantic boundaries.
10. Evaluate answer quality across context sizes.

## Decision points
Use parent expansion when retrieved child chunks lack necessary context. Prefer diversity when multiple independent sources improve coverage; prefer concentrated evidence for single authoritative facts.

## Common failure patterns
Top-k concatenation without deduplication; token overflow; clipping tables mid-row; stripping provenance; stuffing irrelevant context to fill the window.

## Verification
Measure token use, citation correctness, answer quality, conflict handling, and performance across representative long-context cases.

## Expected output
A deterministic context assembly policy with bounded token cost.

## Stop conditions
Stop when required evidence exceeds the model budget and cannot be safely summarized or decomposed.