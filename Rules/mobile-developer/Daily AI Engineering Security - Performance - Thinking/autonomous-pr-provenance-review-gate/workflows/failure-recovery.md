# Workflow — Provenance Failure Recovery

## Trigger
The pre-merge gate returns `block`, `additional_review_required`, or invalid evidence.

## Goal
Resolve missing repository evidence safely with bounded retries and without speculative identity investigation.

## Detection
Use gate reasons plus authoritative SCM/API errors.

## Evidence
Preserve the PR head SHA, latest-push timestamp, changed-path list, review snapshot, commit signature state, and required-check state.

## Stages
1. Classify failure as missing metadata, failed status check, missing signature, insufficient independent approval, stale approval, missing Code Owner review, or unknown provenance.
2. Refresh metadata once.
3. If the refresh fails, use one alternate authoritative fetch path.
4. For control failures, request/remediate the exact missing control rather than retrying automatically.
5. For unknown nonblocking provenance, require independent security review.
6. Re-run the gate once evidence changes.

## Retry policy
Maximum two metadata-fetch attempts: one refresh and one fallback. Gate re-execution occurs only after evidence materially changes.

## Fallback
Keep the PR unmerged. Existing verified branch/ruleset protections remain in force.

## Escalation
Repository maintainer/security owner handles unavailable metadata, policy exceptions, or disputed provenance evidence.

## Stop condition
Required evidence passes, or retry budget is exhausted. Never convert an unresolved failure into allow.

## Definition of Done
The PR is either verified under policy or remains blocked/additional-review-required with an exact evidence gap documented.