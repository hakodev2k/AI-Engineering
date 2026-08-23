# Sampling Rules
## Purpose
Control telemetry volume while retaining evidence needed for reliability and investigation.
## Scope
Trace, log, event, and profile sampling.
## MUST
- Document sampling strategy, rate, decision point, and bias implications.
- Preserve important errors and high-value transactions when technically feasible.
- Account for sampling when deriving rates or conclusions.
## MUST NOT
- Claim sampled data is complete without qualification.
- Change sampling during an incident without recording its analytical impact.
## SHOULD
- Prefer adaptive or tail sampling when it materially improves retention of rare failures.
## Exceptions
Cost emergencies may temporarily reduce sampling with explicit risk and restoration criteria.
## Verification
Compare ingest volumes, retained populations, error coverage, configuration, and statistical assumptions.