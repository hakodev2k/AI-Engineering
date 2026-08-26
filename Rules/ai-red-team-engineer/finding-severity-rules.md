# Finding Severity

## Purpose
Prioritize AI red-team findings using consistent, evidence-based risk judgments.

## Scope
Confirmed vulnerabilities, abuse cases, control failures, and systemic weaknesses.

## MUST
- Rate findings using demonstrated or bounded impact, exploitability, exposure, prerequisites, affected population, and control effectiveness.
- Separate technical severity from business or deployment context when useful.
- Record uncertainty and assumptions that materially affect severity.

## MUST NOT
- Inflate severity to force remediation priority.
- Downgrade a finding solely because exploitation has not yet been observed in production.

## SHOULD
Calibrate ratings against comparable historical findings and organizational risk criteria.

## Exceptions
Any manual override of a standard rating requires rationale and accountable owner approval.

## Verification
Review evidence, reproduction steps, affected scope, prerequisites, compensating controls, and severity rationale.