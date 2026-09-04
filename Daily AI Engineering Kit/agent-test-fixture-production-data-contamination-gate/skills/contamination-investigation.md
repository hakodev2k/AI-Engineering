# Skill: Contamination Investigation

## Purpose
Identify whether test artifacts contain production-derived or secret material and determine the smallest safe remediation scope.

## When to use
Use for new/changed fixtures, snapshots, mocks, seeds, recordings, or bug reproductions based on operational evidence.

## Inputs
Repository root, task description, changed files if known, scan output, and any already-authorized evidence.

## Preconditions
Repository is readable; config validates; no additional production access is assumed.

## Allowed tools
Repository search/read, local deterministic scripts, test/build tools, Git diff/status, already-authorized evidence readers.

## Constraints
Never validate suspected secrets against live services. Never fetch additional production data without approval.

## Procedure
1. Inspect repository structure and locate test/fixture roots.
2. Identify the failing behavior and the minimum fields needed to reproduce it.
3. Run the deterministic scanner and group findings by file and rule.
4. For each finding, record `fact`, `hypothesis`, `evidence`, and `confidence` separately.
5. Trace fixture provenance from generator, commit context, nearby test, cassette recorder, seed script, or incident source.
6. Classify provenance as `synthetic`, `generated`, `production-derived`, or `unknown`.
7. Mark explicit credentials/private keys/production-domain matches as blocking unless repository-specific evidence proves they are synthetic.
8. Treat generic email/IP matches as review findings unless corroborated.
9. Identify behaviorally necessary shape constraints for replacement.
10. Hand confirmed or unresolved unsafe fixtures to the replacement skill.

## Expected output
A bounded finding set with path, line, rule, severity, provenance, evidence, confidence, and required replacement constraints.

## Verification
Every blocking scanner finding must be explained or remediated; every affected fixture must have provenance.

## Failure handling
If provenance cannot be established, keep status `unknown` and block verified completion. If evidence requires unauthorized production access, stop.

## Stop conditions
Stop on permission failure, suspected live secret requiring rotation, or scope expansion into production systems.