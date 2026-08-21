# Context Sensitivity Classification Skill

## Purpose

Classify candidate context before it crosses an AI/tool boundary, identify why each sensitive element matters, and produce a minimal release decision that can be enforced deterministically.

## When to use

Use whenever repository text, logs, tickets, database samples, environment output, user content, or generated artifacts may be sent to:

- an external model;
- an external API;
- an MCP server;
- a subagent with different permissions;
- telemetry or logging;
- chat, issue, or review systems.

## Inputs

- candidate context source or text artifact;
- intended destination;
- purpose of the transfer;
- trust level of the destination;
- applicable sensitivity policy;
- known repository/organization constraints.

## Preconditions

1. The destination is known.
2. The purpose is explicit enough to judge necessity.
3. The candidate context can be scanned without modifying the original.
4. If the destination trust level is unknown, treat it as external/untrusted.

## Process

1. **Identify the exact purpose.** State what downstream reasoning or action requires this context.
2. **Minimize before classifying.** Remove unrelated files, stack traces, fields, headers, rows, or conversation history.
3. **Run the deterministic scanner.** Produce a sanitization report before semantic review.
4. **Review detected categories.** Typical classes include credentials, private keys, PII, internal identifiers, production configuration, customer data, and proprietary material.
5. **Look for semantic sensitivity not captured by regex.** Examples: legal privilege, unreleased product plans, security architecture, internal incident notes, confidential business data.
6. **Assign a disposition per finding:** `allow`, `redact`, `approval-required`, or `deny`.
7. **Check destination suitability.** The same data may be acceptable for a local trusted tool but prohibited for an external processor.
8. **Check necessity.** If a sensitive item is not necessary for the stated purpose, remove it instead of requesting approval.
9. **Record rationale without copying the raw sensitive value.** Use category, location, detector, and reason.
10. **Escalate ambiguous high-risk cases.** Send the report and context-release metadata to the Privacy & Security Reviewer, not the raw secret value unless policy explicitly permits it.
11. **Stop if policy denies release.** Do not search for an alternate transport to bypass the decision.

## Allowed tools

- repository/file search;
- read-only log inspection;
- deterministic scanner;
- policy/config reader;
- read-only metadata about destination/trust classification.

## Constraints

- Do not include detected raw secret values in reports.
- Do not downgrade severity merely to make a workflow continue.
- Do not treat obfuscation as redaction unless the original value cannot be reconstructed from the released artifact.
- Destination changes invalidate the classification decision.
- Candidate-context changes invalidate the previous scan.

## Expected output

A classification decision containing:

- destination;
- purpose;
- candidate artifact identifier/hash;
- findings by category and severity;
- disposition for each finding;
- unresolved ambiguity;
- required human approval, if any;
- whether sanitized release may proceed.

## Verification

Classification is verified when:

- deterministic findings and semantic findings are reconciled;
- no finding lacks a disposition;
- destination/purpose match the release request;
- denied material is not present in the release artifact;
- approval-required items are either removed or explicitly approved.

## Failure handling

- Scanner unavailable: retry once after repairing the local configuration, then stop.
- Policy unavailable: stop; never infer a permissive default.
- Destination unknown: classify as external/untrusted and escalate if that blocks useful work.
- Semantic ambiguity: one reviewer cycle; unresolved high-risk ambiguity becomes approval-required or deny.

## Stop conditions

Stop when any of the following is true:

- policy returns deny;
- required approval is missing;
- source or destination changed after classification;
- report is invalid;
- the task can be completed with less context and minimization has not yet been attempted.