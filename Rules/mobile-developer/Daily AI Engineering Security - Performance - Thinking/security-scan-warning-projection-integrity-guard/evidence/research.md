# Research — Security Scan Warning Projection Integrity Guard

## Topic
Security Scan Warning Projection Integrity Guard

## Category
Security

## Problem
Security scans can technically complete while machine-readable downstream surfaces silently drop run-level warnings such as repository drift, unverifiable cost limits, or cleanup failures. CI consumers then see a successful result without the evidence needed to know that the scan describes stale or degraded state.

## Why it matters now
OpenAI's `codex-security` repository has multiple August 2026 P1 reports showing warnings can disappear on distinct export paths. Issue #251 shows run warnings are omitted from SARIF even when a scan target drifted. Issue #248 shows `bulk-scan` similarly records a repository as completed without preserving warnings in the campaign ledger. These are not model-quality problems; they are control-plane evidence-integrity failures.

## Affected users
Security platform engineers, CI/CD teams, AppSec teams, repository owners, bulk-scan operators, SARIF consumers, and automated release gates.

## Current public evidence
### Observed evidence 1 — SARIF projection
OpenAI `codex-security` issue #251, opened 2026-08-04 and still open as of the research date, reports that target-drift warnings never reach SARIF because the projection only builds `toolExecutionNotifications` from deferred coverage rows and only when completeness is not `complete`. A drifted target can remain coverage-complete while stale, so the warning disappears.

Source: https://github.com/openai/codex-security/issues/251

### Observed evidence 2 — bulk scan ledger
OpenAI `codex-security` issue #248, opened 2026-08-04 and still open, reports that `bulk-scan` does not register an `onWarning` observer and its JSONL receipt has no warning field. A drifted repository can therefore be recorded as `status: completed` with no campaign-level signal.

Source: https://github.com/openai/codex-security/issues/248

### Supporting standard surface
SARIF supports run invocation notifications specifically so tools can report noteworthy execution conditions separately from findings. GitHub code scanning consumes SARIF as a machine-readable security surface, making projection completeness operationally important.

Sources:
- https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning
- https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html

## Existing approaches
- Exit non-zero on terminal scan failures.
- Export findings to SARIF.
- Record per-run or per-repository status in JSON/JSONL.
- Show warnings interactively in CLI output.
- Preserve coverage completeness separately from execution health.

## Remaining limitations
A successful exit code does not prove warning-free execution. Findings, coverage, and execution warnings are different channels, yet many pipelines gate only on findings/status. If a projection omits warnings, downstream automation cannot distinguish a clean completed scan from a completed-but-stale scan. Human-readable warning output is also insufficient for unattended bulk execution.

## Root-cause analysis
1. Warning channels are observer/event based rather than first-class fields in the durable scan result.
2. Exporters build output from different subsets of scan state.
3. `coverage.completeness` is incorrectly usable as a proxy for execution integrity even though target drift is orthogonal to coverage.
4. CI gates often validate schema but not semantic preservation across projections.
5. There is no deterministic cross-projection invariant asserting that every durable warning survives into each supported machine-readable output.

## Improvement opportunity
Add a reusable projection-integrity contract that normalizes warnings into stable identities, records them in a canonical receipt, compares warning sets across source result, SARIF, and bulk ledger, and blocks completion when a required warning disappears. The guard does not invent security findings or change scanner severity; it protects evidence fidelity.

## Goal
Guarantee that every material run warning recorded by a security scan is preserved, attributable, and machine-visible in all declared downstream projections.

## Metrics
- Warning preservation ratio = projected unique warnings / canonical unique warnings; target 100% for required projections.
- Orphan projected warning count; target 0.
- Missing warning count; target 0.
- Completed-with-unprojected-warning runs; target 0.
- Schema-valid projection rate; target 100%.

## Trigger
After a security scan completes and before SARIF upload, bulk campaign completion, release gating, or archival.

## Inputs
Canonical scan result or event stream, projected SARIF, bulk ledger/receipt, projection policy, warning identity fields.

## Outputs
Integrity report with missing/orphan warnings, blocking decision, normalized warning fingerprints, and verification status.

## Interpretation
The observed bugs are implementation-specific, but they expose a general engineering weakness: downstream security automation can only enforce what the reporting surface preserves. A warning that exists only in transient CLI output is effectively lost to machine policy.

## Proposed solution
Use a deterministic warning normalization and cross-projection verifier, backed by enforceable rules and a bounded repair/verification workflow. Do not convert warnings into findings merely to make them visible; preserve their semantics and fail the evidence-integrity gate when required projections lose them.