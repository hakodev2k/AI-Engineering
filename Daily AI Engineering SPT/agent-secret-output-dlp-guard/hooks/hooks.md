# Hooks

## Hook: pre-tool-risk-check
- **Trigger:** immediately before shell, file-read, HTTP, connector, or credential-adjacent tool execution.
- **Action:** inspect normalized tool metadata for sensitive paths, environment-dump commands, credential stores, and broad reads.
- **Command/script:** `python scripts/secret_dlp_guard.py precheck --tool <tool> --target <target> --policy config/policy.json`
- **Expected result:** JSON decision `allow`, `deny`, or `approval-required` with a reason and optional safe alternative.
- **Failure behavior:** deny execution; never fall back to unguarded execution.

## Hook: post-tool-output-dlp
- **Trigger:** tool returns stdout, stderr, text, structured fields, headers, or error output.
- **Action:** scan and redact before any downstream sink receives the result.
- **Command/script:** `python scripts/secret_dlp_guard.py sanitize --input <raw-file> --output <sanitized-file> --audit <audit-file> --policy config/policy.json`
- **Expected result:** sanitized output plus plaintext-free audit metadata.
- **Failure behavior:** quarantine raw output and emit a safe `dlp_scanner_failed` result.

## Hook: transcript-write-assertion
- **Trigger:** immediately before transcript/session persistence.
- **Action:** reject result envelopes not marked `dlp_status=clean|redacted|blocked` and `dlp_version` matching an accepted policy version.
- **Command/script:** adapter assertion or `verify` subcommand.
- **Expected result:** only sanitized envelopes are persisted.
- **Failure behavior:** block write and raise a security event.

## Hook: model-context-assertion
- **Trigger:** before tool result is appended to model context.
- **Action:** enforce the same sanitized-envelope contract used by transcript persistence.
- **Expected result:** model never receives raw execution output.
- **Failure behavior:** replace result with a safe blocked envelope.

## Hook: startup-known-secret-registration
- **Trigger:** agent runtime startup or environment refresh.
- **Action:** load values only from environment variable names matching configured sensitive-name rules; store values in process memory for exact matching; never serialize them.
- **Expected result:** registry count/fingerprints only.
- **Failure behavior:** if registration is required by policy and fails, disable tool execution that can expose environment/config data.

## Hook: final-security-verification
- **Trigger:** before enabling a new adapter or DLP policy in production.
- **Action:** run `python tests/test_secret_dlp_guard.py` and synthetic sink-level integration tests.
- **Expected result:** seeded plaintext absent from sanitized/transcript/model fixtures; high-confidence detection recall is 100%.
- **Failure behavior:** deployment is blocked.

## Lifecycle order

```text
Tool request
  -> pre-tool-risk-check
  -> execute (raw output quarantined)
  -> post-tool-output-dlp
  -> sanitized envelope
       -> model-context-assertion -> model
       -> transcript-write-assertion -> storage/UI
       -> telemetry/cache/subagent sinks
  -> final audit metadata
```

No downstream path may bypass `post-tool-output-dlp`.