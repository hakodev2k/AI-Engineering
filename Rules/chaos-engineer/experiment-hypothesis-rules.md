# Experiment Hypothesis Rules
## Purpose
Ensure chaos experiments test explicit resilience assumptions.
## Scope
Experiment design and hypotheses.
## MUST
- State steady state, injected fault, expected behavior, measurable evidence, and abort conditions before execution.
- Tie experiments to credible failure modes or resilience claims.
## MUST NOT
- Inject faults merely to see what happens in production.
- Treat agent confidence as evidence.
## SHOULD
- Start with the smallest experiment that can falsify the hypothesis.
## Exceptions
Exploratory non-production work may use broader hypotheses when blast radius is bounded.
## Verification
Review experiment plan, metrics, fault model, and expected observations.