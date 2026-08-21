# Rules — Watcher Budget

1. The runtime MUST measure the current watcher baseline before claiming an optimization.
2. A repository watcher MUST be keyed by a canonical repository identity; multiple tasks SHOULD reuse the same underlying watcher when isolation requirements allow it.
3. New watcher scope MUST NOT be added when measured utilization exceeds the configured block threshold unless a documented correctness requirement justifies it.
4. `.venv`, `node_modules`, `__pycache__`, build outputs, package caches, `.git/objects`, `.git/logs`, and transient agent-generated diff/cache trees SHOULD be excluded by default unless explicitly required.
5. `.gitignore` MUST NOT be treated as the watcher policy by itself.
6. Exclusion rules MUST support explicit allow overrides for semantically required generated or dependency files.
7. A watcher scope change MUST be verified with representative meaningful-change tests.
8. The system MUST record watcher start, stop, canonical repo ID, refcount, and failure events when those signals are available.
9. Repeated watcher starts for an unchanged repository MUST be investigated before increasing OS watch limits.
10. Raising `fs.inotify.max_user_watches` MAY be used as temporary capacity relief but MUST NOT be reported as root-cause remediation unless watcher scope/reuse has been measured and found appropriate.
11. Performance success MUST include before/after watch counts or utilization. “Feels faster” is insufficient.
12. Optimization MUST NOT disable filesystem monitoring required for security controls, source correctness, or build/test correctness merely to reduce resource usage.
