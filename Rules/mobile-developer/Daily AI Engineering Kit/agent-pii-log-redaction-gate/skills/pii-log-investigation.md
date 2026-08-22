# Skill: PII Log Investigation

## Purpose
Determine whether logs, traces, test artifacts, support bundles, or generated diagnostics contain sensitive data that should not be committed, attached to tickets, or passed to an AI agent.

## When to use
Use before sharing logs externally, after changing logging code, during incident evidence collection, or when CI detects a sensitive-data finding.

## Inputs
- Repository path and changed files.
- Candidate log or diagnostic files.
- `config/redaction-policy.yaml`.
- Any project-specific approved allowlist.

## Preconditions
- Work on copies of production evidence when possible.
- Do not fetch additional production data merely to make the scan more complete.
- Preserve original evidence location and access controls.

## Allowed tools
Repository search, local file reads, deterministic scanner, test runner, structured log viewer, and approved observability read access.

## Constraints
Do not paste raw detected values into chat, issues, PRs, reports, or agent handoffs. Findings use type, location, severity, and redacted samples only.

## Procedure
1. Identify log-producing entry points touched by the change.
2. Locate nearby logging statements, serializers, exception enrichment, HTTP middleware, database diagnostics, telemetry processors, and test artifact writers.
3. Enumerate candidate files and confirm they are non-binary.
4. Run `python scripts/pii_log_gate.py --policy config/redaction-policy.yaml --input <files> --report pii-gate-report.json`.
5. Classify each finding as confirmed sensitive data, safe false positive, or unresolved.
6. For confirmed findings, trace the field to its source and logging call.
7. Prefer source-level minimization over downstream masking: omit, hash, tokenize, or structurally redact the field before emission.
8. If a downstream redactor is required, document why source-level removal is impractical.
9. Re-run the scanner on representative output.
10. Inspect the diff to ensure no secrets, raw PII, or broad logging expansion was introduced.

## Expected output
A result containing status, finding count, type, severity, affected file/line, evidence source, remediation decision, and verification status.

## Verification
No unapproved high/critical findings remain; representative logs preserve enough operational context; tests and package verification pass.

## Failure handling
Scanner/tool failure is not a pass. Preserve stderr and command, retry once for transient environment failure, then stop and escalate.

## Stop conditions
Stop before requesting broader production access, changing retention/security controls, or uploading raw sensitive evidence without explicit human approval.
