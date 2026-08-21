# Agent Tool-Output Residual Integrity Guard

## Topic
Prevent AI agents from treating truncated or silently discarded tool output as complete evidence.

## Category
**Thinking**

This package improves decision and verification quality through explicit evidence completeness, deterministic byte accounting, bounded recovery, independent verification, and stop conditions. It does not request or expose hidden chain-of-thought.

## Problem
Tool runners frequently bound stdout, stderr, API responses, build logs, query output, or file reads. Capacity limits are necessary, but reasoning becomes unsafe when the agent cannot tell:

- how many bytes were actually produced;
- how many were retained for the model;
- how much was omitted;
- whether the runtime observed true completion/EOF;
- whether omitted evidence is recoverable;
- whether the persisted transcript contains the same evidence the tool originally produced.

A successful command or tool status is not proof that the model received complete evidence.

## Evidence
Current public signals are documented in `evidence/research.md`. Key evidence includes OpenAI Codex #35421 reporting uncounted output discarded beyond a legacy shell capture cap, Codex #35528 proposing a cross-plane residual contract after measured evidence loss, and Anthropic Claude Code #67606 documenting transcript-verified fabricated tool/host facts after missing/empty observations.

## Existing approach
Common systems use fixed caps, head/tail truncation, transcript persistence, prompt instructions, and command reruns.

## Existing limitations
- byte caps can silently discard evidence;
- presentation markers may describe only an already-truncated intermediate buffer;
- the durable session may not preserve the omitted region;
- rerunning can be expensive, non-idempotent, or produce different evidence;
- prompt instructions cannot recover metadata the runtime never supplied.

## Proposed improvement
Use an **Output Residual Contract (ORC)** at the tool-result boundary. Full observed bytes are externalized as a content-addressed artifact, while the model receives a bounded head/tail view plus machine-readable residual metadata:

`produced / retained / omitted / truncated / capture_complete / recoverability / artifact / sha256 / head / tail / encoding`

When a decision depends on omitted evidence, the agent performs deterministic search and bounded range recovery against the verified artifact. If evidence remains unavailable, it must report insufficient evidence rather than infer the missing output.

## Architecture

```text
Tool / process / API
        |
        v
 complete capture boundary
        |
        +--> full content-addressed artifact + SHA-256
        |
        v
 residual accounting
        |
        v
 bounded model view + residual header
        |
        v
 agent evidence ledger
        |
   truncated and decision-sensitive?
      /                 \
    no                   yes
    |                     |
 conclusion        search + bounded ranges
                          |
                    verification gate
```

## Package structure

```text
agent-tool-output-residual-integrity-guard/
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
│   └── residual_guard.py
└── tests/
    └── test_residual_guard.py
```

## Installation
Python 3.10+ is sufficient; the executable uses only the standard library.

```bash
python scripts/residual_guard.py --help
python -m unittest tests/test_residual_guard.py
```

## Configuration
`config/policy.json` defines the default 40 KB model-view budget, 50/50 head-tail split, artifact directory, recovery limits, and fail-closed behavior for unknown omission.

The reference script accepts command-line overrides for model-view size, head fraction, artifact directory, and encoding.

## Usage
Capture an already-produced output file:

```bash
python scripts/residual_guard.py capture \
  --input ./tmp/build.log \
  --artifact-dir ./.agent-output-artifacts \
  --max-model-bytes 40000 \
  --result-file ./tmp/build.residual.json
```

Verify its residual and full artifact:

```bash
python scripts/residual_guard.py verify --result ./tmp/build.residual.json
```

The script deliberately does **not** execute arbitrary commands. Integrate it after the host's trusted capture layer or use its contract as the reference for a native runner implementation.

See `guide-intergration.md` for shell, CI, HTTP, MCP, API, and artifact-store integration guidance.

## Workflow
The primary workflow in `workflows/workflows.md` is:

**Observe → Baseline → Cause → Hypothesis → Implement → Measure → Better? → Verify**

Implementation retries are bounded to two design iterations. Runtime I/O failures may receive one transient retry. Evidence recovery is bounded to three targeted reads by default.

A second workflow governs reasoning from truncated output: validate residual → define observable question → search immutable artifact → read bounded ranges → update evidence ledger → decision gate.

## Skills
`skills/core-skills.md` defines three reusable skills:
- establish output completeness baseline;
- recover missing evidence without re-execution;
- enforce an evidence-safe conclusion gate.

Each includes triggers, inputs, procedures, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` contains testable MUST / MUST NOT / SHOULD controls. Central rules include:
- successful tool status is not evidence completeness;
- truncated results need explicit omission/recoverability metadata;
- agents may not fabricate omitted output;
- non-idempotent commands are not rerun merely to recover output when an original artifact exists;
- high-impact conclusions require independent verification.

## Subagents
`subagents/subagents.md` separates responsibilities among:
- **Residual Auditor** — measures current failure modes;
- **Integration Implementer** — adds the residual boundary;
- **Independent Verifier** — validates without trusting implementer claims.

The implementer is never the sole verifier.

## Hooks
`hooks/hooks.md` defines predictable integration events:
- **PreToolResult:** construct completeness contract before model/transcript ingestion;
- **PostCapture:** verify artifact size/hash/accounting;
- **PreConclusion:** block decisions that depend on unrecovered truncated evidence;
- **PreRelease:** run regression gate after output-pipeline changes.

## Metrics
Track at least:
- residual coverage = results with valid completeness metadata / bounded results;
- false-complete count;
- produced, retained, and omitted bytes per tool;
- model-visible bytes per result;
- artifact verification success rate;
- targeted recovery reads and bytes;
- command reruns avoided;
- unsupported conclusion rate;
- rework attributable to missing evidence.

## Verification
Distinguish three states:

### Implemented
The host emits ORC metadata, bounded model views, and recoverable artifacts.

### Measured
Before/after fixtures record produced, retained, omitted, model-visible, and artifact metrics.

### Verified
An independent verifier proves:
- `produced = retained + omitted` for known-size results;
- different true output sizes report different produced/omitted counts;
- artifacts match declared size and SHA-256;
- corrupted artifacts fail closed;
- model-visible output stays within budget;
- incomplete capture cannot satisfy evidence-sensitive completion.

The included unit tests cover complete output, oversized exact residuals, differing oversized sizes, and corrupted artifact failure.

## Safety
- Full artifacts can contain secrets or private data; store them with application-appropriate permissions and keep them out of Git.
- This package does not replace secret scanning, sandboxing, or data-classification policy.
- The script never executes the captured command and never contacts the network.
- Do not weaken context or security limits to avoid truncation; preserve limits and add residual/recovery semantics.
- Do not automatically replay non-idempotent operations.

## Failure handling

**Detection:** missing fields, accounting mismatch, artifact size/hash mismatch, capture incomplete, unknown omission, or decisive evidence located only in an omitted region.

**Evidence:** preserve the residual JSON, artifact digest, fixture truth, and verification output.

**Retry policy:** one retry for transient I/O verification errors; maximum two implementation iterations; maximum three evidence-recovery reads.

**Fallback:** mark result unverified or decision `insufficient evidence`.

**Escalation:** human/runtime owner reviews architectural cases where the capture boundary cannot observe full output or no stable recovery handle exists.

**Stop condition:** verified evidence is available, or the bounded recovery/retry budget is exhausted. Never hide failure by weakening accuracy or verification.

## Definition of Done
The package/integration is done only when:
- current public evidence and existing limitations are documented;
- baseline fixtures are captured;
- every bounded result has an explicit completeness state;
- truncated known-size results have exact omission accounting;
- required artifacts are recoverable and hash-verifiable;
- model views remain within configured budget;
- regression tests pass;
- corrupted/missing artifacts fail closed;
- decisive conclusions cannot pass with unrecovered required evidence;
- risks and retention/security requirements are documented;
- independent verification is complete;
- no blocking unknown-output path remains for the scoped tools.

## Customization
Adjust policy thresholds for tool type and model context budget. For structured APIs, replace file-range recovery with stable pagination/cursors when those are immutable enough for verification. For very large binary outputs, store metadata and derived indexes rather than asking the model to decode the artifact. Preserve the same residual invariants regardless of storage backend.
