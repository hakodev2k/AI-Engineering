# Grounded Generation and Citations

## Purpose
Generate answers whose material factual claims are supported by retrieved evidence and traceable citations.

## When to use
Use for knowledge-grounded assistants and evidence-sensitive workflows.

## Inputs
User request, assembled evidence, source anchors, response policy, abstention rules.

## Context to inspect
Inspect evidence authority, conflicts, citation granularity, model behavior, unsupported-answer examples, and output format requirements.

## Core knowledge
Grounding requires both answer correctness and entailment by evidence. A citation attached to a paragraph does not prove every claim in it. Models must be allowed to abstain when evidence is insufficient.

## Procedure
1. State generation instructions that prioritize supplied evidence.
2. Preserve evidence-source mapping in the prompt representation.
3. Require claims to remain within supported scope.
4. Handle conflicting sources using authority/freshness rules.
5. Generate citations at a useful claim or sentence granularity.
6. Refuse or qualify unsupported claims rather than guessing.
7. Validate citation targets after generation.
8. Detect unsupported material claims using automated checks where useful.
9. Evaluate factuality and citation entailment with human-reviewed samples.
10. Log provenance identifiers for debugging.

## Decision points
Use extractive answers when precision dominates fluency. Use synthesis when multiple passages must be combined, but require stronger attribution checks.

## Common failure patterns
Citations that merely mention the topic; model prior overriding evidence; fabricated citation IDs; hiding source conflicts; forced answers with insufficient evidence.

## Verification
Check claim support, citation validity, abstention behavior, and conflict cases independently from stylistic quality.

## Expected output
A grounded answer path with traceable evidence and explicit unsupported-case behavior.

## Stop conditions
Stop generation or abstain when evidence is insufficient, inaccessible, or materially contradictory without a precedence rule.