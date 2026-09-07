# Security Research Reporting Rules

## Purpose
Produce reports that let engineers and decision-makers understand, reproduce, prioritize, remediate, and verify security findings without relying on researcher interpretation alone.

## Scope
Applies to vulnerability reports, internal research notes promoted to findings, advisories, remediation handoffs, and executive or engineering summaries.

## MUST
- Every confirmed finding MUST state the affected boundary, conditions, observed impact, evidence, and confidence.
- Reports MUST separate facts, hypotheses, assumptions, and untested possibilities.
- Reproduction guidance MUST be sufficient for an authorized engineer to validate the issue while omitting unnecessary weaponization.
- Affected versions, configurations, roles, privileges, or deployment conditions MUST be identified when known.
- Severity and priority statements MUST link to their supporting reasoning rather than stand alone as labels.
- Reports MUST redact secrets, personal data, customer content, and unrelated proprietary information.
- Recommended remediation MUST distinguish root-cause correction from compensating mitigation where both are discussed.
- Limitations, failed validation paths, and material uncertainty MUST be visible rather than buried.
- Report updates MUST preserve change history when severity, scope, exploitability, or remediation status materially changes.

## MUST NOT
- MUST NOT claim remote code execution, privilege escalation, data exposure, or similar impact beyond what evidence supports.
- MUST NOT use sensational language to substitute for technical risk analysis.
- MUST NOT omit important prerequisites because they make the finding appear less severe.
- MUST NOT include active credentials or unnecessarily complete exploit chains in broadly accessible reports.
- MUST NOT mark a finding remediated without appropriate validation evidence.

## SHOULD
- Reports SHOULD include concise impact, technical detail, reproduction evidence, likely root cause, remediation options, and verification guidance.
- Screenshots SHOULD supplement rather than replace machine-readable or textual evidence where possible.
- Findings SHOULD be independently reviewable by someone not present during discovery.

## Exceptions
When disclosure restrictions require a reduced-detail report, preserve the full evidence in an appropriately restricted location and identify what information was withheld and from whom.

## Verification
A reviewer should trace each material claim to evidence, reproduce or independently validate the issue, identify the required preconditions, and understand how remediation will be verified. Run secret and sensitive-data review before wider distribution.