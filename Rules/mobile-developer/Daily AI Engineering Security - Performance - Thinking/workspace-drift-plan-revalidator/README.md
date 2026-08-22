# Workspace Drift Plan Revalidator

**Category:** Thinking

## Problem
Long-lived AI coding sessions can resume with a plan, assumptions, and test conclusions that were valid for an earlier repository state. A user, another agent, CI, rebase, generated artifact, dependency update, or branch change can invalidate that state while the agent continues as if nothing changed.

## Evidence
See `evidence/research.md`. Current public signals include OpenAI Codex issue #36717 requesting material-workspace-drift detection before continuing stale plans, issue #36161 showing resumed-thread state can diverge from reported mode, and issue #35935 describing post-compaction task-state loss and repeated work.

## Existing approach
Agents commonly re-run `git status`, reread files, or rely on conversation summaries. These are useful but usually discretionary and do not bind a plan to a specific repository state.

## Existing limitation
There is often no deterministic pre-resume gate that proves whether the workspace still matches the state on which the current plan was approved.

## Proposed improvement
Create a lightweight checkpoint containing a repository fingerprint and explicit plan assumptions. On resume or before a high-impact implementation phase, compare current state with the checkpoint. Material drift invalidates affected assumptions and blocks blind continuation until the agent re-observes changed areas and refreshes the plan.

## Architecture
```text
checkpoint plan -> fingerprint baseline -> resume -> deterministic compare
  -> unchanged: continue
  -> changed: Drift Verifier -> refresh affected evidence -> revise/approve plan -> continue
```

## Package tree
```text
workspace-drift-plan-revalidator/
├── README.md
├── evidence/research.md
├── skills/revalidate-workspace-state.md
├── rules/plan-validity-rules.md
├── subagents/drift-verifier.md
├── workflows/resume-and-revalidate.md
├── hooks/pre-resume.md
├── scripts/workspace_fingerprint.py
└── tests/test_workspace_fingerprint.py
```

## Installation
Requires Python 3.10+ and Git. Copy this directory into an agent-instructions repository. No Python packages are required.

## Configuration
Choose a checkpoint path outside generated build output, for example `.agent-state/workspace.json`. The script records hashes and metadata, not file contents.

## Usage
```bash
python scripts/workspace_fingerprint.py baseline --output .agent-state/workspace.json
python scripts/workspace_fingerprint.py check --baseline .agent-state/workspace.json
```
Exit `0` means match; `2` means drift; other non-zero means the check failed.

## Workflow
Follow `workflows/resume-and-revalidate.md`. A changed fingerprint is evidence of drift, not proof that the entire plan is invalid. Revalidate only assumptions and conclusions affected by changed paths, branch/HEAD, dependencies, or generated state.

## Metrics
- stale-plan continuations detected before implementation;
- resumed sessions with a valid checkpoint;
- rework caused by stale assumptions;
- files reread after drift versus full rescans;
- false-positive classification rate;
- plan refresh latency.

## Verification
1. `python -m unittest tests/test_workspace_fingerprint.py`
2. Create a baseline in a temporary Git repository.
3. Confirm check exits `0` unchanged.
4. Modify/add/delete/commit/switch branch and confirm check exits `2`.
5. Confirm the workflow never validates a plan solely from conversation continuity.

## Safety
Read-only except writing the requested checkpoint. It never executes repository code and never stores file contents.

## Failure handling
If Git inspection fails, stop continuation rather than treating state as unchanged. Retry once after deterministic remediation; otherwise escalate.

## Definition of Done
Baseline captured; current state compared; drift mapped to assumptions; affected evidence refreshed; revised/unchanged decision recorded; independent verification passed; new baseline captured.

## Customization
Extend the fingerprint with dependency lockfiles, generated schema versions, migration heads, or CI artifact IDs when those are part of plan validity.