# Research

## Topic
Long-Chat Renderer Working-Set Guard

## Category
Performance

## Problem
Desktop AI clients can accumulate rendered conversation content until the renderer's memory and frame-processing cost dominate interaction. Tool-heavy chats are especially vulnerable because a small transcript file can expand into a much larger live UI representation containing code blocks, terminal output, images, syntax highlighting, layout state, and retained components.

## Why it matters now
Two open Codex desktop reports from August 2026 independently describe conversation-rendering degradation on different operating systems and hardware. The Windows report includes renderer working-set measurements tied to accumulated messages/tool output; the macOS report reproduces severe scrolling stutter without memory pressure, swap, or thermal throttling. Together they show that long-chat UI scalability is a current engineering problem distinct from model inference latency.

## Affected users
Developers using long-running coding-agent sessions, desktop AI client maintainers, Electron/Chromium application teams, and platform teams whose agents emit large tool outputs.

## Current public evidence

### Observed evidence
1. **openai/codex #38544**, opened August 14, 2026: a Windows Codex renderer reached about 2.15 GB working set, while total Codex-related memory approached 4 GB during a large tool-output render. Memory dropped substantially after output stopped/collapsed. The reporter noted worsening UI and system stutter as messages and tool outputs accumulated, despite substantial free system RAM and a relatively small on-disk transcript.
2. **openai/codex #37297**, opened August 6, 2026: a long Codex project conversation on macOS showed severe, reproducible scroll stuttering with messages, code blocks, terminal output, and an image. The machine had 64 GB RAM, zero swap, and no thermal warning; renderer/GPU/WindowServer activity rose during scrolling.

### Interpretation
The relevant performance invariant is the size and cost of the *active rendered working set*, not just transcript bytes or total system memory. A renderer can retain too many off-screen nodes/components, re-layout expensive rich content, or materialize large tool outputs even when the underlying session file is modest.

### Proposed solution
Benchmark renderer scaling across transcript sizes and content types. Require bounded rendered-node count, bounded renderer RSS growth, and bounded p95 scroll/frame time. Use windowing/virtualization, deferred rich-content materialization, stable memoization, and explicit reclamation where measurements identify them as the bottleneck.

## Existing approaches
- Restart the desktop app or start a fresh conversation.
- Collapse large tool outputs.
- Memoize message components.
- Lazy-render syntax highlighting/images.
- Use virtualized/windowed lists.
- Rely on Chromium/Electron garbage collection.

## Remaining limitations
Restart/new-thread workarounds break task continuity. Collapsed content may still remain mounted or retained. Garbage collection cannot reclaim objects still referenced by UI state. Short-chat benchmarks do not expose growth slope. A single snapshot cannot distinguish bounded high baseline from unbounded per-message growth.

## Root-cause analysis
1. Transcript storage size is conflated with live render-tree size.
2. Off-screen messages or rich child components remain mounted or referenced.
3. Large tool output is eagerly materialized even when collapsed or off-screen.
4. Syntax highlighting/layout/image work can repeat during scroll or state updates.
5. Performance tests focus on startup/model latency rather than renderer scaling over message count.
6. No explicit working-set budget makes gradual growth easy to miss before release.

## Improvement opportunity
Create a repeatable corpus at small/medium/large message counts with representative code and tool output. Capture renderer RSS, rendered nodes, and p95 frame time at each point. Calculate memory/node growth per 100 messages and compare before/after implementations. Block releases when absolute or regression budgets fail.

## Goal
Long-running AI chats remain responsive and memory-bounded as transcript length and tool-output volume increase, without deleting authoritative context.

## Metrics
Renderer RSS MB; rendered nodes; p95 frame time; scroll FPS; RSS growth MB/100 messages; node growth/100 messages; before/after regression percentage.

## Trigger
Conversation UI changes, tool-output renderer changes, markdown/highlighting changes, Electron/Chromium upgrades, virtualization changes, or reports of long-session UI lag.

## Inputs
Fixed benchmark transcript corpus, renderer measurements at multiple message counts, supported hardware profile, baseline release measurements, configured budgets.

## Outputs
Scaling report, diagnosed bottleneck, before/after comparison, deterministic pass/fail report, independent verification status.

## Relevant sources
- openai/codex issue #38544, opened 2026-08-14: https://github.com/openai/codex/issues/38544
- openai/codex issue #37297, opened 2026-08-06: https://github.com/openai/codex/issues/37297
