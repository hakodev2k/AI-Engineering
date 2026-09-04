# Flaky Automation Rules

## Purpose
Prevent non-deterministic browser failures from becoming normalized operational noise.

## Scope
Applies to intermittent tests, workflow retries, quarantine, reruns, timing-sensitive behavior, and unstable environments.

## MUST
- A flaky failure MUST be tracked as a defect with evidence, owner, and bounded remediation plan when it affects trusted automation.
- Retries MUST preserve the first failure evidence and report retry count separately from first-pass success.
- Root-cause analysis MUST distinguish application defects, automation defects, environment instability, and external dependency failures using evidence.
- Quarantined coverage MUST remain visible and MUST have an explicit exit condition.
- Repeated failure rates MUST be measured for critical suites.

## MUST NOT
- Automatic retries MUST NOT convert an unstable check into an unconditional success signal.
- Arbitrary sleeps or broader selectors MUST NOT be introduced solely to hide intermittency.
- Flaky checks MUST NOT remain indefinitely in critical release gates without an explicit risk decision.

## SHOULD
- Suspected flakes SHOULD be reproduced under controlled repeated execution and resource variation.
- The smallest reliable synchronization or isolation fix SHOULD be preferred over broad timeout increases.

## Exceptions
Temporary quarantine is allowed to protect delivery flow when risk is understood, coverage impact is documented, and alternative verification exists where necessary.

## Verification
Track first-pass pass rate, retry recovery rate, quarantine age, and recurring signatures. Re-run affected scenarios under repetition and review fixes against original failure evidence.