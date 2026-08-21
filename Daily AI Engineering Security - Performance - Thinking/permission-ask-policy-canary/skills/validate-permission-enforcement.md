# Skill — Validate Permission Enforcement

## Purpose
Prove that declared `allow`, `ask`, and `deny` semantics are actually enforced on the current agent host, version, surface, and mode before autonomy is enabled.

## Trigger
- agent host/version upgrade;
- permission or hook configuration change;
- switching CLI/IDE/Desktop surface;
- enabling auto/autonomous mode;
- unexplained permission behavior.

## Inputs
- intended permission policy;
- host/surface/version/mode identifiers;
- harmless synthetic probes;
- observation JSON produced during probe execution.

## Preconditions
Use probes with no destructive or external side effect. For example, echo/write only inside a disposable temp directory. Do not test production credentials, real pushes, deletes, deployments, or network egress.

## Allowed tools
Configuration readers, temporary directories, local shell, the target agent host, and `scripts/permission_canary.py`.

## Constraints
- A canary must never rely on a destructive action to prove a deny/ask boundary.
- Unknown outcomes fail closed for autonomous operation.
- Test each relevant surface separately.

## Procedure
1. Record host, version, OS, surface, and permission mode.
2. Define at least one harmless probe for each expected decision: allow, ask, deny.
3. Execute one probe per fresh permission context where practical.
4. Record `expected`, `observed`, whether a human prompt appeared, and whether execution occurred.
5. Run `python scripts/permission_canary.py observations.json`.
6. If any expected `ask` executed without a prompt, mark `FAIL_OPEN`.
7. If any expected `deny` executed, mark `FAIL_OPEN`.
8. If expected `allow` unexpectedly prompts/denies, mark `FAIL_CLOSED` and investigate usability/automation impact.
9. Compare results across surfaces/modes.
10. Permit autonomous operation only for a matrix row with a fresh passing result.

## Decision points
- `PASS`: all decisions match.
- `FAIL_OPEN`: safety boundary weaker than declared; autonomy blocked.
- `FAIL_CLOSED`: safer than expected but operationally broken; investigate before unattended use.
- `UNKNOWN`: incomplete/unreliable observation; autonomy blocked.

## Expected output
A machine-readable report plus a human-readable matrix of expected versus observed decisions.

## Metrics
Pass rate, fail-open count, fail-closed count, validation age, surface coverage.

## Verification
Repeat the matrix after restart and after any upgrade/config change. For critical environments, have a second reviewer confirm the canary definitions do not themselves create side effects.

## Failure handling
Retry only once for an instrumentation error. Do not retry a true fail-open as if it were transient; downgrade autonomy or use deterministic `deny` until fixed.

## Stop conditions
Stop when all required surfaces pass, or immediately when a fail-open is detected.