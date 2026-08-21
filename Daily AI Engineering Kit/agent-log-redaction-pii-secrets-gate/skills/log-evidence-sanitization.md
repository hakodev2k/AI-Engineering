# Log Evidence Sanitization Skill

## Purpose
Collect logs, traces, tool output, and incident evidence without exposing secrets or unnecessary personal data to agents, LLMs, tickets, pull requests, or shared artifacts.

## When to use
Use before sending production logs, HTTP traces, database errors, CI output, crash dumps converted to text, or copied terminal output into any AI-assisted workflow.

## Inputs
Evidence source, target task, sensitivity expectations, redaction policy, destination audience/tool.

## Preconditions
The collector knows where raw evidence comes from and has the minimum permission required to read it. Raw evidence remains in its original protected system whenever possible.

## Allowed tools
Repository search, local text processing, approved log viewers, deterministic redaction script, checksum/hash utilities.

## Constraints
1. Never paste raw evidence into an LLM before sanitization.
2. Collect the smallest time window and component scope that can answer the question.
3. Prefer IDs and hashes over full payload bodies.
4. Save the collected text to a temporary local path with restricted access when tooling requires a file.
5. Run `scripts/redact_logs.py` before handoff.
6. Treat exit code `2` as a sensitive-input stop requiring review; do not forward automatically.
7. Never preserve matched secret values in reports.
8. Delete temporary raw copies only through an approved local retention procedure; the agent must not perform destructive cleanup silently.

## Process
1. Define the investigation question and minimum evidence window.
2. Identify source systems and access boundaries.
3. Collect only relevant lines/events and record source metadata separately.
4. Run the redaction gate into a new sanitized artifact and report file.
5. Inspect counts and blocked types without reconstructing matched values.
6. If status is `sanitized`, hand off only the sanitized artifact.
7. If status is `blocked_sensitive_input`, send the report to a human/security owner and keep the artifact out of LLM context until reviewed.
8. After analysis, verify findings against source-system facts without copying raw secrets into the final report.

## Expected output
Sanitized evidence path, source metadata, redaction report path, status, counts by type, investigation findings, confidence, unresolved risks.

## Verification
The sanitized artifact exists; a second scan reports zero remaining configured matches for patterns not intentionally allowlisted; raw evidence was not included in the agent transcript; findings are supported by sanitized evidence or source-system metadata.

## Failure handling
Tool/configuration failure blocks handoff. Oversized input must be narrowed or chunked deterministically. Permission failure stops collection; never broaden access automatically. Two unsuccessful scope reductions stop and escalate.

## Stop conditions
Unknown data owner, unavailable redaction gate, unresolved private key/token/connection-string detection, permission escalation requirement, or inability to prove sanitized output is the artifact being shared.
