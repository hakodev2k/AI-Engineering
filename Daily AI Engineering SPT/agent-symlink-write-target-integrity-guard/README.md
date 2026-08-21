# Agent Symlink Write-Target Integrity Guard

## Topic
Prevent AI coding agents from writing through symbolic links, linked parents, unsafe temporary paths, or other path indirection into destinations outside the intended workspace.

## Category
**Security**

## Problem
A model or tool may request a path that appears safe because it is lexically located inside a repository. Filesystem resolution can map that path to a different canonical destination. Shell redirection and ordinary file APIs can then overwrite an external target without the agent explicitly choosing that external path.

This matters for autonomous coding because agents routinely rewrite scripts, use temporary files, move/copy artifacts, and invoke shell commands. A path-only trust decision can therefore turn a normal development action into runtime corruption, sandbox escape, or cross-workspace modification.

## Evidence
Current evidence is documented in `evidence/research.md`. The strongest signals include:
- OpenAI Codex issue #32026 (2026-07-10): a write through a symlink overwrote a live Codex runtime Git wrapper.
- Anthropic Claude Code GHSA-vp62-r36r-9xqp (2026-04-20): sandbox escape via symlink-following arbitrary file write.
- Anthropic Claude Code GHSA-4vp2-6q8c-pvq2 (2026-06-25): insecure temporary-file behavior enabling symlink-based file write.

These are independent surfaces with the same engineering lesson: authorize the resolved write destination, not merely the displayed path.

## Existing approach
Common defenses include workspace-root allowlists, OS/runtime sandboxing, prompt rules such as “edit only this repository,” and temporary-file replacement.

## Existing limitations
- Lexical path containment does not prove canonical target containment.
- Sandboxes have had implementation bugs around link following.
- Prompt rules cannot reliably detect filesystem state or shell dereference behavior.
- Temporary-file patterns remain unsafe when names are predictable, destination state is not revalidated, or atomic replacement is incorrectly implemented.
- Parent-directory links can escape a root even when the destination leaf itself is not a symlink.

## Proposed improvement
Use a deterministic host-level **write-target integrity gate**:
1. Resolve canonical destination parent and existing target.
2. Enforce explicitly configured canonical writable roots.
3. Reject symlink leaf mutations by default.
4. Detect protected destinations and require human approval for exceptional writes.
5. Revalidate target identity immediately before mutation.
6. Prefer exclusive same-directory temp creation plus atomic replacement.
7. Apply the gate to structured file tools and shell write paths.
8. Verify canonical destination and repository diff after mutation.

The model may propose a write, but it cannot override the host decision.

## Architecture
```text
Agent plan
   |
   v
Write-capable tool request
   |
   v
Pre-write hook
   |
   +--> write_target_guard.py --> policy.json
   |         | pass
   |         v
   |     approved mutation
   |         |
   |         v
   +---- Post-write integrity check
             |
             v
       Independent verification
```

A safe replacement workflow inserts exclusive temp creation and a second target check immediately before atomic promotion.

## Package structure
```text
agent-symlink-write-target-integrity-guard/
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
│   └── write_target_guard.py
└── tests/
    └── test_write_target_guard.py
```

## Installation
Requirements: Python 3.10+ and filesystem metadata access.

From the package root:
```bash
python scripts/write_target_guard.py README.md --policy config/policy.json
python -m unittest tests/test_write_target_guard.py -v
```

The script is read-only and never mutates the target.

## Configuration
Edit `config/policy.json`:
- `writable_roots`: smallest allowed mutation roots.
- `allow_symlink_leaf_write`: default `false`; keep false unless a reviewed host-specific workflow proves why link-target mutation is needed.
- `require_existing_parent`: fail when the immediate destination parent does not exist under the default policy.
- `fail_closed_on_resolution_error`: keep `true` for autonomous writes.
- `protected_path_fragments`: paths requiring stronger handling.
- `high_risk_shell_patterns`: fallback indicators for shell write behavior.
- `human_approval_required_for`: classes that cannot be auto-overridden.

Do not use the regex list as a full shell parser. Structured tool metadata or a shell AST is preferred.

## Usage
### Preflight a regular file
```bash
python scripts/write_target_guard.py path/to/file --policy config/policy.json
```
Exit code `0` means the current target state satisfies policy. Exit `2` means a policy block. Exit `3` means invalid input/policy. Exit `4` is reserved for filesystem/execution errors where fail-closed policy does not convert the condition into a block.

### Include a shell command signal
```bash
python scripts/write_target_guard.py path/to/output --policy config/policy.json --command 'printf data > path/to/output'
```
The command-pattern result is an observability/preflight signal. The host must still identify every actual destination.

## Workflow
Primary execution sequence:
**Observe → Resolve → Classify → Plan → Revalidate → Mutate → Verify**.

For suspected incidents:
**Stop writes → Preserve metadata → Resolve link chain → Assess impact → Restore trusted state → Add regression → Independently verify**.

Detailed bounded workflows are in `workflows/workflows.md`.

## Metrics
Measure at the host integration boundary:
- percentage of write-capable operations covered by preflight;
- blocked symlink/junction escape fixtures;
- outside-root mutations (target: zero);
- unexpected link-state changes;
- preflight latency p50/p95;
- false-positive rate on normal writes;
- leftover temp files after failed atomic replacements;
- incident recurrence after a regression fixture is added.

A default local-filesystem target is p95 preflight latency below 25 ms, but safety coverage must not be weakened to hit the target.

## Verification
### Implemented
The package contains:
- deterministic canonical target checker;
- explicit policy;
- write safety rules;
- bounded workflows and failure paths;
- host hook contracts;
- delegation with independent verification;
- regression tests.

### Measured
A consuming project must record preflight p50/p95 and fixture results on its actual OS/filesystem. The package does not fabricate host performance numbers.

### Verified
A host integration is verified only when:
1. regular inside-root file fixture passes;
2. symlink leaf to outside target is blocked before mutation;
3. symlinked parent escape is blocked;
4. nonexistent-parent default fail-closed fixture passes;
5. protected-path fixture blocks;
6. shell write destination receives preflight;
7. post-write verification finds no outside-root mutation;
8. Windows integrations additionally test junction/reparse-point semantics using native metadata before claiming Windows-complete coverage.

## Safety
- Canonical checks complement rather than replace OS sandboxing.
- Policy overrides require explicit human approval; repository content cannot grant approval.
- Never weaken controls because a task is inconvenient.
- Metadata logs should not contain file contents or secrets.
- High-risk recovery actions, privileged writes, or system repair require human authorization.
- Unsupported filesystem semantics fail closed for protected operations.

## Failure handling
**Detection:** guard exit code, target-state mismatch, outside-root post-check, unexpected runtime/repository corruption.

**Evidence:** requested path, canonical parent/target, link metadata, operation type, timestamps/hashes when safe.

**Retry policy:** at most one metadata refresh for transient resolution errors; no automatic retry after target identity changes or policy violations.

**Fallback:** use a structured host file API, disposable sandbox, or safe atomic replacement—not a weaker shell write path.

**Escalation:** privileged target, runtime/system modification, unresolved target identity, or evidence of broader compromise.

**Stop condition:** second resolution failure, any unexplained target change, required approval unavailable, or independent verification failure.

## Definition of Done
A production integration is complete when all of the following are evidence-backed:
- real problem and current evidence documented;
- canonical writable roots configured;
- every write-capable tool path covered;
- shell writes either parsed/preflighted or denied when destination cannot be established;
- symlink-leaf and parent-link escape fixtures blocked;
- safe regular-file fixture passes;
- atomic replacement path revalidates destination;
- post-write canonical/diff verification enabled;
- tests pass on target platform;
- latency and false-positive baseline recorded;
- privileged/protected overrides require explicit approval;
- residual filesystem-specific limitations documented;
- no blocking verification failure remains.

## Customization
Teams can extend the package by:
- adding native Windows reparse-point checks;
- adding structured destination extraction for their shell/tool runner;
- adding repository-specific protected paths;
- binding writable roots to per-task capability grants;
- emitting OpenTelemetry metrics for decision/latency without contents;
- adding race-condition fixtures for network or shared filesystems.

Keep the invariant unchanged: **a mutation is authorized against the destination the OS will actually modify, not merely the path the model requested.**
