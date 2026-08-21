# Hallucination and Grounding Rules
## Purpose
Reduce unsupported claims and make uncertainty observable.
## Scope
Generated answers, summaries, recommendations, extraction, and grounded reasoning workflows.
## MUST
- Require source grounding when the task depends on external facts or supplied evidence.
- Define how the system behaves when evidence is missing, conflicting, or insufficient.
- Preserve distinctions between observed facts, model inference, and generated suggestions when material.
## MUST NOT
- Present fabricated citations, identifiers, measurements, or source-derived claims as verified facts.
- Force an answer when the correct behavior is to report insufficient evidence.
## SHOULD
- Add claim-level checks or citation validation for high-risk grounded workflows.
## Exceptions
Creative tasks may relax grounding when factual accuracy is not implied.
## Verification
Use unsupported-claim tests, citation checks, adversarial evaluations, and human review of sampled outputs.