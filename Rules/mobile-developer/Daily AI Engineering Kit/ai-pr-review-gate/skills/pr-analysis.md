# PR Analysis Skill

## Purpose
Perform structured AI-assisted pull request review.

## Inputs
- Pull request diff
- Repository structure
- Build and test results
- Coding standards

## Process
1. Identify changed components.
2. Trace affected execution paths.
3. Check correctness and edge cases.
4. Check security and performance risks.
5. Compare implementation with existing patterns.
6. Produce evidence-based findings.
7. Validate findings before reporting.

## Output
Each finding must contain:
- location
- evidence
- impact
- severity
- recommendation

## Stop Conditions
Stop when context is insufficient or a finding cannot be supported by evidence.
