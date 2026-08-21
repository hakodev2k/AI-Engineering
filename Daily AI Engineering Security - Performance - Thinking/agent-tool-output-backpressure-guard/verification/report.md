# Verification Report

## Scope

This report distinguishes **Implemented**, **Measured**, and **Verified** so the package does not claim production improvement without target-runtime evidence.

## Implemented

The package includes:

- explicit per-tool, per-session, and rate budgets;
- deterministic stream capture with hard-limit reason codes;
- bounded head/tail previews;
- content-addressed artifact persistence using SHA-256;
- reference-first result representation for oversized output;
- session byte accounting;
- session JSONL audit for oversized records and repeated large payloads;
- enforceable MUST/MUST NOT/SHOULD rules;
- bounded workflows and retry limits;
- subagent separation between implementation and independent verification;
- integration hooks and safety/failure behavior;
- unit-test fixtures covering small output, hard tool limits, hard session limits, previews, invalid policy, artifact deduplication, and counter persistence.

## Measured in this package

The deterministic scripts expose directly measurable fields:

- captured bytes;
- session captured bytes;
- content digest;
- clipping state/reason;
- inline/reference state;
- artifact byte count;
- oversized session records;
- repeated payload occurrences;
- estimated duplicate overhead.

The package does **not** fabricate target-runtime latency, memory, disk, token, or quality improvements. Those measurements depend on the integrating agent runtime and workload corpus.

## Verified by contract design

The supplied tests are designed to verify these invariants when executed:

1. normal small output passes without clipping;
2. per-tool hard limit bounds stored output;
3. session hard limit bounds aggregate capture;
4. both head and tail evidence survive bounded capture;
5. inverted/invalid policy is rejected;
6. identical artifacts deduplicate by content digest;
7. session accounting persists across calls.

The session auditor separately checks for:

- inline records above policy;
- malformed JSONL lines;
- repeated large output-like payloads;
- estimated duplicate byte overhead.

## Required target-runtime verification

Before production enforcement, run a representative corpus and capture:

| Metric | Baseline | Guarded | Pass condition |
|---|---:|---:|---|
| p95 bytes/tool inline | measure | measure | lower or within approved budget |
| p95 bytes/session inline | measure | measure | lower or within approved budget |
| largest session record | measure | measure | <= configured max inline bytes |
| duplicate overhead | measure | measure | materially reduced |
| resume p95 | measure | measure | no material regression; preferably improved |
| peak RSS during large history | measure | measure | no material regression; preferably improved |
| disk growth/runaway fixture | measure | measure | bounded by hard policy |
| required diagnostic retrieval success | measure | measure | 100% for retained artifacts |
| silent truncation incidents | measure | measure | 0 |
| false hard-limit blocks | measure | measure | within approved threshold |

## Regression scenarios

### Scenario A — deterministic large stdout
Generate a known byte count above the soft budget but below hard budget. Expected: reference mode, full artifact available, no large inline body.

### Scenario B — hard-limit stream
Generate more than the per-tool hard budget. Expected: exit 2, reason `PER_TOOL_HARD_LIMIT`, bounded stored bytes, explicit clipped state.

### Scenario C — session exhaustion
Run multiple tools until aggregate session budget is reached. Expected: later capture returns `SESSION_HARD_LIMIT` before aggregate storage exceeds the configured hard ceiling.

### Scenario D — repetitive runaway stream
Generate output rapidly enough to cross the rate threshold. Expected: `RATE_HARD_LIMIT` and bounded previews. Host cancellation is tested separately because process ownership is not inferred by this package.

### Scenario E — duplicated persisted payload
Create a JSONL transcript containing the same large output body multiple times. Expected: `session_bloat_audit.py` reports repeated digest and duplicate overhead.

### Scenario F — reference-first resume
Store large tool bodies as artifacts and retain only references in history. Expected: resume path does not eagerly read artifact bodies; explicit artifact fetch reproduces the stored SHA-256.

## Safety verification

- No script executes arbitrary tool commands.
- The capture script only consumes stdin and writes accounting/artifact files.
- It does not terminate processes.
- Output clipping is explicit.
- Artifact retrieval must be explicit when the policy requires it.
- Hard limits are not self-relaxed.
- Cleanup is intentionally not automated by the reference scripts because reachability must be known before deletion.

## Production Definition of Done

The integration is verified only when:

- public evidence and baseline are documented;
- all required package files exist;
- unit tests pass in the target repository;
- normal workload false-block rate is acceptable;
- large-output fixtures remain inside hard budgets;
- persisted artifacts are retrievable and digest-valid;
- no clipped output is represented as complete;
- session replay does not eagerly materialize large artifact bodies;
- before/after latency/memory/storage metrics are collected;
- independent verifier approves results;
- no unresolved blocking issue or required approval remains.