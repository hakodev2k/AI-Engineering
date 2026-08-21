# Agent Tool-Output Backpressure Guard

## Topic

Bounding, persisting, deduplicating, and lazily replaying high-volume AI-agent tool output so one verbose command or subagent cannot dominate disk, memory, session history, resume latency, or model context.

## Category

**Performance** (primary), with Token and reliability implications.

## Problem

Agent runtimes often capture shell stdout/stderr, web/API responses, test/build logs, and subagent transcripts into temporary files and session history. When capture is effectively unbounded, a single looping or highly verbose producer can generate gigabytes or terabytes of output. Even when output is persisted to disk, copying the full payload into the session/transcript can reintroduce the same problem during resume, rendering, or model-context construction.

The target failure mode is therefore broader than “large stdout”: it is missing backpressure between the tool producer, artifact store, active session, UI replay layer, and model context.

## Evidence

[`evidence/research.md`](evidence/research.md) documents current public signals. Strong examples include:

- Anthropic Claude Code #39909 (2026-03-27): roughly 95 GB across three task-output files;
- #26911 (2026-02-19): 537 GB from one research-heavy session and repeated disk-full incidents;
- #41737 (2026-04-01): 278 GB produced within minutes;
- #35121 (2026-03-17): a single task-output file reported at 1.4 TB;
- #21067 (2026-01-26): session resume hangs when large tool output remains embedded despite a persisted-output mechanism;
- #67613 (2026-06): desktop renderer OOM loading a roughly 2.4 GB session transcript;
- #81265 (2026-07-25): parallel subagent output associated with unbounded desktop memory growth and webview OOM near 20 GB process-tree RSS.

The research file separates observed evidence, interpretation, and this package's proposed engineering solution.

## Existing approach

Common approaches include:

- full capture to temp files;
- hard truncation;
- persistence of large output to disk;
- conversation compaction;
- command-specific quiet flags;
- OS temp cleanup or quotas;
- manual deletion after a disk incident.

## Existing limitations

These mechanisms can remain insufficient because:

- a persisted body may still be duplicated into session history;
- simple file caps do not detect extreme output rate or aggregate session growth;
- prefix-only truncation may lose the final error/test summary;
- historic artifacts may be eagerly deserialized/rendered on resume;
- the same large subagent/tool body may exist in temp storage, transcript, parent context, and UI buffers;
- manual cleanup is reactive and unsuitable for unattended agents;
- retrying after missing/truncated output can duplicate work or side effects.

## Proposed improvement

Introduce a provider-neutral output boundary:

```text
tool/subagent stream
      |
      v
byte + rate accounting
      |
      +--> normal output -> bounded inline result
      |
      +--> soft limit -> persist once -> digest/reference + head/tail preview
      |
      +--> hard limit -> explicit clipped result + deterministic reason
                             |
                             v
session stores references, not giant bodies
                             |
                             v
resume lazy-loads previews/references
                             |
                             +--> full artifact fetched only when required
```

The guard separates **retaining the full artifact** from **injecting the full artifact into the active session/model context**.

## Architecture

### Output budget policy

[`config/output-policy.json`](config/output-policy.json) defines:

- per-tool soft/hard byte limits;
- session soft/hard byte limits;
- output-rate soft/hard thresholds;
- head/tail preview budgets;
- maximum inline session-record size;
- artifact directory and deduplication behavior;
- lazy replay and explicit full-artifact retrieval;
- bounded recovery attempts.

The defaults are safe demonstration values, not universal production thresholds. Tune them from measured workload baselines.

### Stream guard

[`scripts/output_backpressure.py`](scripts/output_backpressure.py):

- reads tool output from stdin;
- tracks per-tool and aggregate session bytes;
- maintains a sliding output-rate window;
- preserves head and tail previews;
- clips at configured hard limits;
- persists oversized captured output using content-addressed SHA-256 filenames;
- emits a compact JSON result with completeness/reference metadata;
- never executes the producer command and never kills a process.

### Session bloat auditor

[`scripts/session_bloat_audit.py`](scripts/session_bloat_audit.py) scans JSONL/session files for:

- oversized inline records;
- invalid JSON lines;
- repeated large output-like strings;
- estimated duplicate byte overhead.

It is designed for baseline collection and migration/regression checks.

### Reference-first persistence

Large output should exist once as an artifact and be represented in active session state by:

- SHA-256 digest;
- byte count;
- stable artifact locator;
- head/tail preview;
- completeness/clipping state.

Full artifact retrieval is explicit when later reasoning or verification needs omitted data.

### Independent verification

The implementation agent does not self-certify performance. [`subagents/subagents.md`](subagents/subagents.md) separates baseline investigation, budget planning, integration, and independent performance verification.

## Package structure

```text
agent-tool-output-backpressure-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── output-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── output_backpressure.py
│   └── session_bloat_audit.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_output_backpressure.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation

Requirements:

- Python 3.10+;
- writable session-counter directory;
- writable artifact directory when persistence is enabled.

The scripts use only the Python standard library.

Copy the package into the agent host repository, then inspect the default policy:

```bash
python -m json.tool config/output-policy.json
```

Create runtime directories if desired:

```bash
mkdir -p .agent-output .agent-output-artifacts
```

No secrets are required.

## Configuration

Important default values:

- per-tool soft limit: 1 MiB;
- per-tool hard limit: 8 MiB;
- session soft limit: 32 MiB;
- session hard limit: 128 MiB;
- head preview: 64 KiB;
- tail preview: 64 KiB;
- hard rate threshold: 8 MiB/s over a five-second window;
- maximum inline session record: 256 KiB;
- content-addressed artifact deduplication: enabled;
- reference-first replacement: enabled;
- lazy replay: enabled;
- explicit full-artifact load: required;
- maximum recovery attempts: 2.

Tune by workload class after measuring normal p95/p99 behavior. A test/build tool may need a different profile from a web fetch or subagent transcript.

## Usage

### Audit an existing session

```bash
python scripts/session_bloat_audit.py \
  --policy config/output-policy.json \
  --session path/to/session.jsonl \
  --report output-audit.json
```

Exit codes:

- `0` — no audit violation;
- `2` — oversized/duplicate/invalid session content found;
- `3` — invalid policy or arguments;
- `4` — I/O failure.

### Capture a tool stream

```bash
producer-command | python scripts/output_backpressure.py capture \
  --policy config/output-policy.json \
  --session-counter .agent-output/session-123.json \
  --session-id session-123 \
  --tool-id build-456
```

The producer's actual process exit code must be captured separately by the host. The guard exit code describes the capture boundary, not business success of the producer.

Guard exit codes:

- `0` — accepted, possibly reference-only after soft budget;
- `2` — hard rate/tool/session budget reached;
- `3` — invalid configuration/arguments;
- `4` — accounting or artifact I/O failure.

### Interpret a reference-only result

When `full_output_inline=false`, use the preview for normal reasoning. Fetch the referenced artifact only when full output is materially required.

Never treat `clipped=true` as proof that the unobserved portion passed validation.

## Workflow

The main workflow in [`workflows/workflows.md`](workflows/workflows.md) is:

**Measure → Diagnose → Hypothesize → Bound → Measure Again → Independent Verify**

Additional workflows cover:

- runaway stream containment;
- reference-first migration of old sessions;
- policy/runtime regression gates.

Every loop is bounded. The default maximum recovery attempt count is two. A repeated failure must lead to a changed hypothesis or explicit escalation, not broader output limits.

## Skills

[`skills/core-skills.md`](skills/core-skills.md) contains reusable procedures for:

- establishing an output baseline;
- applying bounded capture while retaining diagnostic value;
- converting session history to reference-first replay;
- detecting runaway output loops.

Each skill includes trigger, inputs, preconditions, procedure, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines observable **MUST / MUST NOT / SHOULD** controls. Core invariants include:

- explicit byte budgets;
- no silent truncation;
- head/tail evidence retention;
- no automatic limit widening after failures;
- no eager reinjection of persisted artifacts;
- bounded retries;
- measured before/after performance claims only.

## Subagents

[`subagents/subagents.md`](subagents/subagents.md) defines:

- Output Baseline Investigator;
- Output Budget Planner;
- Integration Agent;
- Independent Performance Verifier;
- Orchestrator.

The verifier is intentionally separate from the implementation role.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines integration points for:

- pre-task budget validation;
- streaming capture;
- post-tool verification;
- pre-session persistence;
- pre-resume auditing;
- post-change regression testing;
- reachability-aware artifact cleanup.

## Metrics

Track at minimum:

- bytes/tool and bytes/session;
- inline vs artifact bytes;
- hard/soft/rate limit hits;
- duplicate payload overhead;
- artifact fetches;
- clipped-result count;
- resume p50/p95;
- peak RSS during large-session load;
- tool-output tokens sent to the model when provider telemetry supports it;
- diagnostic/verification failures caused by omitted output.

A performance improvement is not considered measured until the same representative corpus is run before and after the integration.

## Verification

Run deterministic tests:

```bash
python -m unittest -v tests/test_output_backpressure.py
```

The test suite covers:

- small normal output;
- per-tool hard-limit clipping;
- aggregate session hard-limit clipping;
- head/tail preview retention;
- invalid policy rejection;
- content-addressed deduplication;
- persisted session counter behavior.

See [`verification/report.md`](verification/report.md) for the distinction between **Implemented**, **Measured**, and **Verified**, plus the required target-runtime benchmark matrix.

## Safety

- The package does not execute arbitrary producer commands.
- It does not terminate processes or infer process ownership.
- Hard-limit events are explicit and machine-readable.
- Clipped output is never represented as complete.
- Full artifacts remain retrievable when persistence succeeds.
- Hard limits are never automatically relaxed.
- Accounting corruption does not silently reset to zero.
- Artifact cleanup is not performed by the reference scripts because deletion requires reachability knowledge.
- Secrets should be redacted by the host before previews/audit data are persisted where policy requires it.

## Failure handling

### Hard budget violation

Preserve previews/reference and reason code. Diagnose the producer. Retry only with a changed hypothesis and at most the configured number of times.

### Rate violation

Treat high output velocity as a likely runaway condition. The host may cancel the tool only through its established process-lifecycle policy; this package does not issue kill signals.

### Artifact write failure

Fail closed when configured. Do not discard the full body and return a fake successful reference.

### Corrupt accounting

Stop and reconcile the session counter. Never silently reset aggregate usage.

### Missing artifact during later verification

Mark evidence unavailable. Re-run the producing operation only when it is safe/idempotent and necessary.

### Diagnostic quality regression

Use targeted structured extraction or workload-specific budgets after measurement. Do not disable the global boundary merely to make one verbose tool pass.

## Definition of Done

An integration is complete only when:

- current public evidence and existing limitations are documented;
- a representative baseline is captured;
- every captured tool class has explicit budgets;
- hard byte/session/rate limits are deterministic;
- oversized output is explicit and reference-first;
- persisted artifacts are digest-valid and retrievable;
- large payloads are not duplicated into session state;
- clipped output cannot satisfy verification without required retrieval;
- unit tests pass;
- target-runtime large-output fixtures stay within configured hard budgets;
- resume and memory/storage metrics are measured before/after;
- independent verification is complete;
- retries are bounded;
- no unresolved blocking I/O/accounting/reference issue remains.

## Customization

- Define separate policies for build/test, web/API, subagent, database, and log-analysis workloads.
- Replace local artifact files with object storage while preserving digest/reference semantics.
- Replace JSON session counters with SQLite/Redis/PostgreSQL for concurrent multi-process hosts.
- Add line/repetition fingerprints to detect repeated-output loops earlier than byte-rate alone.
- Add structured extractors for test frameworks so summaries remain inline while verbose logs move to artifacts.
- Add OpenTelemetry spans/events for capture, soft-limit transition, hard-limit hit, artifact persist/fetch, and resume replay.
- Add artifact reachability indexing before enabling automated TTL cleanup.

Any customization should preserve the core invariant: **retain what may be needed, inject only what is currently useful, and bound every path by measurable resource budgets.**