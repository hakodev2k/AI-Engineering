# Evidence Management Rules

## Purpose
Ensure compliance conclusions are supported by reliable, reproducible, and appropriately retained evidence.

## Scope
Applies to test results, configuration snapshots, approvals, logs, reports, tickets, attestations, scans, and other compliance evidence.

## MUST
- Evidence MUST identify what control or requirement it supports and the period or release to which it applies.
- Evidence MUST be generated from authoritative sources where practical and protected from unauthorized alteration.
- Repeated controls MUST have evidence collection frequencies aligned with the rate at which compliance state can change.
- Evidence gaps that affect a material conclusion MUST be reported rather than inferred away.

## MUST NOT
- MUST NOT treat screenshots or manual statements as stronger evidence than available deterministic system records.
- MUST NOT reuse stale evidence for a changed system without validating continued applicability.

## SHOULD
- Automate evidence collection for repeatable controls while preserving provenance and timestamps.

## Exceptions
Manual or indirect evidence requires documented limitations, corroboration, and reviewer acceptance.

## Verification
Review evidence metadata, provenance, timestamps, integrity controls, retention settings, and control-to-evidence mappings.