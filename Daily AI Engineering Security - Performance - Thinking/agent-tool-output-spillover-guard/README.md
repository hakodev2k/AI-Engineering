# Agent Tool Output Spillover Guard

## Topic
Budget and externalize oversized agent tool outputs without losing recoverable evidence.

## Category
Token

## Problem
Large tool outputs—build logs, test traces, repository scans, API payloads, search results, JSON documents, MCP resources—can consume a disproportionate share of an agent's context window. This increases input-token cost and latency, triggers earlier compaction, and can make long-running sessions harder to recover. A naïve fix such as hard truncation reduces tokens but can silently remove the exact error, record, or evidence needed later.

## Evidence
Current public signals and official primitives are documented in [`evidence/research.md`](evidence/research.md). The package distinguishes observed evidence from interpretation and this proposed solution.

## Existing approach
Common approaches include:
- inserting complete tool output into conversation context;
- applying fixed head/tail truncation;
- asking the model to summarize large results;
- limiting shell/log output manually;
- storing artifacts separately in frameworks that support resource links/artifacts;
- waiting for context compaction to recover space.

## Existing limitations
- full insertion wastes tokens repeatedly across later turns;
- hard truncation can remove the one diagnostic line required for correctness;
- model summaries add another model call and can introduce summary drift;
- compaction happens after context has already been consumed;
- manual output limiting is inconsistent across tools;
- artifact support is useful but does not by itself define when to spill, what to expose, how to verify integrity, or how to retrieve only needed evidence.

## Proposed improvement
Apply a deterministic **budget → extract → spill → reference → on-demand rehydrate** boundary before tool output enters model context.

For small output, pass it through. For oversized output:
1. persist the complete raw payload outside model context;
2. compute SHA-256;
3. extract bounded high-value evidence using head/tail plus configurable failure patterns;
4. return a compact envelope that explicitly says content is incomplete;
5. keep the full artifact addressable by verified reference;
6. rehydrate only bounded ranges/search neighborhoods when later reasoning requires them.

This preserves correctness better than blind truncation while reducing context pressure.

## Architecture
```text
Tool execution
    |
    v
Raw output bytes
    |
    v
Pre-context guard
  ├─ measure raw bytes / lines / tokens
  ├─ within budget? ─────────────> pass-through
  |
  └─ oversized
       ├─ persist full artifact
       ├─ SHA-256 verify
       ├─ head/tail + priority extraction
       └─ bounded reference envelope
                    |
                    v
              Model context
                    |
          missing evidence later?
                    |
                    v
          bounded rehydrate request
                    |
        root + hash + size verification
                    |
                    v
             targeted excerpt
```

The raw artifact is the source of truth. The model-facing envelope is a bounded view, not a replacement for the artifact.

## Package structure
```text
agent-tool-output-spillover-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── tool_output_guard.py
├── tests/
│   └── test_tool_output_guard.py
└── verification/
    └── report.md
```

## Installation
Requirements:
- Python 3.10+ recommended;
- standard library only;
- writable protected artifact directory.

No Python package install is required.

Copy this package into the runtime repository, then ensure the integration can call the script before model-facing tool output is constructed.

## Configuration
Edit [`config/policy.json`](config/policy.json).

Default policy:
- model-visible approximate budget: 6,000 tokens/tool result;
- raw hard limit: 50 MiB;
- preserve first 40 and last 40 lines;
- preserve up to 120 lines matching failure/security patterns;
- rehydrate at most 500 lines / 256 KiB per request;
- spill root: `.agent-tool-output-spill`.

These are starting values, not universal optimal thresholds. Tune per tool using measured traces.

## Usage
### Guard a tool output
```bash
python scripts/tool_output_guard.py guard \
  --input tool-output.txt \
  --tool-name dotnet-test \
  --policy config/policy.json \
  --output envelope.json \
  --events tool-output-events.jsonl
```

If the payload is small, `envelope.json` contains the complete content. If it is oversized, the envelope contains a spill reference, SHA-256, bounded evidence lines, omission count, and explicit incomplete-content notice.

### Rehydrate by line range
```bash
python scripts/tool_output_guard.py rehydrate \
  --artifact .agent-tool-output-spill/<sha>.txt \
  --sha256 <sha> \
  --policy config/policy.json \
  --start-line 500 \
  --end-line 650
```

### Rehydrate by search
```bash
python scripts/tool_output_guard.py rehydrate \
  --artifact .agent-tool-output-spill/<sha>.txt \
  --sha256 <sha> \
  --policy config/policy.json \
  --search "NullReferenceException" \
  --context 4
```

### Analyze observed savings
```bash
python scripts/tool_output_guard.py analyze --events tool-output-events.jsonl
```

## Workflow
Primary operational flow is defined in [`workflows/workflows.md`](workflows/workflows.md):
- oversized output handling;
- targeted rehydration;
- production budget tuning.

The central loop is:

**Measure → Budget → Spill if needed → Extract → Verify → Continue → Rehydrate selectively → Measure again**

Retries are bounded and integrity failures fail closed.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) defines reusable procedures for:
- measuring tool-output pressure;
- evidence-preserving extraction;
- on-demand rehydration.

Each skill includes triggers, inputs, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) provides enforceable MUST / MUST NOT / SHOULD rules. Important invariants include:
- measure before insertion;
- never silently discard required evidence;
- preserve raw oversized output when correctness may depend on it;
- verify hashes before rehydration;
- never auto-replay the whole artifact into model context;
- keep spill storage at least as protected as originating tool data.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) defines three non-overlapping roles:
- Context Pressure Analyst;
- Spillover Implementation Agent;
- Independent Verification Agent.

The implementing agent is not the sole verifier.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines predictable lifecycle gates:
- pre-context tool output guard;
- pre-rehydrate integrity check;
- post-task spill metrics;
- final regression verification.

## Metrics
Track at minimum:
- raw bytes/tokens per tool call;
- model-visible bytes/tokens per tool call;
- reduction ratio;
- p50/p95 tool-output tokens;
- spill rate by tool;
- rehydrate calls/task;
- spill I/O latency and failures;
- peak context utilization;
- cost/task and p50/p95 agent latency;
- compaction frequency/failure rate;
- task correctness or test-pass rate.

Do not claim optimization success from token reduction alone.

## Verification
Deterministic package verification is defined in [`tests/test_tool_output_guard.py`](tests/test_tool_output_guard.py) and status semantics in [`verification/report.md`](verification/report.md).

Run:
```bash
python tests/test_tool_output_guard.py
```

The tests verify pass-through, spill, mid-log priority extraction, artifact integrity, targeted rehydrate, bad-hash rejection, path containment, and metrics reduction.

Production verification requires representative baseline comparison. Distinguish:
- **Implemented** — guard exists;
- **Measured** — raw/visible metrics and deterministic behavior captured;
- **Verified** — representative tasks retain quality/correctness while showing measurable token/cost/latency improvement.

## Safety
The spill store may contain the complete raw payload, including sensitive content. Production deployments MUST apply appropriate access controls, tenant/task isolation, retention, encryption, and secret-handling policy. Do not turn local artifact paths into public URLs by default.

Binary output is externalized without text extraction rather than being force-decoded. Integrity or path-containment failures are blocking.

This package reduces context exposure; it is not a replacement for a separate secret/DLP guard.

## Failure handling
Key failure policy:
- artifact write: one retry, then stop;
- hash mismatch: zero retries against the mismatched artifact;
- path escape: immediate block;
- envelope cannot fit budget: deterministically reduce extraction, then fail if still impossible;
- missing artifact: regenerate/rerun source only when safe and necessary;
- missing evidence after spill: at most two targeted rehydrate attempts per question before escalation or explicit larger-budget decision.

Never solve a failure by silently dropping provenance, disabling integrity validation, or injecting the oversized raw payload.

## Definition of Done
A production integration is done only when:
1. current public evidence is documented;
2. target tool-output baseline is captured;
3. oversized output is intercepted before model context insertion;
4. complete required raw evidence is externally recoverable;
5. model-visible result obeys configured budget;
6. omissions are explicit;
7. SHA-256/path verification is enforced;
8. targeted rehydration is bounded;
9. deterministic tests pass;
10. raw vs visible token/cost/latency metrics are collected;
11. representative quality/correctness comparison is complete;
12. storage security/retention requirements are satisfied;
13. no blocking integrity or required-context regression remains.

## Customization
Useful extensions:
- use an exact tokenizer at runtime instead of the built-in approximation;
- add JSON-aware projections and JSONPath selectors;
- add JUnit/TRX-aware failed-test extraction;
- add compiler/build-log structured diagnostic parsers;
- replace local disk with private object storage or platform artifact handles;
- map references to MCP `resource_link` or framework-native artifact channels;
- set per-tool-class token budgets;
- add retention cleanup jobs outside the critical tool-response path;
- feed spill/rehydrate metrics into tracing/observability systems.

Keep the core invariant unchanged: **raw evidence remains recoverable and integrity-checked while model-visible context stays deliberately bounded.**

## Integration details
See [`guide-intergration.md`](guide-intergration.md) for rollout, security, metrics, structured-output adapters, recovery, and tuning guidance.