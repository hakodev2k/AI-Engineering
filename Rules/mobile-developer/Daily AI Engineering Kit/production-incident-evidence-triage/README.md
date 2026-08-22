# Production Incident Evidence Triage AI Role

Purpose: help engineers investigate production incidents using evidence-driven diagnosis, controlled remediation, and verification.

## Purpose

Provide a reference workflow plus a safe local staging initializer for source-attributed, sanitized incident evidence.

## Included Assets

- skills: incident investigation, evidence collection, root cause analysis
- rules: safety boundaries, approval gates, verification requirements
- subagents: investigator, log analyst, remediation reviewer
- workflows: incident lifecycle execution
- scripts: local evidence-directory initializer
- knowledge: operational principles and anti-patterns

## Operating Principle

Never treat assumptions as facts. Every hypothesis must be backed by observable evidence, a reproducible signal, or a documented production observation.

## Prerequisites and run

Requires Bash. From an approved, disposable incident workspace:

```bash
bash path/to/production-incident-evidence-triage/scripts/collect-evidence.sh
```

The script creates `incident-evidence/` if absent and prints instructions; it does **not** access logs, metrics, traces, remote systems, or credentials. Exit `0` means only that the local staging directory exists. Store sanitized evidence there using separately approved read-only tools, follow `workflows/`, and complete `verification/` before claiming a supported root cause.

## Verification

Use the files under `verification/` to check that every material claim cites a source and timestamp, unavailable evidence is disclosed, competing hypotheses are addressed, and no remediation was executed without approval. Directory creation alone is never a verified investigation.
