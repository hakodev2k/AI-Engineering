# Incident Investigation Skill

## Purpose
Investigate production failures using evidence instead of assumptions.

## Inputs
- Incident description
- Logs
- Metrics
- Traces
- Recent deployments
- Repository context

## Procedure
1. Identify affected service and user impact.
2. Collect timestamps, correlation IDs, and error patterns.
3. Locate relevant code paths.
4. Separate facts from hypotheses.
5. Create ranked root-cause candidates.
6. Validate each candidate with evidence.
7. Recommend smallest safe remediation.
8. Verify with tests or controlled checks.

## Output
Finding, evidence, confidence, affected components, risk, recommendation.

## Stop Conditions
Stop when evidence is insufficient or approval is required for production action.
