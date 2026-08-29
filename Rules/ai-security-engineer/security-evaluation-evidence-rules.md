# Security Evaluation Evidence Rules

## Purpose
Require measurable evidence for AI security claims and release decisions.

## Scope
Applies to security testing, red teaming, safety controls, authorization, privacy, isolation, model changes, and risk acceptance.

## MUST
- Security claims MUST be supported by tests, configuration inspection, telemetry, reproducible analysis, or equivalent evidence.
- Evaluation datasets and attack suites MUST cover the threats relevant to the deployed architecture and capabilities.
- Results MUST record tested versions of models, prompts, policies, tools, data sources, and security controls where material.
- High-severity findings MUST have tracked disposition before release.
- Material changes MUST trigger reevaluation of affected controls.

## MUST NOT
- MUST NOT treat model confidence, vendor marketing, or absence of observed incidents as proof of security.
- MUST NOT report aggregate pass rates without exposing critical failure classes that could be hidden by the aggregate.
- MUST NOT silently exclude failed tests from release evidence.

## SHOULD
- Preserve reproducible regression cases for known vulnerabilities.
- Report uncertainty, coverage gaps, and environmental limitations explicitly.

## Exceptions
Exceptions require documented missing evidence, residual risk, compensating controls, owner, expiry, and accountable approval.

## Verification
Inspect evaluation artifacts, test-to-threat traceability, version metadata, CI results, failure logs, risk acceptances, and regression history.