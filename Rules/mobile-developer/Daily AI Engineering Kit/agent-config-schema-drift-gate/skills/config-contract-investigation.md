# Config Contract Investigation

## Purpose
Detect configuration shape drift that can make agents or applications fail only after deployment.

## When to use
Use before merging changes to JSON/YAML configuration, generated agent config, tool manifests, policy files, or environment-specific settings.

## Inputs
Repository root, changed configuration files, `config/policy.json`, and the committed `.ai-config-baseline/` snapshots.

## Preconditions
Worktree is readable; Python 3 is available; install PyYAML when YAML is scanned.

## Procedure
1. Locate config files selected by policy globs.
2. Parse each file; stop on malformed JSON/YAML.
3. Flatten object paths and record value types, never values.
4. Compare paths/types with the approved baseline.
5. Classify removed keys and type changes as breaking drift.
6. Treat newly detected sensitive-looking key names as warnings requiring inspection; never copy secret values into evidence.
7. Determine whether drift is intentional and whether consumers are backward compatible.
8. If intentional breaking drift exists, stop for explicit approval before baseline replacement.
9. Run tests/build of affected consumers.
10. Preserve `.ai-config-drift-report.json` as verification evidence.

## Allowed tools
Read/search repository, Python gate, build/test commands, git diff.

## Constraints
Do not read secret stores, print configuration values, deploy, or alter production configuration.

## Expected output
A gate report with status, affected file, finding kind, key paths, and verification status.

## Verification
Gate exits 0; affected consumer tests pass; diff contains no unintended baseline changes.

## Failure handling
Parse/environment failures are blocking. A transient tool invocation may be retried twice. Repeated failure stops with captured stderr/report.

## Stop conditions
Stop on permission failure, missing required baseline, breaking drift without approval, or inability to run required consumer verification.
