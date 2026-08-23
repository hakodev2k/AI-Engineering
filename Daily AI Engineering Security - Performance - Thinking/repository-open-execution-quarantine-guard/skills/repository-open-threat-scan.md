# Skill: Repository-Open Threat Scan

## Purpose
Detect repository-controlled configuration that can execute commands at workspace open, agent session start, or dependency install before the workspace is trusted.

## Trigger
Before opening a newly cloned, extracted, switched, or externally modified repository in an editor/agent that consumes project-local configuration.

## Inputs
- Repository root.
- Optional approval file containing path→SHA-256 bindings.
- Product surfaces in scope.

## Preconditions
The repository is available as data only; no editor/agent startup hooks or package lifecycle scripts have executed.

## Required context
Target repository path, intended editor/agent, and whether prior approvals exist.

## Allowed tools
Read-only filesystem inspection, hashing, JSON parsing, static text analysis.

## Constraints
- MUST NOT execute project commands.
- MUST NOT import repository code.
- MUST NOT invoke package managers or shells on project-supplied strings.
- MUST treat approval as invalid when file content hash changes.

## Procedure
1. Enumerate known startup/config files without traversing outside the repository root.
2. Parse `.claude/settings.json`; flag non-empty hook commands under lifecycle events such as `SessionStart`.
3. Parse `.vscode/tasks.json`; flag tasks whose `runOptions.runOn` is `folderOpen`.
4. Parse root `package.json`; report install lifecycle scripts (`preinstall`, `install`, `postinstall`) as execution-adjacent findings.
5. Search Dev Container config for `initializeCommand`, `onCreateCommand`, `postCreateCommand`, and related lifecycle commands when present.
6. Compute SHA-256 for each risky source file.
7. Compare against approvals. Exact path and exact hash are both required.
8. Emit structured findings with trigger, path, evidence, hash, approval status, severity, and blocking status.
9. Exit `2` if any blocking finding remains unapproved.

## Decision points
- Auto-run without a second explicit user action → blocking by default.
- Install lifecycle script → report; blocking when the host workflow automatically installs dependencies before review.
- Hash-bound approval matches → permit that exact file version while retaining audit evidence.
- Parser cannot determine whether a startup trigger executes → fail closed for high-authority lifecycle surfaces and escalate.

## Expected output
Deterministic findings suitable for CI/pre-open hooks plus human-readable evidence.

## Metrics
Finding count, unapproved blockers, hash mismatches, scan duration, parser failures.

## Verification
Use fixtures containing known-dangerous and benign configurations. Verify no subprocess execution occurs.

## Failure handling
One retry is allowed for transient file-read errors. Persistent read/parse failure on an in-scope startup file blocks activation.

## Stop conditions
Stop successfully when all in-scope risky files are either absent, non-auto-executing, or hash-approved. Stop with block when any unapproved auto-execution surface or unresolved high-risk parser failure remains.