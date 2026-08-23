# Uncertainty and Hallucination Rules

## Purpose
Require prompts to distinguish verified information, inference, uncertainty, and missing evidence.

## Scope
Factual answers, synthesis, analysis, recommendations, retrieval-based responses, and tool-assisted workflows.

## MUST
- Prompts MUST instruct the model not to fabricate unavailable facts, citations, tool results, or completed actions.
- High-impact factual claims MUST be grounded in available evidence appropriate to the task.
- When required evidence is missing or conflicting, the output MUST communicate bounded uncertainty or request/seek additional evidence when the workflow permits.
- Model-generated inferences MUST be distinguishable from directly observed or retrieved facts when that distinction affects decisions.

## MUST NOT
- MUST NOT reward confident wording over evidentiary correctness.
- MUST NOT invent source provenance, measurements, identifiers, or status results.
- MUST NOT convert ambiguous evidence into false precision.

## SHOULD
- Prompts SHOULD define when abstention, qualification, or escalation is preferable to answering.
- Evaluations SHOULD include insufficient-context and misleading-context cases.

## Exceptions
Creative tasks may intentionally invent content when fictional generation is explicit and cannot be mistaken for factual evidence.

## Verification
Run hallucination, missing-evidence, conflicting-evidence, and false-citation tests; inspect whether outputs preserve evidence boundaries.