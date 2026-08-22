# Sanitize-Before-LLM Workflow

```text
Trigger -> Scope evidence -> Collect raw slice -> Redaction gate
                                      | blocked -> human/security review -> stop
                                      | sanitized -> independent re-scan -> LLM/investigation handoff
```

## Trigger
An AI-assisted task requires logs, traces, terminal output, incident evidence, or tool results that may contain secrets or personal data.

## Entry conditions
Investigation question and target destination are known; source access is authorized; policy exists.

## Inputs
Source location, component/time scope, destination, `config/redaction.yaml`.

## Context
Repository config, logging schema, authentication formats, source-system metadata, and approved retention/access rules.

## Stages
1. **Scope — Evidence Collector:** define minimum services, fields, IDs, and time range.
2. **Collect — Evidence Collector:** export relevant text without modifying source systems.
3. **Gate — deterministic script:** `python scripts/redact_logs.py --input <raw> --output <sanitized> --policy config/redaction.yaml --report redaction-report.json`.
4. **Checkpoint:** exit `3`/unexpected failure blocks. Exit `2` means blocked-sensitive-input and requires human/security review; do not send downstream. Exit `0` continues.
5. **Verify — Redaction Verifier:** scan sanitized output again and verify destination artifact identity.
6. **Handoff:** provide only verified sanitized evidence and source metadata to the analysis agent.
7. **Analyze:** downstream agent performs incident/debugging work without requesting raw secrets.
8. **Complete:** findings cite sanitized evidence/source metadata and document residual risk.

## Produced artifacts
Sanitized evidence file, redaction report, source/scope metadata, verifier result, downstream findings.

## Checkpoints
- Raw evidence remains outside LLM context.
- Sensitive match values never enter reports.
- Second scan completes before high-risk handoff.
- Policy weakening invalidates prior verification.

## Retry rules
- Redaction tool transient/runtime failure: retry once with unchanged inputs.
- Oversized input: narrow or split scope at most twice; preserve source metadata.
- Verification failure: one fresh re-redaction from the original protected source; if still failing, escalate.
- Permission failures are not retryable through permission expansion.

## Approval points
Security/data-owner approval is required before removing blocked detector types, materially broadening allowlists, changing raw evidence retention/deletion, or exporting a blocked-sensitive artifact to a new trust boundary.

## Failure paths
Unknown destination -> stop. Gate unavailable -> stop. Invalid UTF-8/binary evidence -> transform through an approved extractor outside the package and re-enter workflow. Blocked sensitive type -> human/security review. Remaining match on re-scan -> stop. Artifact identity mismatch -> stop.

## Definition of Done
Evidence was minimized; raw data was not sent to the LLM; deterministic redaction succeeded; independent re-scan verified the downstream artifact; required approval exists for policy exceptions; findings are evidence-backed; unresolved privacy/security risk is documented.
