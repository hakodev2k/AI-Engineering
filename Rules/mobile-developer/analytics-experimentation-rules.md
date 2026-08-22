# Analytics and Experimentation Rules
## Purpose
Produce trustworthy product evidence while protecting privacy and application performance.
## Scope
Analytics events, funnels, experiments, attribution, metrics, and telemetry SDKs.
## MUST
- Event semantics, units, identifiers, and trigger conditions MUST be documented for decision-critical metrics.
- Experiments MUST define hypothesis, primary metric, guardrails, population, and stopping criteria before interpretation.
- Analytics collection MUST comply with consent and data-minimization requirements.
## MUST NOT
- Instrumentation MUST NOT materially block user interactions or startup.
- Experiment results MUST NOT be claimed without checking assignment integrity and material confounders.
## SHOULD
- Event schemas SHOULD be versioned when semantic changes would corrupt longitudinal analysis.
## Exceptions
Exploratory telemetry may be less formal when it is clearly non-authoritative and privacy-safe.
## Verification
Validate event payloads, consent states, sampling, experiment assignment, metric queries, and performance overhead.