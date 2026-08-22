# Watcher Resource Rules

- The agent runtime MUST measure watcher headroom before starting a broad recursive watcher on Linux.
- It MUST NOT treat increasing `fs.inotify.max_user_watches` as the default fix for uncontrolled watch growth.
- It MUST exclude dependency, cache, generated, virtual-environment, and unnecessary Git-internal trees unless a concrete feature requires them.
- It MUST canonicalize repository roots and SHOULD share one watcher when multiple tasks need equivalent scope.
- It MUST preserve at least 10% of the per-user watch capacity for other applications; implementations SHOULD use a larger reserve on shared developer desktops.
- At projected utilization >=90%, creation of new broad recursive watchers MUST be blocked or switched to a bounded fallback.
- Watcher teardown MUST be measured; a task MUST NOT be considered cleanly released when its expected watch delta remains materially allocated.
- Polling fallback MUST be bounded by directory scope and interval and MUST NOT scan ignored trees.
- Performance improvements MUST include before/after watch counts and ENOSPC evidence.
- Retry loops MUST be limited to two remediation cycles and MUST change the diagnosed cause.