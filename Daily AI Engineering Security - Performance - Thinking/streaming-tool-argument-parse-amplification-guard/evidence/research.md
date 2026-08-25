# Research — Streaming Tool-Argument Parse Amplification Guard

## Topic
Detect and prevent quadratic parsing of streamed LLM tool arguments.

## Category
Performance

## Problem
Several agent/LLM runtimes append each streamed tool-argument delta to an ever-growing JSON buffer and then re-parse the entire buffer on every delta. For large arguments and fine-grained streaming this creates O(n²)-like CPU/allocation growth, event-loop stalls, and avoidable tool-start latency.

## Why it matters now
Fine-grained tool streaming is specifically intended to reduce latency for large tool inputs. In 2026, multiple current projects report the opposite effect because their client-side parser repeatedly rescans the full accumulated argument buffer.

## Affected users
Agent-runtime maintainers, SDK authors, developers using large code/document arguments, interactive AI application teams, and platform engineers debugging unexplained event-loop stalls.

## Current public evidence

### Observed evidence
1. PrimeIntellect `prime-agent` issue #942, opened August 8, 2026, reports O(n²)-like CPU/allocation behavior: Anthropic and OpenAI Responses paths append deltas then repeatedly parse the whole prefix. Source: https://github.com/PrimeIntellect-ai/prime-agent/issues/942
2. OpenClaw issue #113124, opened July 23, 2026, measures about 12.4 seconds of synchronous parse CPU for a 64 KB tool argument delivered in 20-byte deltas, with roughly 5× time per size doubling; the report notes missing cooperative yielding and argument caps on the affected Anthropic path. Source: https://github.com/openclaw/openclaw/issues/113124
3. OpenClaw issue #121770, opened August 11, 2026, reports that multiple first-party Anthropic/OpenAI Responses paths still rebuild and re-parse full buffers on every streamed delta. Source: https://github.com/openclaw/openclaw/issues/121770
4. DeepSeek Harness discussion #3923, opened August 21, 2026, reports the same full-buffer `partial-json` reparse pattern in its OpenAI Chat Completions adapter. Source: https://github.com/deepseek-ai/deepseek-harness/discussions/3923
5. Anthropic's fine-grained tool-streaming documentation states that the API sends input fragments without server-side JSON buffering/validation and that clients must handle partial or invalid JSON. Source: https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/fine-grained-tool-streaming

## Interpretation
The recurring defect is an observability and algorithmic-control gap. “Streaming enabled” is not sufficient evidence of low latency. Hosts need to measure parse work per delta, detect scan amplification, and gate changes on scaling behavior while preserving final argument semantics and invalid/truncated JSON handling.

## Existing approaches
- Re-parse the full partial JSON buffer on every delta to update a UI/tool preview.
- Buffer everything and parse only at stream completion.
- Cap argument size.
- Cooperatively yield during expensive parsing.
- Use specialized incremental/streaming JSON parsers.

## Remaining limitations
Full-buffer reparsing is simple but scales poorly. Parse-only-at-end preserves CPU but sacrifices incremental visibility/early validation. Caps bound damage but do not fix algorithmic growth. Cooperative yielding improves responsiveness but not total CPU. Incremental parsers can alter partial-value semantics unless verified against the existing implementation.

## Root-cause analysis
1. Partial JSON helpers are repeatedly applied to cumulative prefixes.
2. Streaming correctness tests emphasize final values, not cumulative parse cost.
3. Benchmarks often use small arguments or large chunks, hiding amplification.
4. Event-loop time is not attributed to parser work.
5. UI requirements encourage partial object reconstruction even when only a small subset is needed.
6. No regression budget constrains parse CPU as argument size and chunk count grow.

## Improvement opportunity
Introduce a trace-based parse amplification profiler plus regression gate. Instrument each delta with buffer bytes and parser time. The profiler estimates scaling exponent and amplification, while a bounded synthetic benchmark supplies a repeatable baseline. Optimize only after measurement, then require equivalent final semantics and better scaling.

## Proposed solution
This package contains a deterministic profiler, budgeted regression gate, benchmark procedure, rules, tests, and a verification workflow. It does not prescribe one parser implementation; it diagnoses when cumulative reparsing is pathological and defines measurable acceptance criteria for replacing it.

## Goal
Reduce tool-argument parse CPU and event-loop blocking while preserving final tool arguments and malformed/truncated-stream handling.

## Metrics
- Total parse CPU per tool call.
- Parse CPU / final argument KB.
- Bytes rescanned / final argument bytes (scan amplification).
- Estimated scaling exponent across sizes.
- p95 per-delta parse time.
- Event-loop stall duration attributable to parsing.
- Time from first argument delta to tool-input-ready.
- Final-argument semantic equality and error-rate regression.

## Trigger
Performance investigation, parser change, provider streaming integration, or CI regression benchmark.

## Inputs
JSONL delta trace (`buffer_bytes`, `delta_bytes`, `parse_us`, optional `call_id`) and budget JSON.

## Outputs
Profile JSON, threshold pass/fail exit code, suspected amplification classification.

## Verification
A quadratic synthetic trace must fail the default budget, a linear trace must pass, malformed traces must fail deterministically, and production changes must demonstrate lower measured parse cost without semantic regressions.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/942
- https://github.com/openclaw/openclaw/issues/113124
- https://github.com/openclaw/openclaw/issues/121770
- https://github.com/deepseek-ai/deepseek-harness/discussions/3923
- https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/fine-grained-tool-streaming
