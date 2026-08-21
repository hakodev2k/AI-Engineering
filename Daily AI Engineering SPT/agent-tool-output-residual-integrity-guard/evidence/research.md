# Research — Agent Tool-Output Residual Integrity Guard

## Problem
AI agents make decisions from tool observations. When stdout, stderr, API responses, logs, query results, or file reads are capped or truncated without an exact residual record, the model can treat partial evidence as complete. The lost portion may contain the actual error, final result, conflicting evidence, or required next step.

## Category
**Thinking** — engineering reasoning quality through evidence integrity, explicit uncertainty, verification, bounded recovery, and deterministic residual metadata. This package does not request or expose hidden chain-of-thought.

## Why it matters now
Recent Codex reports show output loss can occur before model-facing formatting and can be unrecoverable from persisted session history. A separate Claude Code incident report shows the adjacent reasoning failure: when real observations were absent or empty, the agent continued with fabricated tool/host facts instead of stopping for evidence.

## Current public signals

### Signal 1 — Codex legacy shell can silently discard post-cap output
OpenAI Codex issue #35421 reports that the legacy shell path retains only the first 1 MiB, drains the rest to avoid back-pressure, but does not record total or omitted bytes. A second model-facing truncation stage then reports a constant-looking truncation amount based only on the already-capped prefix. The report includes source references and a proposed regression test using differently sized outputs.

Source: https://github.com/openai/codex/issues/35421

### Signal 2 — Codex lacks a shared residual contract across capture/model/durable state
Codex issue #35528 generalizes the problem: capture, model-visible formatting, durable state, compaction, and orchestration can each proceed with a locally incomplete view. It proposes recording produced, retained, omitted, recoverability, and agent progress residuals. The issue reports measured cases where only a small fraction of source output remained in persisted model-visible state and the omitted portion was not recoverable from the session record.

Source: https://github.com/openai/codex/issues/35528

### Signal 3 — Missing observations can lead to fabricated conclusions
Anthropic Claude Code issue #67606 reports two long-session incidents where post-hoc JSONL forensics found the assistant claimed tool/host facts that were not present in actual tool results. The report describes the model continuing after empty/missing observations instead of questioning the premise.

Source: https://github.com/anthropics/claude-code/issues/67606

## Observed evidence, interpretation, proposed solution

### Observed evidence
- Tool output may be discarded before model formatting.
- A truncation marker may describe only the retained intermediate buffer, not true produced output.
- Persisted history may not contain enough information to reconstruct what was lost.
- Agents can continue with unsupported conclusions when an expected observation is absent.

### Interpretation
Evidence truncation is not merely a presentation concern. It is a reasoning-boundary problem. The agent must know whether an observation is complete, how much is omitted, whether the omitted portion is recoverable, and how to retrieve it before making evidence-sensitive claims.

### Proposed engineering solution
Introduce an **Output Residual Contract (ORC)** between every tool runner and model-visible tool result. For every bounded output, record:

- `produced_bytes`: total bytes observed at the capture boundary;
- `retained_bytes`: bytes directly included in the model view;
- `omitted_bytes`: `produced - retained` when known;
- `truncated`: explicit boolean;
- `artifact_path`: recoverable full-output artifact when available;
- `sha256`: digest of the full observed artifact;
- `capture_complete`: whether the runner observed EOF/terminal completion;
- `encoding`: how retained text was decoded;
- `head_bytes` and `tail_bytes`: retained layout;
- `recoverability`: `full-artifact`, `ranged-source`, or `none`.

The model receives a short header **before** retained content. If output is truncated and evidence-sensitive conclusions depend on omitted regions, workflow rules require targeted recovery before conclusion.

## Existing approaches

### Head/tail truncation
Keeps context bounded and often preserves both startup and final lines.

**Limitation:** without produced/omitted counts and recoverability metadata, the agent cannot distinguish a small omission from hundreds of MB of discarded evidence.

### Fixed byte/token caps
Protect model context and process memory.

**Limitation:** a cap is safe for capacity but unsafe for reasoning if discarded evidence is silently treated as absent rather than unknown.

### Persist full output in the conversation
Maximizes recoverability.

**Limitation:** large outputs inflate context, persistence, network usage, and token cost. The better design is externalize full bytes and provide bounded model context plus a stable handle.

### Prompt instruction: “be careful with truncated output”
Helps only if truncation is reliably signaled.

**Limitation:** the model cannot infer omitted byte count, true EOF, or recoverability if the runtime does not provide them.

### Re-run commands with filters
Can recover targeted evidence.

**Limitation:** re-execution may be expensive, non-idempotent, or produce different data. Prefer retrieval from an immutable captured artifact when possible.

## Root-cause hypotheses
1. Capture and presentation truncation are implemented in separate layers with no shared accounting object.
2. The runtime optimizes for bounded buffers but does not preserve an immutable full-output artifact.
3. The model-facing result lacks a machine-readable completeness contract.
4. Agent workflows treat successful tool status as evidence completeness.
5. Recovery relies on model judgment instead of a deterministic gate.

## Improvement target
A compliant integration should demonstrate:
- 100% of truncated tool results contain produced/retained/omitted metadata or explicitly mark produced/omitted as unknown;
- 100% of recoverable truncated results include a verifiable artifact handle and full-output digest;
- no evidence-sensitive workflow may declare verification complete from a truncated, unrecovered region;
- full artifact hash/size verification succeeds for regression fixtures;
- model-visible output remains within configured byte budget;
- targeted recovery reads are bounded and do not require re-running the original command;
- false “complete” status is zero in the provided fixtures.

## Scope
In scope: shell output, build/test logs, HTTP responses, DB/query exports, file reads, scanner output, MCP/tool payloads that can be serialized to bytes.

Out of scope: provider-hidden reasoning, automatic execution of arbitrary commands, secret scanning, semantic summarization quality, destructive cleanup of old artifacts.

## Sources
1. OpenAI Codex #35421 — https://github.com/openai/codex/issues/35421
2. OpenAI Codex #35528 — https://github.com/openai/codex/issues/35528
3. Anthropic Claude Code #67606 — https://github.com/anthropics/claude-code/issues/67606
4. Related Codex spill-to-artifact request referenced by #35528 — https://github.com/openai/codex/issues/14206
