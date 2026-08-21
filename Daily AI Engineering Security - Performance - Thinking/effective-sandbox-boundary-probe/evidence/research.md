# Research — Effective Sandbox Boundary Probe

## Topic
Effective sandbox enforcement can diverge from the sandbox level configured or displayed by an AI coding runtime.

## Category
Security

## Problem
Developers, CI jobs, agent harnesses, and platform builders may treat a configured `read-only` or `workspace-write` sandbox as a hard security boundary. Recent public reports show that adjacent approval/configuration layers or tool-mediated remote execution can make the *effective* boundary broader than the declared boundary without a clear fail-closed signal.

## Why it matters now
Non-interactive coding agents increasingly run in CI, background workers, desktop integrations, and MCP-enabled environments. These contexts frequently lack a human at the exact escalation point, so a silent boundary mismatch can turn a policy assumption into real writes, network activity, or remote execution.

## Affected users
- teams using headless `codex exec` or similar agent runners;
- CI/evaluation harness maintainers;
- developers relying on read-only/workspace-write modes;
- MCP users exposing remote execution or external-compute tools;
- platform teams enforcing least privilege around autonomous agents.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #36570, opened 2026-08-02 and still open when researched, reports that `approvals_reviewer = "auto_review"` under `codex exec` can silently defeat an explicit `--sandbox read-only`: a canary file is written although the session header still shows the requested sandbox. Changing the reviewer to `user` restores enforcement. The report also notes project-local config as another route for the setting.
2. OpenAI Codex issue #32919, opened 2026-07-14 and open when researched, reports that an operation denied by the local sandbox can be performed through an already-available MCP remote executor without a fresh approval. The report frames this as a non-compositional trust boundary: local denial does not automatically propagate through an external execution capability.
3. Codex issue #37076 (2026-08-05) reports documentation/runtime ambiguity around shell commands and which sandbox settings they inherit, reinforcing that users cannot safely infer effective isolation from a single displayed mode.
4. Codex issue #35672 (2026-07-27) reports surprising interactions between approval policy and `workspace-write`, showing that approval and sandbox semantics are separate layers whose composition needs verification rather than assumption.

### Interpretation
The security problem is broader than a single configuration bug. A declared sandbox is one input into an authorization graph that may include runtime config precedence, approval reviewers, trusted-project config, MCP capabilities, remote executors, and different command surfaces. Security decisions based only on the requested mode can therefore be wrong.

### Proposed solution
Treat the sandbox as a *claim that must be verified*. Before enabling high-autonomy execution, run harmless canaries that test the effective write boundary and inventory external execution capabilities. Record `declared policy -> observed effect`; fail closed when a stricter boundary is expected but the canary crosses it, or when a remote-execution tool lacks an explicit independent trust decision.

## Existing approaches
- Rely on CLI flags/session headers such as `--sandbox read-only`.
- Configure approval policies separately.
- Trust MCP servers after installation/enablement.
- Manually inspect config precedence when behavior looks wrong.
- Use destructive commands as ad-hoc tests, which is unsafe and unnecessary.

## Remaining limitations
- Displayed configuration does not prove enforcement.
- Approval policy and sandbox policy may interact differently in interactive versus headless execution.
- Local filesystem sandboxing does not automatically constrain a remote executor.
- Configuration can come from user, project, command-line, or managed layers.
- One-time manual validation becomes stale after runtime/config upgrades.

## Root-cause analysis
1. Security policy is distributed across multiple independently evaluated layers.
2. Some escalation paths are model-reviewed rather than human-reviewed.
3. Non-interactive surfaces have no natural prompt fallback.
4. External tools are separate principals with capabilities outside the local sandbox.
5. Operators often validate configuration text rather than observable effects.
6. Runtime upgrades/config changes can invalidate previously tested assumptions.

## Improvement opportunity
A reusable canary gate can convert a hidden policy mismatch into a deterministic deployment failure. It can be rerun after upgrades and across surfaces, uses only throwaway markers, and produces evidence suitable for CI or security review.

## Metrics
- percentage of autonomy launches preceded by a passing boundary probe;
- fail-open canaries detected;
- declared/effective policy mismatch rate by runtime version/surface;
- external-executor tools with explicit trust decisions;
- time to detect sandbox regressions after upgrade;
- zero destructive actions used during verification.

## Relevant sources
- https://github.com/openai/codex/issues/36570
- https://github.com/openai/codex/issues/32919
- https://github.com/openai/codex/issues/37076
- https://github.com/openai/codex/issues/35672

## Evidence status
**Implemented:** this package provides a deterministic fixture/evaluator and an evidence-driven workflow.

**Measured:** adopting environments must execute the canaries on their actual runtime/surface.

**Verified:** only after the expected boundary is observed on every enabled execution surface and external executor capabilities are separately reviewed.