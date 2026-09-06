# Testing and Reproduction Rules

## Purpose
Reproduce AI incidents safely and generate evidence that remediation addresses the observed failure.

## Scope
Applies to local, staging, sandbox, replay, simulation, and controlled production validation.

## MUST
- Reproduction MUST preserve behavior-affecting inputs and versions relevant to the incident.
- Tests MUST separate deterministic infrastructure failures from probabilistic model behavior where possible.
- Dangerous, destructive, privacy-sensitive, or externally consequential reproduction MUST use sandboxing, mocks, dry-run controls, or explicit approval.
- Regression tests MUST cover the triggering condition and meaningful adjacent cases to detect overfitting of the fix.
- Test results MUST record environment, configuration, sample count when relevant, and evaluation criteria.
- Production validation MUST be scoped and monitored with stop conditions for high-risk fixes.

## MUST NOT
- Production user data MUST NOT be copied into lower environments without approved controls.
- A single non-reproduction MUST NOT invalidate credible historical evidence of a probabilistic incident.
- Tests MUST NOT invoke irreversible external actions merely to prove a hypothesis.

## SHOULD
- Automate stable incident regressions in CI or evaluation pipelines.
- Use seeded or controlled conditions when the stack supports them.

## Exceptions
When exact reproduction is impossible, define the approximation, mismatch, residual uncertainty, and alternative evidence.

## Verification
Review test fixtures, environment metadata, repeated-run evidence, sandbox controls, regression coverage, and production validation records.