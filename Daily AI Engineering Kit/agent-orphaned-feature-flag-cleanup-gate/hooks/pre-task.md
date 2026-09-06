# Hook: Pre-task Flag Validation

**Trigger:** before editing a candidate retired flag.

**Preconditions:** exact flag key, repository root, registry, and policy are available.

**Action:** run `python scripts/flag_cleanup_gate.py scan --flag "$FLAG" --root . --registry "$REGISTRY" --policy config/flag-policy.json --out .flag-cleanup/scan.json` and inspect the registry/lifecycle evidence.

**Expected result:** scan evidence is created; every non-allowlisted reference is classified before implementation.

**Failure behavior:** missing registry entry, unreadable files, or contradictory lifecycle evidence blocks implementation. Transient tool errors may be retried at most twice.

**Blocks execution:** yes when lifecycle evidence is incomplete or conflicting.
