# PR Risk Analysis Skill

## Purpose
Detect implementation risks before merge.

## Inputs
- Pull request diff
- Repository structure
- Tests
- Build results
- Architecture rules

## Process
1. Identify changed files.
2. Classify changes by domain.
3. Trace affected execution paths.
4. Check API, database, security, and performance impact.
5. Collect evidence from code and tests.
6. Produce findings with confidence levels.
7. Suggest verification actions.

## Output
Finding, evidence, affected component, risk, recommendation, verification status.

## Stop Conditions
Stop when evidence is insufficient or approval is required.
