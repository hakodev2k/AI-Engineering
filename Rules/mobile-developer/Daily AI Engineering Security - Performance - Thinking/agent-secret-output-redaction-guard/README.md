# Agent Secret-Output Redaction Guard

A deterministic output-boundary guard that masks registered secret values and high-confidence credential patterns before tool output is persisted or returned to an agent. It also provides a conservative preflight check for commands that commonly dump credentials or the process environment.

## Purpose

Provide a dependency-free redaction and command-preflight reference implementation for output paths that may reach logs, transcripts, persistence, or model context.

## Threat model and limits

The guard reduces accidental disclosure through stdout, stderr, transcripts, logs, and model reinjection. It does not replace a secret manager, sandbox, least-privilege permissions, provider-side rotation, or repository secret scanning. Pattern matching cannot identify every credential and can produce false positives; known-value masking is stronger when the host supplies a narrow allowlist of secret environment-variable names.

Read [`evidence/research.md`](evidence/research.md) for the evidence basis and limitations.

## Package contents

```text
agent-secret-output-redaction-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── rules/redaction-safety.md
├── scripts/redact_output.py
└── tests/test_redact_output.py
```

## Prerequisites

Python 3.10 or newer. The implementation uses only the Python standard library and does not require network access.

## Output redaction

Run from this package directory:

```bash
some-command 2>&1 | python scripts/redact_output.py --config config/policy.json
```

To make detection visible to an automation gate while still emitting only sanitized text:

```bash
some-command 2>&1 | python scripts/redact_output.py --config config/policy.json --fail-on-detection
```

Exit `0` means no match or sanitized output was accepted. Exit `3` with `--fail-on-detection` means at least one value was masked. Configuration or input errors exit `2`. The script never prints registered secret values in its diagnostics.

## Command preflight

```bash
python scripts/redact_output.py --config config/policy.json --check-command "printenv"
```

Exit `4` means the command matches a configured high-risk environment-dump pattern and should be replaced by a targeted, redacted alternative or routed through explicit human review. This lexical preflight is defense in depth, not a shell parser or authorization engine.

## Configure known-value masking

Edit only the list of environment-variable names in `config/policy.json`; never put secret values in the file. At runtime the guard reads values for those exact names from its process environment and masks exact occurrences that meet `minimum_secret_length`.

The default names are examples. Remove names your environment does not use and add provider-specific names deliberately. Ensure the guard process receives only the secrets it must mask.

## Test

```bash
python -m unittest discover -s tests -p "test*.py"
```

Tests use synthetic tokens only. Never add a real credential to a fixture, snapshot, failure message, or test environment.

## Host integration

Place the guard between tool execution and every persistence or reinjection path, including stdout, stderr, hook output, structured tool results, telemetry, and error handling. Mask before logging. On any suspected historical leak, rotate the affected credential; transcript cleanup alone is insufficient.
