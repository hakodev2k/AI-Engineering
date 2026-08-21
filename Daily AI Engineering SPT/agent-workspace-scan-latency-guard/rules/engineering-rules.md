# Engineering Rules

## MUST
1. MUST measure workspace-scan latency before optimizing.
2. MUST distinguish actual command time from agent/runtime pre- and post-tool overhead when instrumentation permits.
3. MUST bound filesystem probes by timeout and maximum entry count.
4. MUST preserve repository correctness: an optimization may not silently hide files that the task needs to detect.
5. MUST use reversible, least-risk mitigations before global configuration changes.
6. MUST re-run identical measurements after each mitigation.
7. MUST retain before/after metrics and the exact configuration change.
8. MUST treat a probe timeout as a performance failure, not as missing data.
9. MUST keep background Git probes non-blocking where possible, including `--no-optional-locks` when appropriate.
10. MUST explicitly detect WSL `/mnt/*` placement when Linux-side tools are used.
11. MUST require human approval before modifying global Git configuration or moving a workspace.
12. MUST verify ignore/exclude patterns with Git before relying on them.
13. MUST use per-workspace budgets rather than assuming every repository has identical acceptable scan cost.
14. MUST cap hypothesis retries; default maximum is three mitigation attempts before re-diagnosis.

## MUST NOT
1. MUST NOT disable sandboxing, approval, antivirus, or other security controls solely to meet a latency target.
2. MUST NOT use `git status -uno` as a universal permanent replacement for normal status when untracked files matter.
3. MUST NOT recursively enumerate known generated/dependency trees merely to decide whether they are large.
4. MUST NOT run unbounded `find`, `Get-ChildItem -Recurse`, or equivalent probes in agent hooks.
5. MUST NOT repeatedly run identical repository scans when a valid measurement/cache is already available.
6. MUST NOT share scan caches across workspaces without including workspace identity and invalidation inputs.
7. MUST NOT claim performance improvement from a single incomparable measurement.
8. MUST NOT suppress errors/timeouts to keep an agent run moving.
9. MUST NOT add generated paths to ignore/exclude unless they are confirmed not to contain required source/config artifacts.
10. MUST NOT modify `.gitignore` when `.git/info/exclude` is the more appropriate local-only fix without considering repository policy.
11. MUST NOT treat cross-filesystem placement as the only possible cause when Git/sandbox/plugin scans are independently slow.
12. MUST NOT turn off untracked-file visibility without documenting the correctness trade-off.

## SHOULD
1. SHOULD collect 3–5 samples for noisy workspaces and compare p50/p95.
2. SHOULD rank hotspots by latency contribution × invocation frequency.
3. SHOULD prefer pruning known generated paths over scanning them deeply.
4. SHOULD evaluate Git untracked cache and FSMonitor on large worktrees.
5. SHOULD keep WSL Linux workloads and repositories in the Linux filesystem when practical.
6. SHOULD coordinate expensive initialization across concurrent agents sharing one workspace.
7. SHOULD emit warnings before a workspace reaches a hard latency budget.
8. SHOULD preserve a fast rollback path for every mitigation.
9. SHOULD track agent/runtime version because scan regressions can be version-specific.
10. SHOULD include disk/CPU/process evidence when latency is not explained by Git timing alone.

## Observable checks
| Rule | Check |
|---|---|
| Baseline first | Baseline JSON exists before mitigation record |
| Bounded probes | Probe has timeout and max-entry settings |
| Security preserved | No automatic full-access/sandbox-off action exists |
| Correctness preserved | Ignore/exclude patterns verified; new required files remain discoverable |
| Regression enforcement | Guard returns non-zero for timeout/budget/regression breach |
| Re-measurement | Before and after artifacts use equivalent commands/config |
| Bounded retries | Workflow records <= 3 mitigation attempts before re-diagnosis |