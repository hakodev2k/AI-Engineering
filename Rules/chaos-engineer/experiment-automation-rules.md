# Experiment Automation Rules
## Purpose
Make repeated chaos experiments deterministic and safe.
## Scope
Experiment code, schedulers, templates, and orchestration.
## MUST
- Version experiment definitions and target selectors.
- Make cleanup idempotent and safe to retry.
- Enforce blast-radius, duration, and authorization controls in automation where practical.
## MUST NOT
- Store production credentials in experiment code.
- Automatically widen scope after failed guardrails.
## SHOULD
- Make dry-run or target-preview modes available.
## Exceptions
Manual one-off experiments require equivalent documented parameters and evidence.
## Verification
Review code, CI checks, permissions, dry runs, cleanup tests, and audit logs.