# Sensitive Context Boundary Rules

## MUST

- Every boundary-crossing context release MUST name the destination and purpose.
- Candidate context MUST be minimized before scanning and release.
- External or unknown destinations MUST be treated as untrusted unless policy explicitly classifies them otherwise.
- Deterministic scanning MUST run before external transmission of repository-derived, log-derived, environment-derived, database-derived, or user-derived context.
- Every finding MUST have one disposition: `allow`, `redact`, `approval-required`, or `deny`.
- Raw credentials, private keys, access tokens, and authentication secrets MUST be denied for external release.
- Redaction MUST produce a separate artifact; the original candidate MUST remain unchanged.
- Reports and audit evidence MUST avoid storing detected raw secret values.
- Human approval MUST be tied to the exact destination, purpose, artifact hash, and override reason.
- Classification MUST be repeated when source content, destination, purpose, or policy changes.
- The destination adapter MUST consume the verified release artifact rather than the original candidate.
- A release MUST distinguish `prepared`, `released`, and `verified` status.
- Production logs and data exports MUST be assumed potentially sensitive until scanned and reviewed.

## MUST NOT

- MUST NOT bypass a deny decision by switching tools, agents, transport, or model providers.
- MUST NOT treat encryption in transit as authorization to disclose restricted context.
- MUST NOT print detected secrets to console, telemetry, exceptions, reports, or review comments.
- MUST NOT downgrade a detector finding merely because it blocks progress.
- MUST NOT reuse a previous approval for changed content or a different destination.
- MUST NOT send full files when a smaller excerpt can satisfy the task.
- MUST NOT upload `.env`, private-key files, credential stores, secret manifests, database dumps, or production configuration wholesale to external destinations.
- MUST NOT disable detectors, weaken policy, or change trust classification without explicit human approval.
- MUST NOT claim a release is verified only because a sanitized file was generated.
- MUST NOT allow a subagent to expand context scope beyond the parent release decision without rerunning the gate.

## SHOULD

- SHOULD prefer synthetic or representative data over real customer or employee data.
- SHOULD prefer hashes, stable pseudonyms, or opaque identifiers when raw identifiers are unnecessary.
- SHOULD use allowlisted paths and fields for recurring workflows.
- SHOULD scan before semantic review so the reviewer sees metadata instead of unnecessary raw secrets.
- SHOULD keep destination adapters thin and policy-independent.
- SHOULD retain only the minimum non-sensitive release evidence needed for auditability.
- SHOULD use local/trusted tools for sensitive preprocessing when available.
- SHOULD fail closed when policy, destination trust, or report integrity cannot be determined.

## Mandatory human approval boundaries

Explicit human approval is required before any workflow may:

- override an `approval-required` decision;
- release customer/employee PII to a new processor;
- release production configuration, restricted incident evidence, database extracts, or certificate material externally;
- change a destination from trusted/internal to external/untrusted;
- disable or weaken a detector or release rule;
- add a new external processor for restricted context;
- change infrastructure, production configuration, secrets, security controls, database schema, public API contracts, or large dependency sets as a downstream consequence of the agent task.

Approval does not convert `deny` categories such as raw private keys or clearly identified credentials into releasable external context unless organizational policy is deliberately changed by an authorized human outside this workflow.