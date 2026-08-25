# Evidence and Reproducibility Rules

## Purpose
Make penetration-test conclusions independently reviewable and defensible.

## Scope
Applies to notes, requests, responses, commands, screenshots, logs, captures, timelines, and finding evidence.

## MUST
- MUST preserve sufficient evidence to identify the target, test identity, preconditions, action, timestamp, and observed result for each material finding.
- MUST separate raw observations from interpretation and impact conclusions.
- MUST record tool versions and material configuration when they affect reproducibility.
- MUST redact secrets and unnecessary sensitive data without removing evidence required to validate the claim.
- MUST maintain evidence integrity and access controls appropriate to sensitivity.

## MUST NOT
- MUST NOT fabricate, stage, or alter evidence in a way that changes its security meaning.
- MUST NOT rely on screenshots alone when raw protocol or configuration evidence is practical.
- MUST NOT report a result as reproducible when required conditions are unknown.
- MUST NOT discard contradictory evidence.

## SHOULD
- SHOULD use consistent identifiers linking notes, findings, assets, and evidence artifacts.
- SHOULD reproduce critical findings from a clean state when safe and practical.

## Exceptions
When reproduction would create unacceptable risk, document the limitation, supporting evidence, uncertainty, and why further validation was not performed.

## Verification
A reviewer should be able to follow the evidence chain, reproduce a representative sample safely, validate timestamps and target identity, and confirm redaction did not distort conclusions.