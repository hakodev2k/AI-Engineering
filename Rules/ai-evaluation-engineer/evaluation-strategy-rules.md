# Evaluation Strategy Rules

## Purpose
Ensure AI evaluation programs measure the behaviors that matter for product quality, safety, reliability, and business outcomes.

## Scope
Applies to evaluation planning for models, prompts, agents, RAG systems, classifiers, multimodal systems, and AI-enabled product changes.

## MUST
- Evaluation objectives MUST be derived from explicit product requirements, failure modes, and risk scenarios.
- Every evaluation suite MUST define the target behavior, evaluation population, metric, threshold, and release decision it informs.
- Critical user journeys and high-severity failure modes MUST have dedicated evaluation coverage.
- Evaluation scope MUST distinguish offline quality, safety, robustness, latency, cost, and production behavior where relevant.
- Significant model, prompt, tool, retrieval, or orchestration changes MUST be evaluated against a documented baseline.

## MUST NOT
- MUST NOT treat a single aggregate score as sufficient evidence when important subpopulations or failure modes can be hidden by averaging.
- MUST NOT select metrics solely because they are easy to compute.
- MUST NOT claim an evaluation suite is representative without evidence about coverage and sampling.

## SHOULD
- Evaluation plans SHOULD prioritize high-impact and high-likelihood failures before long-tail cosmetic issues.
- Suites SHOULD combine deterministic checks, model-based grading, and human review when no single method is reliable enough.

## Exceptions
Exceptions require documented rationale, identified risk, compensating evidence, and approval from the accountable technical or product owner.

## Verification
Review the evaluation plan, requirement-to-metric traceability, baseline comparison, failure taxonomy, and release criteria. Confirm each critical risk maps to at least one concrete test or monitoring mechanism.