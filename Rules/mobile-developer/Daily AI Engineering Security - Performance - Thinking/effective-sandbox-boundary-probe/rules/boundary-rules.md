# Effective Boundary Rules

## MUST
- Record the exact runtime version, surface, declared sandbox mode, and resolved policy sources for every verification run.
- Treat configured/displayed sandbox level as a claim until harmless canaries confirm enforcement.
- Block high-autonomy execution when an action expected to be denied succeeds.
- Treat MCP/external executors as separate principals outside the local sandbox unless an explicit transitive policy is proven.
- Re-run the probe after runtime upgrades, policy changes, trust changes, or tool inventory changes.
- Use disposable fixtures only.
- Preserve evidence of declared policy, observed effect, and evaluator decision.

## MUST NOT
- Use destructive commands, production paths, real secrets, or production remote hosts as probes.
- Auto-promote a `FAIL_OPEN` or `UNKNOWN` result to pass.
- Assume local sandbox restrictions constrain remote execution tools.
- Infer enforcement solely from session headers, config files, or model statements.
- Weaken approval or sandbox settings merely to make tests pass.

## SHOULD
- Maintain a small cross-surface matrix for CLI, desktop, CI/headless, and MCP-enabled modes actually used by the team.
- Prefer deny-by-default for external execution capabilities that cannot be independently verified.
- Store probe outputs with CI/security evidence for later regression comparison.