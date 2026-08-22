# Repository Evidence Inventory Completeness Gate

**Category:** Thinking

## Problem
Coding agents can start work from whatever happens to be loaded in context rather than first discovering the repository evidence needed to scope the task. The result can be an incomplete denominator, stale checkpoint assumptions, missed files/assets, and completion claims unsupported by current durable state.

## Evidence
See `evidence/research.md`. The package is motivated by two independent August 2026 reports: Anthropic Claude Code #84250, where an incomplete repository inventory caused work to cover only 44% of available screenshots, and OpenAI Codex #37325, where inherited checkpoint prose was promoted over current repository artifacts.

## Existing approach and limitation
Repository instructions, handovers, plans, search tools, and reviewer agents are useful, but none by themselves prove that the relevant evidence was actually discovered before implementation. Post-hoc review often finds omissions only after expensive work is done.

## Proposed improvement
Require a deterministic evidence inventory for scope-sensitive tasks, establish exhaustive denominators before mutation, classify inherited claims by provenance/freshness, and re-inventory before completion. Missing evidence remains unresolved rather than being interpreted as absent.

## Architecture
```text
user task + acceptance criteria
          |
          v
required evidence classes + roots
          |
          v
pre-mutation inventory ----> unresolved? ----> block / bounded search expansion
          |
          v
current authoritative artifacts
          |
          v
implementation
          |
          v
final inventory + delta classification
          |
          v
independent scope verification
```

## Package tree
```text
repository-evidence-inventory-completeness-gate/
├── README.md
├── config/
│   └── inventory.example.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-mutation-inventory-gate.md
├── rules/
│   └── evidence-inventory-rules.md
├── scripts/
│   └── check_inventory.py
├── skills/
│   └── repository-evidence-preflight.md
├── subagents/
│   └── scope-evidence-verifier.md
├── tests/
│   └── test_check_inventory.py
└── workflows/
    └── inventory-implement-reverify.md
```

## Installation
Requires Python 3.9+ and no third-party dependencies. Copy `config/inventory.example.json` to a project-specific inventory configuration and edit roots/patterns to match the repository.

## Configuration
`roots` defines authoritative search boundaries. `evidence_classes` declares named required or optional file classes with glob patterns. `exclude` removes generated/vendor paths. Required classes should represent evidence whose absence could change task scope, safety, or acceptance.

## Usage
```bash
cp config/inventory.example.json config/inventory.json
python scripts/check_inventory.py /path/to/repo config/inventory.json > inventory-baseline.json
python tests/test_check_inventory.py
```

After implementation, rerun the inventory. Use `--baseline inventory-baseline.json` when you need to identify files that appeared after baseline and classify them as implementation outputs versus newly discovered missed inputs.

## Workflow
Follow `workflows/inventory-implement-reverify.md`: Observe → measure baseline → diagnose evidence gaps → bounded search expansion → implement → measure again → classify deltas → independent verification.

## Metrics
- required evidence-class coverage: 100%;
- exhaustive tasks with pre-mutation denominator: 100%;
- post-implementation newly discovered missed inputs: 0;
- unsupported durable-state claims: 0;
- rework caused by inventory omission: lower than baseline.

## Verification
The implementing agent must not be the only verifier. `subagents/scope-evidence-verifier.md` independently reruns inventory and checks material claims against current artifacts. The verifier records observable facts and evidence only, never hidden chain-of-thought.

## Safety
The gate is read-only during baseline collection. It does not weaken repository protections or invent missing evidence. Symlinks are not followed by the walker. Declared roots are resolved and rejected if they escape the repository. Generated/vendor exclusions must be explicit.

## Failure handling
Detection: missing root/class, authority conflict, unexplained final delta, or unsupported completion claim. Evidence: retain baseline/final manifests and conflicting artifact references. Retry policy: maximum two evidence-driven search expansions and one implementation rework cycle. Fallback: report blocked/incomplete instead of guessing. Escalation: human owner for repository-boundary or authority ambiguity. Stop condition: retry budget exhausted or authoritative evidence remains contradictory.

## Definition of Done
**Implemented:** requested changes exist only after a valid preflight. **Measured:** baseline and final inventory manifests plus denominators are captured. **Verified:** all required classes resolve, no unexplained missed inputs remain, current durable artifacts support material completion claims, project verification/tests pass, and the independent verifier records no blocking issue.

## Customization
Add domain-specific evidence classes such as screenshots, migrations, OpenAPI specs, schemas, deployment manifests, benchmark fixtures, or release records. Prefer deterministic patterns and explicit roots over vague natural-language inventory requirements.