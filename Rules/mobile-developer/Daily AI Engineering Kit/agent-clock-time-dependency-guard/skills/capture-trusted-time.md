# Skill: Capture Trusted Time

## Purpose
Create bounded, auditable time evidence before a workflow depends on expiry, TTL, schedule, cutoff, or maintenance-window logic.

## When to use
Before evaluating a time-sensitive condition and again before high-risk side effects when freshness may have expired.

## Inputs
Decision risk, business timezone, permitted time source, skew threshold, optional reference source.

## Preconditions
The intended timezone and risk classification are known. High/critical risk work has access to a verifiable reference source.

## Allowed tools
Clock/time APIs, approved NTP/platform/database time sources, repository scripts, read-only metadata tools.

## Constraints
Never retrieve secrets merely to obtain time. Never label an unverified local clock as verified.

## Procedure
1. Identify whether the condition is calendar-time or elapsed-duration based.
2. State the IANA/business timezone explicitly.
3. Capture UTC wall-clock time and monotonic time together.
4. Record source identity and trust level.
5. If high/critical risk, compare with an independent/reference source and record measured skew.
6. Save the observation without overwriting previous evidence.
7. Run `python scripts/validate-time-observation.py <observation> --max-skew-ms <policy>`.
8. Stop if validation fails or source trust is below policy.

## Expected output
A valid TimeObservation JSON record.

## Verification
Observation is timezone-aware, within skew policy, and has reference evidence when marked verified.

## Failure handling
Retry a transient source/tool failure once. Do not retry malformed input, permission failure, excessive skew, or policy failure.

## Stop conditions
Stop when a trustworthy observation cannot be obtained within bounded retry or when required timezone is ambiguous.
