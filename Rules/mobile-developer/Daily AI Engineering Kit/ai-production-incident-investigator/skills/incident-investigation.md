# Incident Investigation Skill

## Purpose
Perform structured production debugging.

## Inputs
- Error symptoms
- Logs
- Metrics
- Traces
- Recent changes
- Repository access

## Process
1. Identify affected service and time window.
2. Collect logs, deployments, configuration, and metrics.
3. Separate facts from assumptions.
4. Identify possible causes.
5. Validate each hypothesis with evidence.
6. Produce remediation options.
7. Run verification checks.

## Constraints
- Never claim unverified root causes.
- Never change production directly.

## Output
Incident report containing findings, evidence, confidence, risk, and next action.

## Stop Conditions
Stop when evidence is insufficient or approval is required.
