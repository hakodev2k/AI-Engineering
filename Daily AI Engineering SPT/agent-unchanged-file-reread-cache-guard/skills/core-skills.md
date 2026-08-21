# Core Skills

## Skill 1 — Baseline duplicate reads
**Purpose:** quantify duplicate reads before optimization.
**Trigger:** before enabling the guard.
**Inputs:** tool-call trace containing path/range/bytes, representative tasks.
**Preconditions:** trace timestamps and read boundaries are available.
**Required context:** repository/task IDs, compaction events, agent IDs.
**Tools:** trace parser, `read_cache_guard.py stats` after replay.
**Procedure:** normalize paths → group reads by task/path/range → hash returned content when available → mark identical rereads → compute bytes/tokens/latency duplicated → separate post-compaction rehydration from waste → record baseline.
**Decisions:** a reread is waste only when content fingerprint is unchanged and exact content residency is not required.
**Constraints:** never classify a changed file as duplicate from path alone.
**Expected output:** baseline table with duplicate calls, bytes, estimated tokens, latency.
**Metrics:** duplicate bytes/task, duplicate calls/task, reread latency.
**Verification:** sample at least 20 duplicate classifications manually or via replay fixtures.
**Failure handling:** if content fingerprints are absent, label findings provisional.
**Stop conditions:** baseline complete or data quality prevents reliable classification.

## Skill 2 — Guard a read
**Purpose:** avoid returning unchanged content twice.
**Trigger:** immediately before any file read.
**Inputs:** canonical path, requested range, context-residency requirement.
**Preconditions:** target exists and policy is loaded.
**Tools:** `read_cache_guard.py check`.
**Procedure:** canonicalize path → compute current fingerprint → compare compatible ledger ranges → if fingerprint/range match and context is sufficient, return compact `UNCHANGED_READ` receipt → otherwise perform actual read → record exact range/bytes.
**Decisions:** use `--require-context` whenever downstream work needs exact text and compaction may have removed it.
**Constraints:** do not suppress first reads, changed files, uncovered ranges, or explicit forced reads.
**Expected output:** either cache receipt or real content followed by ledger record.
**Metrics:** hit rate, bytes avoided, latency avoided.
**Verification:** changed-file fixture must always miss.
**Failure handling:** fail open to a real read if ledger is unavailable; record guard degradation.
**Stop conditions:** one deterministic decision per read.

## Skill 3 — Handle compaction safely
**Purpose:** preserve file identity without pretending exact text remains in model context.
**Trigger:** context compaction/summarization/reset boundary.
**Inputs:** ledger, compaction event.
**Tools:** `read_cache_guard.py compact`.
**Procedure:** mark all entries `context_residency=unknown` while preserving fingerprints/ranges → on future reads, distinguish proof-of-unchanged from proof-of-context → rehydrate only exact ranges needed for correctness.
**Decisions:** hashes survive compaction; semantic availability does not.
**Constraints:** never claim “already in context” after compaction unless host can prove it.
**Expected output:** retained cache identity with residency downgraded.
**Metrics:** forced rehydrations/compaction, duplicate bytes avoided after compaction.
**Verification:** `check --require-context` must miss after `compact`.
**Failure handling:** clear ledger if integrity cannot be established.
**Stop conditions:** all entries downgraded once per compaction event.

## Skill 4 — Verify optimization
**Purpose:** prove lower token use without correctness regression.
**Trigger:** after guard integration.
**Inputs:** same replay/task corpus used for baseline.
**Procedure:** replay baseline corpus → collect guarded metrics → compare duplicate calls/bytes/tokens/latency → run changed-file, partial-range, compaction and force-read fixtures → independently review any cache hit that influenced edits.
**Expected output:** Implemented / Measured / Verified status.
**Metrics:** >=80% duplicate-byte reduction target; false cache hits=0.
**Failure handling:** disable optimization if stale substitution occurs; preserve ledger for diagnosis.
**Stop conditions:** metrics and correctness gates pass or rollout is blocked.
