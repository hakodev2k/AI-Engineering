# Research — Agent Secret Transcript Redaction Guard

## Problem
AI coding agents can persist plaintext credentials from tool stdout/stderr or file reads into conversation transcripts, local JSONL/session files, model context, telemetry, or synced history. This can happen even when project instructions explicitly say not to reveal secrets.

## Category
Security.

## Why it matters now
Recent public reports across Claude Code and Codex show the same failure class from different implementations: secret-bearing tool output reaches durable agent history before a reliable redaction boundary intervenes.

## Current public signals

### Claude Code transcript redaction request — 2026-08-14
Issue #86707 reports that tool output is recorded verbatim in session transcripts, so one `.env` read, failed deploy, or credential-printing CLI command can leave plaintext credentials on disk. The proposal is redaction at transcript write time rather than post-hoc cleanup.

Source: https://github.com/anthropics/claude-code/issues/86707

### Claude Code environment-dump incident — 2026-07-22
Issue #80153 reports an autonomous compound Bash command containing `env` that emitted multiple live tokens into the persisted transcript. It identifies a broader command class including `env`, `printenv`, `set`, `export`, `declare -p`, `/proc/self/environ`, and direct variable echoing.

Source: https://github.com/anthropics/claude-code/issues/80153

### Codex redaction failure — 2026-07-19
Issue #34233 reports live credentials printed into stored tool/conversation output while inspecting local config, despite explicit secret-handling instructions. A model-written redaction expression missed credential-like assignments.

Source: https://github.com/openai/codex/issues/34233

### Hook sanitizer limitations — July 2026
Claude Code issue #77587 documents shape-validation problems when a PostToolUse sanitizer attempts to rewrite output before it re-enters model context. Codex issue #31015 likewise reports no safe PostToolUse replacement path before transcript rendering for a local secret/PII sanitizer use case.

Sources:
- https://github.com/anthropics/claude-code/issues/77587
- https://github.com/openai/codex/issues/31015

## Existing approaches

### Prompt rules such as CLAUDE.md or AGENTS.md
Useful for intent, but not a deterministic security boundary. Public incidents show that model-written commands and incomplete filters can still expose values.

### Repository secret scanners
Strong for files/history but late for ephemeral stdout/stderr. A credential can reach the model and transcript without ever being committed.

### PostToolUse hooks
Potentially useful, but current agent implementations may reject replacement payloads, expose original output before rewriting, or differ by tool schema.

### CI-style masking
GitHub Actions supports masking known values before they are written to logs. The same principle should be applied to agent tool-result boundaries: register known values and redact before persistence/model ingestion.

Reference: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands

## Observed limitations
1. Prompt compliance is probabilistic.
2. Redaction authored inside the same shell command can be incomplete.
3. Transcript sanitation after persistence is too late.
4. Pattern-only detection misses unknown formats and may false-positive.
5. Known-value-only masking misses unregistered credentials.
6. Broad environment/config enumeration exposes more data than most tasks require.

## Root-cause hypotheses
- Tool output is treated as ordinary trusted context.
- No universal pre-persistence output interception layer exists.
- Secret values originate from heterogeneous local sources not registered with the agent runtime.
- Agent hooks may run after rendering/persistence or lack a stable replacement contract.
- Debugging and discovery commands operate at wider scope than the task actually needs.

## Improvement target
Deploy a deterministic host-side boundary that combines:
1. exact masking for explicitly registered secret values;
2. high-confidence pattern masking for common credential shapes and sensitive assignments;
3. command preflight for broad environment/credential dumps;
4. leak detection on the final serialized output that is about to be persisted;
5. fail-closed behavior for high-confidence findings;
6. regression fixtures proving that fake credential values never survive the boundary.

## Success metrics
- `known_secret_leak_count = 0` in sanitized output.
- `high_confidence_pattern_leak_count = 0` in verification fixtures.
- 100% of configured high-risk dump commands are blocked or require explicit override.
- 100% of stdout, stderr, structured tool-result and transcript-write paths pass through the sanitizer in integration tests.
- False-positive rate is measured on representative non-secret logs and remains below the team-defined threshold.
- Guard logs never contain plaintext secret values.

## Threat model

### Assets
API keys, access/refresh tokens, database passwords, cloud credentials, private keys, cookies, connection strings, auth headers.

### Failure/adversary sources
Accidental debugging, indirect prompt injection, malicious repository instructions, unsafe shell pipelines, compromised MCP/tool output, incomplete regex, verbose CLIs.

### Trust boundaries
Tool process → stdout/stderr → agent host → model context → transcript/log/telemetry.

## Proposed engineering solution
The package implements an output-boundary sanitizer plus a command preflight checker. The deterministic guard must run before model reinjection and before transcript/log serialization. It does not rely on hidden reasoning and never records original secret values in its reports.

## Sources
- https://github.com/anthropics/claude-code/issues/86707
- https://github.com/anthropics/claude-code/issues/80153
- https://github.com/openai/codex/issues/34233
- https://github.com/anthropics/claude-code/issues/77587
- https://github.com/openai/codex/issues/31015
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
