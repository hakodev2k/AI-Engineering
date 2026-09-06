# AI Secret Exposure Monitoring

## Purpose
Detect secrets, credentials, tokens, connection strings, private keys, and other sensitive authentication material entering or leaving AI workflows.

## When to use
Use for coding assistants, chat systems, agents, RAG applications, support copilots, and model pipelines that may process confidential operational data.

## Inputs
Prompt/response telemetry or derived detectors, DLP findings, source-control secret fingerprints, tool-call metadata, retrieval provenance, and incident context.

## Preconditions
Secret-detection controls are approved for the data paths being inspected and sensitive values can be safely fingerprinted or redacted.

## Context to inspect
Inspect prompt construction, uploaded files, retrieved documents, model responses, logs, traces, tool arguments, clipboard-like integrations, and outbound connectors.

## Core knowledge
Secrets may be exposed accidentally by users, retrieved from indexed content, generated into logs, or leaked through compromised workflows. Monitoring should minimize secondary exposure by storing hashes, fingerprints, or redacted evidence rather than raw credentials.

## Procedure
1. Inventory secret types relevant to the environment.
2. Identify AI ingress, context, output, logging, and tool paths where secrets may appear.
3. Implement high-confidence pattern, entropy, and fingerprint checks.
4. Redact sensitive findings in security telemetry.
5. Correlate findings with principal, session, source, and destination.
6. Distinguish test credentials from live material using controlled allowlists.
7. Escalate confirmed live-secret exposure for rotation and containment.
8. Search downstream logs and stores for propagation.
9. Retest after remediation.

## Decision points
Prefer fingerprint-based matching for known credentials. Use probabilistic secret detection for unknown material but require confirmation before disruptive action. Rotation urgency depends on privilege, exposure destination, and evidence of use.

## Common failure patterns
Copying raw secrets into tickets, alerting on examples or placeholders, scanning only model responses, failing to rotate exposed credentials, and overlooking logs or traces that retained the value.

## Verification
Implemented means secret detectors cover relevant AI data paths. Verified means seeded test secrets are detected and redacted, and incident procedures confirm credential invalidation when required.

## Expected output
Detection coverage, safe evidence, affected paths, severity, rotation actions, and validation results.

## Stop conditions
Escalate when privileged production credentials are exposed, rotation ownership is unclear, or evidence suggests credential use by an unauthorized actor.