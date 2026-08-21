# Verification Report

**Package:** `agent-workspace-drift-revalidation-guard`  
**Category:** Thinking  
**Date:** 2026-08-20 (UTC+7)

## Implemented

- Trusted workspace snapshots bind branch, HEAD, Git status digest, repository identity, and explicit file hashes.
- Drift check returns distinct exit codes for safe continuation, scoped revalidation, hard stop, and guard failure.
- Branch drift hard-stops by default.
- Tracked file content drift is hash-based and requires revalidation.
- Missing tracked files hard-stop by default.
- Snapshot capture rejects tracked paths resolving outside the workspace root.
- Hooks cover plan capture, resume, pre-write, evidence reuse, post-revalidation, and final completion.
- Workflows use bounded revalidation retries.
- Assumption/evidence dependency bindings support scoped invalidation rather than full-repository rereads.
- Independent verification is required for high-impact drift repair.

## Static verification

The saved `workspace_guard.py` was fetched back from GitHub after write and reviewed for:

- valid CLI subcommands and required arguments;
- read-only source inspection;
- atomic snapshot replacement;
- SHA-256 content hashing;
- canonical root containment for tracked files;
- branch/HEAD/file/missing-file comparison;
- deterministic classification and meaningful exit codes;
- exception handling with fail-closed error code.

The package includes `tests/test_workspace_guard.py` with fixtures for:

1. unchanged workspace → pass;
2. tracked content change → `revalidation-required`;
3. branch change → `hard-stop`;
4. tracked file deletion → `hard-stop`;
5. outside-root tracked path → capture rejection.

The package also includes `scripts/drift_benchmark.py` for a minimal clean/file-change/branch-change benchmark.

## Runtime execution status

A local attempt to clone the saved repository for runtime execution was blocked because the execution container could not resolve `github.com`. This is an environment/network limitation, not a package result. Therefore this report does **not** claim that the included runtime tests were executed in that container.

Status labels are kept explicit:

- **Implemented:** yes.
- **Static-verified against the saved GitHub artifact:** yes.
- **Runtime test harness included:** yes.
- **Runtime tests executed in this automation environment:** no, blocked by DNS resolution.

## Security / safety review

- Source files are never modified by the guard.
- Snapshot data contains hashes and metadata, not source content or secrets.
- Outside-root dependency paths are rejected.
- Failure to prove freshness returns an error/hard-stop rather than silently accepting stale state.
- No destructive Git command is used.

## Metrics to collect in deployment

- `drift_checks_total{classification}`
- `stale_write_attempts_blocked_total`
- `resume_drift_detected_total`
- `revalidation_attempts_total`
- `revalidation_files_read / tracked_files`
- `stale_evidence_reuse_blocked_total`
- `drift_check_latency_ms`
- `post_completion_drift_incidents_total`

## Definition of Done for an integration

An integration is Verified only when:

1. plan dependencies are captured in a trusted snapshot;
2. all mutation paths invoke the pre-write gate;
3. branch/file drift fixtures produce expected classifications;
4. changed dependencies invalidate bound assumptions/evidence;
5. automatic revalidation is bounded to configured retries;
6. final freshness check runs after the last source mutation;
7. required build/test evidence is current for the final snapshot;
8. no blocking drift remains.
