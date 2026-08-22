# Skill: Incident Investigation

## Purpose
Perform structured production debugging without guessing.

## Inputs
- Incident description
- Error messages
- Logs
- Metrics
- Recent changes
- Repository access

## Process
1. Record incident timeline.
2. Identify affected services.
3. Collect observable evidence.
4. Separate facts from hypotheses.
5. Trace execution paths in code.
6. Compare recent changes.
7. Validate each hypothesis independently.
8. Propose minimal remediation.
9. Define verification checks.

## Constraints
- No production mutation.
- No unsupported assumptions.
- Preserve evidence.

## Output
Investigation report with findings, evidence, confidence, risks, and verification status.

## Stop Conditions
Stop when evidence is insufficient or approval is required.
