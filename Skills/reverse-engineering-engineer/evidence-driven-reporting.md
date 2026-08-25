# Evidence-Driven Reverse Engineering Reporting

## Purpose
Produce technically precise reports that separate observed facts, inferred semantics, confidence, limitations, and reproducible evidence.

## When to use
Use for incident findings, compatibility studies, vulnerability investigations, architecture recovery, code audits, and handoff to engineering teams.

## Inputs
Analysis notes, hashes, screenshots only when necessary, addresses, function names, traces, scripts, reproduction steps, investigation scope.

## Preconditions
Know the intended audience, confidentiality requirements, and what evidence can be shared.

## Context to inspect
Artifact identities, tool versions, address bases, hypotheses, contradictory evidence, runtime environment, related versions, and unresolved questions.

## Core knowledge
Reverse engineering contains uncertainty. Strong reporting makes claims falsifiable and reproducible. Addresses without build identity are weak references; screenshots without text evidence are hard to search and reproduce.

## Procedure
1. State scope, authorization context, artifact hashes, and analysis environment.
2. Summarize conclusions at the appropriate technical level.
3. For each material claim, cite functions/offsets, instructions, metadata, traces, or controlled experiments.
4. Label observation, inference, and speculation distinctly.
5. Assign confidence based on evidence quality, not intuition.
6. Document alternative explanations that remain plausible.
7. Include reproduction steps and scripts where safe.
8. Explain operational/security impact without overstating it.
9. Redact secrets and sensitive payloads.
10. Review terminology and address references against the final analyzed build.

## Decision points
Use exact low-level evidence for contested or security-sensitive claims; use higher-level summaries for routine behavior. Include screenshots only when visual state adds information unavailable in textual evidence.

## Common failure patterns
Presenting pseudocode as source; omitting hashes; mixing versions; overstating intent; leaking secrets; failing to record uncertainty; non-reproducible screenshots.

## Verification
A second analyst should be able to locate the cited evidence and reproduce key conclusions from the report and artifacts.

## Expected output
A concise, auditable technical report with provenance, evidence, confidence, limitations, and actionable conclusions.

## Stop conditions
Do not publish when artifact identity is uncertain, evidence contradicts the conclusion, or required redaction/approval has not occurred.