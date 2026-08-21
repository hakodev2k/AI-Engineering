# Research — Agent Permission-Policy Consistency Verifier

## Problem
Modern coding agents expose multiple permission surfaces at once: session mode, sandbox mode, allow/ask/deny rules, auto-review/classifier decisions, hooks, desktop UI state, subagent inheritance, MCP/tool annotations, and saved approvals. Public reports show these layers can disagree. The result can be either **unexpected blocking** of work that operators intended to allow or **unexpected execution** where approval semantics were assumed to apply.

## Category
**Security**

## Why it matters now
Long-running and multi-agent coding workflows increasingly depend on unattended execution. A permission state that is only visible in UI text or assumed to propagate is not enough: teams need evidence that the effective runtime behavior matches policy across surfaces and delegation boundaries.

## Current public signals

### Signal 1 — Claude Code subagents do not consistently inherit parent permission mode
Anthropic Claude Code issue #83421, opened 2026-08-02 and still open as of 2026-08-20, reports a main session in `bypassPermissions` while Task/Agent subagents repeatedly prompt on ordinary `Bash` and `Read` calls. The report states this breaks unattended multi-agent pipelines and conflicts with expected inheritance semantics.

Source: https://github.com/anthropics/claude-code/issues/83421

### Signal 2 — Claude Code auto classifier can deny calls while session remains in bypass mode
Anthropic Claude Code issue #84390, opened 2026-08-06 and still open as of 2026-08-20, reports `automode-blocked` denials inside sessions whose transcript still records `permissionMode: bypassPermissions`. The issue documents multiple occurrences across a 50-session sample and notes that the blocked operations included read-only commands.

Source: https://github.com/anthropics/claude-code/issues/84390

### Signal 3 — Codex Desktop reports contradictory effective permission state
OpenAI Codex issue #30898, opened 2026-07-02 and updated 2026-08-05, reports that full-access UI state and previously approved command prefixes did not consistently prevent later approval prompts or sandbox/network denials. The issue calls out the difficulty of distinguishing user policy, prefix matching, filesystem sandboxing, network sandboxing, and escalation behavior.

Source: https://github.com/openai/codex/issues/30898

### Signal 4 — Official guidance treats approvals and sandboxing as distinct layers
OpenAI's May 8, 2026 engineering article on running Codex safely states that sandboxing defines the technical execution boundary while approval policy determines when actions must stop for review; the two work together. This distinction is important because a UI notion of "full access" or a saved approval cannot be treated as proof that every lower-level boundary agrees.

Source: https://openai.com/index/running-codex-safely/

## Observed evidence, interpretation, proposed solution

### Observed evidence
- Parent and subagent permission behavior can diverge.
- A session can report one permission mode while a classifier still blocks actions.
- Desktop UI state and persisted approvals can disagree with actual sandbox/network behavior.
- Approval and sandbox controls are intentionally layered, so one layer cannot safely be assumed to imply another.

### Interpretation
Permission correctness is an **effective-state problem**, not a configuration-string problem. The reliable question is not "what mode does the UI say?" but "for this actor, tool, resource, surface, and risk class, what decision should occur and what decision actually occurred?"

### Proposed engineering solution
Build a small, model-independent conformance layer:
1. Define a **permission scenario matrix** containing expected outcomes for representative actor/surface/action combinations.
2. Record observed decisions from test runs or sanitized transcripts.
3. Compare expected vs observed behavior deterministically.
4. Fail closed on mismatches involving dangerous or side-effecting operations.
5. Treat unexpected prompts and unexpected denials as reliability regressions; treat unexpected allows as security regressions.
6. Require revalidation after agent/runtime upgrades, permission configuration changes, new hooks, new MCP servers, or subagent topology changes.

## Existing approaches

### Trust UI/session mode labels
Useful for operator awareness but insufficient as verification because lower-level classifiers, hooks, tool annotations, sandboxes, or child-agent runtime state may differ.

### Maintain allow/ask/deny rules
Necessary and auditable, but configuration presence does not prove propagation or runtime enforcement on every surface.

### Disable prompts globally
May reduce stalls but weakens security and still does not guarantee that other policy layers or platform-specific restrictions are bypassed.

### Rely on manual spot checks
Can catch obvious behavior but is difficult to repeat across versions and misses intermittent or delegation-specific mismatches.

## Root-cause hypotheses
1. Permission state is assembled from multiple configuration and runtime sources with different precedence.
2. Subagents or sidechains may receive incomplete parent state.
3. Desktop/CLI/SDK surfaces may interpret the same setting differently.
4. Auto-review/classifier and hooks can operate independently from the user-visible mode.
5. Tool annotations and sandbox/network policies add additional gates not represented by a single mode label.
6. Persisted approvals may be scoped to exact command forms, segments, sessions, or surfaces rather than the operator's broader mental model.

## Threat model

### Assets and boundaries
- filesystem write boundaries
- network egress
- credential-bearing resources
- destructive shell actions
- repository push/merge/deploy operations
- MCP/app tools with side effects
- parent → subagent delegation
- local session → desktop/CLI/SDK execution surface

### Failure modes
- **unexpected allow:** an action executes when policy expected ask/deny;
- **unexpected deny:** safe allowed work stalls;
- **unexpected ask:** unattended run stalls despite an explicit allow policy;
- **reason ambiguity:** decision occurs but runtime cannot identify the effective gate;
- **inheritance drift:** child agent has a different effective policy from the intended parent contract.

## Improvement target and metrics
- 100% of critical scenarios observed and compared before unattended production use.
- 0 unexpected allows in critical/high-risk scenarios.
- 0 unexplained permission decisions.
- >= 99% agreement across the configured regression matrix for low-risk scenarios, with every mismatch explicitly dispositioned.
- All parent/subagent inheritance scenarios tested when delegation is enabled.
- Revalidation completed after runtime, hook, MCP, or policy changes.

## Verification model
**Implemented:** scenario matrix, verifier, hooks, and workflow exist.

**Measured:** observed decision records have been collected for target environments.

**Verified:** verifier reports zero blocking security mismatches and all required scenarios are present.

## Sources
1. Anthropic Claude Code issue #83421 — https://github.com/anthropics/claude-code/issues/83421
2. Anthropic Claude Code issue #84390 — https://github.com/anthropics/claude-code/issues/84390
3. OpenAI Codex issue #30898 — https://github.com/openai/codex/issues/30898
4. OpenAI, "Running Codex safely at OpenAI", 2026-05-08 — https://openai.com/index/running-codex-safely/
5. OpenAI Codex permission request template — https://github.com/openai/codex/blob/main/codex-rs/prompts/templates/permissions/approval_policy/on_request_rule_request_permission.md
