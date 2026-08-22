# Agent Compaction Continuity Contract

## Topic
Prevent long-running AI agents from losing task identity, goals, constraints, decisions, completed work, failed approaches, blockers, and evidence when context compaction or session reconstruction occurs.

## Category
**Thinking** — engineering reliable reasoning/execution continuity through explicit state, evidence, checkpoints, bounded recovery, and deterministic verification.

## Problem
Recent 2026 reports from Codex and Claude Code show that context compaction can discard the active goal, resurface stale user prompts as if current, forget earlier decisions or known-failed approaches, repeat completed work, and sometimes become unrecoverable near the context limit. These are not merely summarization-quality issues: they can change what an agent does next.

See `evidence/research.md` for dated public signals and sources.

## Evidence
The package is grounded in multiple public signals, including:
- OpenAI Codex #32922: active goal lost during compaction.
- OpenAI Codex #27731: stale historical user prompt can resume as current instruction.
- OpenAI Codex #14347: progressive information loss across repeated compactions.
- OpenAI Codex #35935: lost task state can repeat completed work and consume additional usage.
- Anthropic Claude Code #29890: critical working knowledge and failed/successful approach history can disappear.
- Claude Code reports where compaction fails once sessions are already too large.

## Existing approach
Most runtimes use automatic/manual summarization, conversation compaction, memory/plan files, or user-managed handoff notes. Some projects propose selective context retention or pinned context.

## Existing limitations
- Important state remains implicit across prose messages.
- Summaries choose importance probabilistically.
- Earlier constraints and negative evidence are vulnerable to progressive loss.
- Historical user prompts may not be distinguishable from the active instruction after reconstruction.
- Manual memory files are effective only if updated before state is lost.
- A summary usually has no machine-checkable contract proving it retained every critical invariant.

## Proposed improvement
Add a small external **continuity capsule** that is authoritative for execution-critical state. Before compaction, capture and checksum typed state. After compaction, reconstruct a recovered capsule and deterministically compare critical fields. Mutating actions remain blocked until the comparison passes.

The capsule stores conclusions and observable state, not hidden chain-of-thought.

## Architecture

```text
conversation/tool state
        |
        v
Pre-Compaction Capture
        |
        v
state/continuity.json  <-- authoritative, checksummed, outside compactable history
        |
   compaction/resume
        |
        v
Recovered Structured State
        |
        v
continuity_guard.py compare
     /             \
 invalid           valid
   |                 |
rehydrate       mutation receipt
(max 2)              |
   |                  v
 stop/escalate   Execution Agent
```

## Package structure

```text
agent-compaction-continuity-contract/
├── README.md
├── guide-intergration.md
├── config/
│   └── continuity-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── continuity-capsule.json
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
│   └── continuity_guard.py
├── tests/
│   └── test_continuity_guard.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.9+ and no third-party Python dependencies.

```bash
python --version
python -m unittest tests/test_continuity_guard.py -v
```

Integrate the package directory into the agent harness or copy the config/script files into the runtime's policy/state layer.

## Configuration
Edit `config/continuity-policy.json`.

Important settings:
- `max_capsule_bytes`: upper bound for the external state capsule.
- `max_rehydrate_attempts`: bounded recovery count.
- `critical_fields`: fields that must survive compaction unchanged unless explicitly authorized.
- evidence requirements for decisions/completed/failed items.
- `stale_turn_is_blocking` and `unknown_state_is_blocking`.
- proactive checkpoint triggers.

Do not remove critical fields merely to make a failing recovery pass.

## Usage

### 1. Prepare a capsule
Use `examples/continuity-capsule.json` as a shape reference, then populate real state.

### 2. Stamp it

```bash
python scripts/continuity_guard.py stamp --capsule state/continuity.json
```

### 3. Validate it

```bash
python scripts/continuity_guard.py validate \
  --capsule state/continuity.json \
  --policy config/continuity-policy.json
```

### 4. After compaction, reconstruct and stamp recovered state

```bash
python scripts/continuity_guard.py stamp --capsule state/recovered.json
```

### 5. Compare

```bash
python scripts/continuity_guard.py compare \
  --before state/continuity.json \
  --after state/recovered.json \
  --policy config/continuity-policy.json
```

Exit 0 means critical continuity passes. Non-zero means mutating execution must stay blocked.

### 6. Generate a mutation receipt

```bash
python scripts/continuity_guard.py receipt \
  --before state/continuity.json \
  --after state/recovered.json \
  --policy config/continuity-policy.json \
  --max-age-seconds 300
```

See `guide-intergration.md` for harness integration patterns.

## Workflow
The recommended operating loop is:

```text
Observe task state
-> Verify artifacts/evidence
-> Capture typed checkpoint
-> Stamp + validate
-> Compact/resume
-> Recover typed state
-> Compare
-> Better/valid?
   No -> rehydrate within bounded retries -> compare -> stop if still invalid
   Yes -> issue mutation receipt
-> Execute next authorized action
-> Verify outcome
-> Capture next checkpoint
```

## State model
A capsule includes:
- task ID;
- monotonic generation;
- active user-turn/event ID;
- active goal;
- constraints;
- accepted decisions with evidence;
- completed work with artifacts/evidence;
- failed approaches with reasons;
- open items;
- blockers/pending approvals;
- evidence references;
- canonical SHA-256 checksum.

This deliberately excludes private chain-of-thought.

## Metrics
Track:
- critical-field loss rate;
- stale-turn resume rate;
- known-failed-approach repetition rate;
- repeated completed-work count;
- recovery attempts per compaction;
- continuity recovery latency;
- capsule bytes;
- checkpoint age;
- blocked mutations due to invalid/unknown state.

Recommended acceptance targets for tests:
- critical-field false-pass rate: 0;
- stale-turn false-pass rate: 0;
- failed-approach-loss false-pass rate: 0;
- valid fixtures pass;
- recovery attempts never exceed policy;
- capsule remains within budget.

## Verification
`tests/test_continuity_guard.py` includes fault fixtures for:
- changed/lost active goal;
- stale active-turn ID;
- dropped failed approaches;
- dropped completed work;
- checksum tampering;
- evidence-policy violations.

`verification/verification.md` distinguishes implemented controls, static verification, test expectations, and production verification still required. The package does not claim measured production improvements before deployment data exists.

## Safety
- Invalid or unknown continuity fails closed for mutating actions.
- Hidden chain-of-thought is never required.
- Secrets must not be copied into continuity state.
- High-risk/destructive actions still require normal authorization and human-approval controls; continuity validation is not an authorization substitute.
- Read-only recovery may continue when safe, but should not indirectly mutate external state.

## Failure handling
**Detection:** checksum failure, schema/policy failure, critical mismatch, stale turn, missing authoritative capsule, or exhausted recovery budget.

**Evidence:** validator emits structured JSON errors/mismatches.

**Retry:** one formatting repair plus bounded rehydrate attempts from policy; no unlimited retry loop.

**Fallback:** retain the last valid capsule generation and allow only safe read-only diagnosis.

**Escalation:** human/operator review when critical state cannot be recovered or when a dangerous action depends on disputed state.

**Stop condition:** no mutation until continuity is valid or an explicitly new authoritative task state is created.

## Definition of Done
An integration is complete only when:
- current public evidence/problem analysis is documented;
- policy is versioned and customized;
- pre-compaction checkpointing is wired;
- active-turn IDs come from the harness, not summary inference;
- post-compaction compare runs before mutation;
- bounded recovery is enforced;
- included tests pass in the target runtime;
- runtime-specific compaction fault injection proves critical drift is blocked;
- metrics are collected;
- approval/security boundaries remain intact;
- no blocking continuity issue remains.

## Customization
You may extend the capsule with domain-specific critical fields such as deployment environment, database migration ID, issue/PR ID, test baseline hash, approval token reference, or active incident ID. Add those paths to `critical_fields` so the deterministic comparison enforces them.

For large evidence, store only stable references/hashes in the capsule and keep raw artifacts elsewhere. This preserves correctness without turning the continuity contract into another oversized context source.
