# Skill: Feature Flag Introduction

## Purpose
Introduce a feature flag with enough lifecycle metadata, fallback behavior, rollout evidence, and cleanup intent that the flag can be operated and later removed safely.

## When to use
Use before adding a new temporary release flag, experiment flag, operational switch, or kill switch.

## Inputs
- feature/change request,
- affected code paths,
- intended default behavior,
- flag type,
- owner,
- rollout plan,
- rollback behavior,
- target retirement date or justification for a protected long-lived flag.

## Preconditions
- The underlying change is understood well enough to identify both enabled and disabled behavior.
- A named owner can be assigned.
- A feature flag is actually preferable to a normal deployment/configuration mechanism.

## Required context
Inspect entry points, configuration bindings, existing flag conventions, tests for both branches, deployment topology, and any operational dashboard or rollout source used by the project.

## Allowed tools
Repository search/read tools, test/build commands, configuration readers, non-destructive feature-flag metadata APIs, and the deterministic scripts in this package.

## Constraints
- Do not use flags to bypass authorization or security controls.
- Do not hard-code secrets in flag metadata.
- Do not create a temporary flag without an expiry and cleanup trigger.
- Do not change production rollout state without explicit authorization.

## Procedure
1. Confirm why a flag is needed instead of normal code/configuration.
2. Classify the flag as `release`, `experiment`, `operational`, or `kill-switch`.
3. Identify the enabled path, disabled path, and safe default if the flag service is unavailable.
4. Identify whether branch divergence changes data shape, writes, public API behavior, security, billing, or irreversible side effects.
5. Assign an owner and creation date.
6. For temporary flags, set an expiry date within policy and a concrete cleanup trigger.
7. Define rollout stages and the evidence required to advance or stop rollout.
8. Define rollback behavior and any minimum time the disabled path must remain valid.
9. Add or update lifecycle records.
10. Implement both code paths with the smallest practical branch surface.
11. Add tests for enabled, disabled, and unavailable-provider fallback behavior where relevant.
12. Run `validate-feature-flags.py`.
13. Run `scan-flag-references.py` and save the report.
14. Run repository build/tests.
15. Review the diff for unrelated changes or duplicate flags.

## Expected output
- valid lifecycle record,
- implementation references,
- tests covering required states,
- deterministic reference report,
- rollout/rollback evidence requirements.

## Verification
The flag is introduced only when records validate, expected code references are discoverable, both required branches are tested, and ownership/expiry rules pass policy.

## Failure handling
A policy validation failure is fixed before proceeding. Scanner/tool operational failure may be retried once if transient. If no safe fallback behavior can be defined, stop and redesign rather than hiding the risk behind a flag.

## Stop conditions
Stop when ownership is missing, the flag would bypass a security boundary, production configuration change is required without approval, or the flag cannot be safely removed later.