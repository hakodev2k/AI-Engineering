# Staleness Resolution Skill

## Purpose
Determine whether repository context is still valid for the current revision and refresh only the affected context.

## Trigger
Run before planning/editing, after branch changes, merges, pulls, rebases, file modifications, dependency changes, generated-code refreshes, or resumed agent sessions.

## Inputs
- validated context manifest
- current repository revision
- current source files
- task scope

## Process
1. Run `scripts/check-context-staleness.py` against the manifest.
2. Separate findings into `fresh`, `stale`, `missing`, and `unknown`.
3. Compute impacted context artifacts from changed source bindings.
4. Do not invalidate unrelated artifacts when their bound sources are unchanged.
5. Refresh stale/missing source evidence from the current repository.
6. Regenerate affected summaries/maps/index notes.
7. Update source hashes and capture revision.
8. Run the staleness check again.
9. Request independent freshness review before planning/editing.

## Rules
- A changed hash makes dependent derived context stale even when the path is unchanged.
- A changed commit alone is not sufficient to invalidate an artifact if every bound source hash is unchanged.
- Missing source files block dependent context.
- Unknown/unreadable sources fail closed.
- Agent memory cannot override current repository evidence.

## Expected output
A staleness report matching `schemas/staleness-report.schema.json` plus a refreshed manifest when required.

## Verification
A context set is usable only when all blocking findings are cleared and the independent reviewer returns `verified`.

## Retry policy
At most one automatic refresh retry for transient file/tool failures. Hash/content conflicts, deleted files, scope ambiguity, or revision mismatch are not retryable without investigation.

## Stop conditions
Stop before planning/editing while any blocking stale, missing, or unknown source remains.