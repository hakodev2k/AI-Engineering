# Integration Guide

## Integration objective
Insert the DLP guard at the runtime boundary where raw tool results first return from execution, before any model, transcript, UI, telemetry, cache, tracing, or subagent consumer can observe them.

## Required architecture

```text
Agent planner
   |
   v
Pre-tool risk gate
   |
   v
Tool executor
   |
   | raw result — quarantine scope only
   v
Secret Output DLP Guard
   |
   +--> sanitized envelope --> model context
   +--> sanitized envelope --> transcript/UI
   +--> sanitized envelope --> telemetry/cache/trace
   +--> sanitized envelope --> subagent handoff
   |
   +--> plaintext-free audit metadata
```

The critical invariant is that downstream consumers accept a sanitized envelope, never raw tool output.

## 1. Install files
No third-party dependencies are required for the included Python reference implementation. Python 3.10+ is recommended.

Relevant files:
- `config/policy.json`
- `scripts/secret_dlp_guard.py`
- `scripts/scan_json_result.py`
- `tests/test_secret_dlp_guard.py`

## 2. Policy configuration
Review `config/policy.json` and adapt:
- `known_secret_env_names` to organization naming conventions;
- `sensitive_path_patterns` to credential/config locations;
- `secret_patterns` to providers in use;
- `max_output_bytes` to model/tool limits;
- private-key block behavior;
- override policy.

Never place actual credential values in the policy file. Exact-value registration reads matching environment values at runtime and keeps them in process memory.

## 3. Pre-tool integration
Before shell/file/HTTP/connector execution, call the deterministic precheck with normalized metadata.

```bash
python scripts/secret_dlp_guard.py precheck \
  --tool bash \
  --target 'printenv' \
  --policy config/policy.json
```

Exit codes:
- `0`: allow;
- `3`: deny/high-risk;
- `2`: invalid policy/input;
- `4`: runtime failure.

Do not automatically retry a denied command with broader reads. Return a safe alternative to the agent, for example inspecting only variable names or allowlisted config keys.

## 4. Text tool-output integration
The executor should write raw bytes to an execution-local temporary object that is not a transcript/log sink. Immediately sanitize:

```bash
python scripts/secret_dlp_guard.py sanitize \
  --input .runtime/raw-tool-output.txt \
  --output .runtime/sanitized-tool-output.json \
  --audit .runtime/dlp-audit.json \
  --policy config/policy.json
```

Only `sanitized-tool-output.json` may cross into the model/transcript pipeline.

Example redacted envelope:

```json
{
  "dlp_status": "redacted",
  "dlp_version": 1,
  "content": "API_KEY=<REDACTED:sensitive-assignment>",
  "redaction_count": 1
}
```

If private-key material is detected, `content` is `null` and the status is `blocked`.

## 5. Structured JSON tool results
For JSON results, sanitize every string leaf while preserving structure:

```bash
python scripts/scan_json_result.py raw-result.json sanitized-result.json \
  --policy config/policy.json
```

In a production host, implement the same traversal natively to avoid serialization overhead. The security contract remains the same: no raw string leaf reaches downstream consumers.

## 6. Envelope assertion
Before model-context append and transcript write, assert:
- `dlp_status` is `clean`, `redacted`, or `blocked`;
- `dlp_version` is an accepted policy version;
- blocked results contain no raw content.

The reference check is:

```bash
python scripts/secret_dlp_guard.py verify \
  --input .runtime/sanitized-tool-output.json \
  --policy config/policy.json
```

This assertion protects against future adapters accidentally bypassing the guard.

## 7. Known-secret registry
At process startup:
1. identify environment names matching configured sensitive-name fragments;
2. register non-empty values for exact matching;
3. never log those values;
4. expose only registry counts/fingerprints if observability is needed.

Do not inject the registry into model context.

## 8. Safe config inspection pattern
Instead of:

```bash
cat .env
kubectl config view --raw
printenv
```

prefer deterministic metadata or allowlisted-field commands that do not return values, e.g. enumerate variable names, verify presence, validate lengths/formats, or query only non-sensitive settings.

If a credential value must be supplied to an external system, prefer secure stdin/file descriptor/secret-manager mechanisms that do not echo the value to the agent transcript.

## 9. Audit schema
Recommended fields:

```json
{
  "timestamp": "2026-08-19T10:30:00Z",
  "correlation_id": "tool-call-123",
  "tool": "bash",
  "status": "redacted",
  "detectors": ["known-secret"],
  "redaction_count": 1,
  "match_hash_prefixes": ["0123456789abcdef"]
}
```

Never include plaintext match values, raw output, complete authorization headers, or command arguments known to contain secrets.

## 10. Tests
Run:

```bash
python tests/test_secret_dlp_guard.py
```

Then add adapter-level integration tests that seed canaries into:
- environment variables;
- `.env` fixture;
- JSON connector result;
- stderr;
- shell assignment output;
- private-key fixture.

Search generated model/transcript/telemetry fixtures for every exact canary. Any occurrence is a release blocker.

## 11. Production rollout
Recommended order:
1. observe-only metrics with synthetic test traffic;
2. enforce high-confidence exact-value and private-key rules;
3. enable provider patterns;
4. tune contextual assignment rules against benign corpus;
5. enforce pre-tool high-risk gate;
6. require envelope assertions for every adapter;
7. run periodic canary drills.

Never deploy an observe-only mode that still forwards known real secrets unchanged if the runtime can access production credentials.

## 12. Failure handling
- Scanner exception: fail closed; output `dlp_scanner_failed` safe envelope.
- Oversized output: block/truncate before model visibility; store raw data only in an explicitly secure non-model system if organizational policy permits.
- False positive: tune detector using benign fixtures; do not disable exact known-secret detection.
- Real exposure: revoke/rotate credential, identify every reached sink, remove persisted copies where possible, and add a synthetic regression case.

## 13. Customization
The reference detector is deliberately conservative and standard-library-only. Production environments can integrate established secret-scanning/DLP engines, but the boundary invariant must remain: **scan/redact before model visibility and persistence**.