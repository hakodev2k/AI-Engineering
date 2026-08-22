# Engineering Rules

## MUST

1. MUST sanitize tool output before model context, transcript persistence, UI rendering, telemetry, cache, or subagent handoff.
2. MUST treat shell stdout/stderr, file reads, HTTP responses, connector results, and tool error text as potentially secret-bearing.
3. MUST register configured sensitive environment-variable values with the scanner in memory without logging them.
4. MUST fail closed if scanning fails and raw output would otherwise cross a trust boundary.
5. MUST redact exact known-secret matches regardless of surrounding text.
6. MUST block private-key material by default.
7. MUST attach structured metadata describing detector/reason/count without storing the matched plaintext.
8. MUST use deterministic enforcement at the host/harness boundary; prompt instructions may only be defense-in-depth.
9. MUST preserve tool-result semantics: a blocked result must be represented as blocked, not as a successful empty result.
10. MUST bound the maximum output size and handle oversized results before they are sent to the model.
11. MUST run seeded-secret regression tests for every supported tool-output adapter.
12. MUST distinguish redaction from authorization; permission to run a tool does not imply permission to expose returned secrets.
13. MUST treat known secret-bearing paths and broad environment-dump commands as high risk before execution.
14. MUST keep raw-secret overrides disabled by default and scoped to one operation when supported.
15. MUST record security events with timestamps, tool identity, detector, action, and correlation ID.
16. MUST ensure audit logs do not contain raw secret values.
17. MUST rotate any real credential known to have escaped into persisted/model-visible output.

## MUST NOT

1. MUST NOT rely solely on `AGENTS.md`, `CLAUDE.md`, system prompts, or model self-restraint to prevent secret disclosure.
2. MUST NOT perform UI-only masking while raw data remains in transcript or model context.
3. MUST NOT log detector match text for debugging.
4. MUST NOT store known secret values in config files committed to source control.
5. MUST NOT assume `.gitignore`, `.claudeignore`, or similar ignore files protect process environment or alternate read paths.
6. MUST NOT use entropy as the sole blocker for arbitrary text; high-entropy detection requires contextual evidence or a tuned policy.
7. MUST NOT automatically retry a blocked tool call with a broader read.
8. MUST NOT bypass scanning for “read-only” tools.
9. MUST NOT pass raw output to a summarizer before redaction.
10. MUST NOT include secrets in exception messages, metrics labels, traces, or correlation fields.
11. MUST NOT allow a persistent/global raw-secret override.
12. MUST NOT claim zero leakage without sink-by-sink canary verification.

## SHOULD

1. SHOULD prefer allowlisted safe-field reads over broad config-file dumps.
2. SHOULD parse structured output before falling back to regex-only scanning.
3. SHOULD merge overlapping detections so one secret becomes one redaction event.
4. SHOULD use exact-value detection for credentials already known to the runtime.
5. SHOULD maintain provider-specific token patterns as versioned policy data.
6. SHOULD test Windows, Linux, and macOS command variants where the agent supports them.
7. SHOULD scan both stdout and stderr.
8. SHOULD expose a safe marker such as `<REDACTED:known-secret>` so the model can reason about missing data without seeing it.
9. SHOULD measure scanner latency and false-positive rates.
10. SHOULD minimize how long raw output stays in memory.
11. SHOULD separate secure operator-only secret views from model-visible output when intentional access is required.
12. SHOULD provide incident-response guidance when a real secret is detected after prior persistence.

## Observable checks

| Requirement | Verification |
|---|---|
| Pre-persistence redaction | Seeded secret absent from model fixture and stored transcript fixture |
| Known-value protection | Every registered canary value becomes a redaction marker |
| Fail closed | Forced scanner exception yields blocked envelope only |
| No plaintext audit | Audit fixture contains hashes/reasons but no canary |
| High-risk precheck | `env`, `printenv`, `.env` broad read fixtures are denied/approval-required |
| Bounded output | Oversized fixture is truncated/blocked before downstream delivery |
| No hidden bypass | Every registered tool adapter appears in coverage report |