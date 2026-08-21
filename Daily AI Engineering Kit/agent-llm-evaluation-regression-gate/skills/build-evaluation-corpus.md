# Build Evaluation Corpus

## Purpose
Create a stable, representative case set for detecting regressions in an LLM/agent change.

## When to use
Before changing prompts, models, tools, retrieval, routing, memory, structured-output handling, or agent policy.

## Inputs
Acceptance criteria, known failures, production-safe traces, supported tool contracts, safety requirements.

## Preconditions
Remove secrets/PII. Obtain approval before using restricted production data.

## Allowed tools
Repository search, test runners, sanitized telemetry, local scripts, official API documentation.

## Constraints
Do not train or tune the candidate against hidden expected answers. Keep case IDs stable. Separate facts from hypotheses.

## Procedure
1. Map user-visible behaviors and critical workflows.
2. Add happy paths, boundary cases, adversarial inputs, tool failures, malformed outputs, and previously fixed incidents.
3. Define deterministic assertions wherever possible before using model judging.
4. Define required dimensions: correctness and safety; add format/tool-use only when relevant.
5. Mark truly release-blocking cases `critical=true`.
6. Freeze case IDs and expected semantics.
7. Run the current approved implementation to produce the baseline JSONL.
8. Validate JSONL with `scripts/validate_eval_jsonl.py`.
9. Record evaluator/model/prompt versions with the run evidence.

## Expected output
A baseline and candidate-compatible corpus with identical case IDs and explicit scoring dimensions.

## Verification
No duplicate IDs; required dimensions present; sensitive data absent; critical cases justified; baseline reproducible.

## Failure handling
If expected behavior is ambiguous, stop that case and escalate to requirement owner. Do not encode a guess as ground truth.

## Stop conditions
Stop if production data cannot be safely sanitized, evaluator behavior is unknown, or acceptance criteria conflict.
