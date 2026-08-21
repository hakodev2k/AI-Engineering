# Research Evidence

## Topic
Capability Preflight and Fallback Gate

## Category
Thinking

## Problem
Agents can plan around a capability that is suggested by ambient UI state, an installed skill/plugin, or product configuration even when the actual callable tool is missing or its runtime cannot initialize. The plan then proceeds on an unsupported assumption, fails late, retries the same broken path, or switches to a fallback that does not preserve required semantics such as an authenticated browser session.

## Why it matters now
Several August 2026 Codex reports show a concrete mismatch between capability appearance and capability availability. In `openai/codex#39562`, the agent received in-app-browser ambient state and a browser skill was present, yet tool discovery did not expose the browser-control capability. In `#39591`, the browser UI and ambient URL existed but the bundled browser runtime exited during initialization on macOS; rolling back restored control. In `#39136`, Windows users reported the browser UI working while control initialization failed a trusted-code-path check. These are different failure modes with the same planning hazard: visible/declared capability is not proof of callable healthy capability.

## Affected users
AI-agent users, coding agents, platform builders, plugin/skill authors, authenticated-browser workflows, visual QA/debugging workflows, and multi-tool orchestrators.

## Current public evidence

### Observed evidence
1. `openai/codex#39562` — ambient state says an authenticated in-app browser is open, but tool discovery exposes no direct browser-control tool; a separate headless browser is not equivalent because it lacks the authenticated session.
2. `openai/codex#39591` — on macOS build 26.814.41407 the browser runtime exits before returning a binding; the same machine works after rollback to 26.810.52044.
3. `openai/codex#39136` — on Windows the in-app browser renders pages but control initialization fails because a trusted RPC dependency does not resolve within a configured trusted path.

### Interpretation
Planning based on UI/ambient/plugin presence alone is under-verified. Capability evidence has layers: declared/ambient, discoverable, callable, healthy, and semantically suitable. A reliable agent should promote a capability to a dependency only after a bounded preflight proves the level required by the task.

## Existing approaches
- Tool discovery at the point of use.
- Retry after tool initialization failure.
- Generic fallback to another browser/tool.
- Asking the user for screenshots or manual actions after failure.
- Product/UI hints and ambient state indicating an available surface.

## Remaining limitations
- Discovery can occur after a plan already assumes the capability.
- Retrying a deterministic runtime initialization regression wastes turns.
- A fallback can be technically callable but semantically non-equivalent (for example, no shared authenticated session).
- Ambient state can become stale or represent only UI presence.
- Agents may conflate “installed”, “visible”, “discoverable”, “callable”, and “healthy”.

## Root-cause analysis
1. Capability state is represented by multiple unsynchronized signals.
2. Plans do not always declare which capabilities are hard dependencies.
3. No explicit evidence threshold is required before committing to a tool-dependent stage.
4. Fallback equivalence is not evaluated against task requirements such as authentication/session continuity or screenshot/DOM access.
5. Retry loops often lack failure-class-aware stop conditions.

## Improvement opportunity
Add a pre-task capability gate that builds an observable capability ledger, performs bounded discovery/health probes, classifies readiness, validates fallback equivalence, and prevents the plan from claiming a capability that has not met the required evidence level.

## Goal
Reduce late tool failures, repeated initialization attempts, unsupported assumptions, and invalid fallback decisions while improving clear recovery/handoff behavior.

## Metrics
- Required capabilities preflighted before dependent stage.
- Late capability failures after plan commitment.
- Repeated deterministic initialization attempts.
- Unsupported capability claims.
- Fallback equivalence violations.
- User/manual handoffs that occur only after bounded automated preflight.
- Rework/model turns caused by missing capability.

## Trigger
A plan requires a non-trivial external capability: browser control, MCP server, connected app, code execution, privileged write, visual inspection, or another runtime/plugin-dependent tool.

## Inputs
Task requirements, required capability semantics, ambient signals, discovered tools, health-probe results, permission/auth/session requirements, fallback candidates.

## Outputs
Capability ledger with `declared`, `discoverable`, `callable`, `healthy`, `semantically_suitable`, evidence, decision, fallback, and stop condition.

## Relevant sources
- https://github.com/openai/codex/issues/39562
- https://github.com/openai/codex/issues/39591
- https://github.com/openai/codex/issues/39136

## Proposed solution
The package supplies a deterministic capability checker and an evidence-driven workflow. It does not request hidden reasoning; it records observable Facts, Assumptions, Evidence, Decision, Risks, and Verification status.