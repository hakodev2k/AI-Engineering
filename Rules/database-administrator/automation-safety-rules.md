# Automation Safety

## Purpose
Use automation to reduce toil without multiplying database operational mistakes.

## Scope
Scripts, schedulers, runbooks, orchestration, infrastructure automation, and AI-assisted operations.

## MUST
- Automation MUST validate target environment and critical parameters before destructive or privileged operations.
- Repeated operations MUST have deterministic logging, failure signaling, and bounded retry behavior.
- Destructive automation MUST require explicit authorization and safeguards against broad unintended scope.
- Credentials used by automation MUST follow least privilege and approved secret handling.

## MUST NOT
- MUST NOT let an AI agent silently exceed authority from analysis into production execution.
- MUST NOT use unbounded retries for operations that can amplify load or data changes.
- MUST NOT hide partial failure behind an overall success status.
- MUST NOT hard-code production secrets.

## SHOULD
- Automation SHOULD support dry-run or preview for risky operations where technically meaningful.
- Scripts SHOULD be version-controlled, reviewed, and tested against representative failure cases.

## Exceptions
One-off emergency scripts require peer or incident-authority review when time permits, captured source, and post-execution validation.

## Verification
Inspect code review, secret scanning, target guards, retry limits, dry-run tests, logs, exit status behavior, and authorization controls.