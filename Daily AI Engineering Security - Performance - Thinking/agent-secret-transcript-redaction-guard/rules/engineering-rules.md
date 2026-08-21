# Engineering Rules

## MUST
- MUST sanitize tool output before it is sent to the model or any durable transcript/log sink.
- MUST fail closed when the sanitizer fails, the policy cannot be loaded, output exceeds the configured safety bound, or a high-confidence residual remains.
- MUST register known secret values only from explicitly approved secret sources; do not enumerate all environment variables just to discover values.
- MUST mask exact known values before generic pattern rules and process longer exact values first.
- MUST cover stdout, stderr, structured result fields, error messages, retries/replays, hook output and transcript serialization.
- MUST treat transcript storage as sensitive even when it is local-only.
- MUST use synthetic credentials in tests.
- MUST keep sanitizer metrics value-free: counts, types, sizes and opaque IDs only.
- MUST require explicit human approval before bypassing a high-risk command preflight in a real secret-bearing environment.
- MUST revoke/rotate credentials when plaintext exposure to an untrusted or durable sink is confirmed.
- MUST add a regression fixture for every confirmed leak class.

## MUST NOT
- MUST NOT rely on CLAUDE.md, AGENTS.md, prompt text, model memory or hidden reasoning as the only secret control.
- MUST NOT forward raw output when a PostToolUse rewrite is rejected or unsupported.
- MUST NOT print secret values in sanitizer diagnostics, test failure messages, metrics, incident tickets or hashes with reversible encoding.
- MUST NOT silently downgrade a high-confidence leak from block to warn because of developer inconvenience.
- MUST NOT assume `.gitignore` prevents transcript/model leakage.
- MUST NOT run broad `env`, `printenv`, `/proc/*/environ`, or equivalent credential-enumeration commands unless explicitly justified and approved.
- MUST NOT automatically delete regulated/required audit logs during incident cleanup.
- MUST NOT claim protection without verifying the actual pre-persistence/model boundary.

## SHOULD
- SHOULD provide safe alternatives that return key names, presence booleans, metadata or validation status instead of values.
- SHOULD separate high-confidence credential patterns from lower-confidence entropy heuristics.
- SHOULD version the policy and record the version used for each sanitized tool result.
- SHOULD measure false positives on representative non-secret logs before expanding generic patterns.
- SHOULD support a quarantine path for unrepresentable structured outputs instead of passing through raw content.
- SHOULD periodically scan stored transcripts with synthetic canaries to detect unprotected write paths.
- SHOULD keep redaction deterministic and independent of model choice.

## Enforcement tests
A change is non-compliant if any of these statements is true:
1. A fake registered secret is present in model-bound or transcript-bound output.
2. A configured high-confidence token pattern survives sanitation.
3. A blocked environment-dump command passes preflight without an explicit override mechanism.
4. Sanitizer failure causes raw output pass-through.
5. A security report contains the original fixture secret.
