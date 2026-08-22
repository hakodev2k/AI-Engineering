# Sandbox State Integrity Recovery Guard

**Category:** Security

## Problem
Persisted sandbox state can become corrupt, truncated, stale, or incompatible across runtimes. A sandbox that cannot initialize creates both availability pain and a security temptation: users or automation may disable the sandbox to keep working. This package makes recovery explicit, evidence-preserving, bounded, and fail-closed.

## Evidence
Current research is documented in `evidence/research.md`. Key signals include OpenAI Codex issues #39453, #36865, and #37187 covering corrupt sandbox state, cross-runtime marker incompatibility, and broken sandbox identity after interruption.

## Existing approach and limitation
Restart/update/reboot does not repair persistent state. Manual deletion destroys forensic evidence. Repeated elevated setup can recur when multiple runtimes disagree. Running unsandboxed restores availability by weakening the boundary.

## Proposed improvement
Validate state before trust; classify it as rebuildable vs authoritative; quarantine corrupt rebuildable state instead of deleting it; rebuild through the supported product path; and require an independent allowed/denied boundary probe before declaring recovery verified.

## Architecture
```text
sandbox-state-integrity-recovery-guard/
├── README.md
├── evidence/research.md
├── skills/recover-sandbox-state.md
├── rules/sandbox-state-rules.md
├── subagents/security-verifier.md
├── workflows/recover-and-verify.md
├── hooks/pre-sandbox-start.md
├── scripts/sandbox_state_guard.py
└── tests/test_sandbox_state_guard.py
```

## Installation
Python 3.9+; standard library only. Copy the package into the agent/runtime repository or invoke the script from this directory.

## Usage
Inspect rebuildable state:
```bash
python scripts/sandbox_state_guard.py inspect \
  --path /path/to/state.json \
  --classification rebuildable-cache \
  --schema-version 5 \
  --runtime-owner desktop
```

Quarantine only after classification:
```bash
python scripts/sandbox_state_guard.py quarantine \
  --path /path/to/state.json \
  --classification rebuildable-cache
```
The quarantine command uses an atomic rename and embeds a short SHA-256 in the evidence filename. It refuses authoritative or unknown state.

Run deterministic tests:
```bash
python -m unittest tests/test_sandbox_state_guard.py
```

## Workflow
Follow `workflows/recover-and-verify.md`: Observe → baseline → diagnose → recover → re-measure → independent boundary verification. The implementation agent must not be the only verifier.

## Metrics
Track corrupt-state detections, unsafe fallback count (target zero), repeated setup count, recovery time, schema/runtime incompatibility detections, and boundary-test pass rate.

## Verification
A state file being parseable is only **Implemented** integrity checking. A rebuild returning success is not sufficient. **Verified** means regenerated state is compatible and an independent probe shows expected allowed operations still work while an expected prohibited operation remains blocked.

## Safety
- Never automatically delete authoritative policy.
- Never bypass or weaken sandboxing because recovery failed.
- Preserve evidence before mutation.
- Require human approval for dangerous/irreversible remediation.
- Do not log secrets or unrelated file content.

## Failure handling
One bounded rebuild retry is permitted only after new evidence or a corrected setup condition. An identical failure signature after that must circuit-break and remain fail-closed.

## Definition of Done
Evidence captured; state classified; no security downgrade; corrupt rebuildable state preserved; supported rebuild completed; regenerated state revalidated; independent boundary probe passed; no unresolved blocker remains.

## Customization
Extend the script with product-specific schema fields or integrity envelopes, but keep unknown versions fail-closed. For shared state, prefer explicit runtime ownership/versioning and cross-process serialization rather than permissive coercion.
