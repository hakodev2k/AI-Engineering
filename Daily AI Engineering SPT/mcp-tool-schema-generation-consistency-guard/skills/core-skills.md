# Core Skills

## Skill 1 — Diagnose Schema-Generation Drift
**Purpose:** prove whether request dispatch and response validation use the same metadata generation.  
**Trigger:** intermittent `-32602`, unexpected output-schema failures, missing validation after refresh, or failures correlated with `tools/list_changed`.  
**Inputs:** client traces, tool catalogs, request IDs, timestamps, validation errors.  
**Preconditions:** preserve raw metadata refresh events and tool-call timing.  
**Required context:** MCP server identity, protocol version, client version, tool name, schema hash per refresh.  
**Tools:** trace/log inspection, `scripts/schema_generation_guard.py analyze`.  
**Procedure:** (1) establish a baseline without refresh; (2) assign deterministic catalog generation IDs; (3) correlate each dispatch with generation/schema hash; (4) correlate each response validation with generation/schema hash; (5) flag mismatch, missing validator, or partial generation; (6) reproduce with a delayed call plus concurrent refresh; (7) classify as dispatch/validation TOCTOU, failed-publication corruption, or unrelated error.  
**Decisions:** if generation differs, treat as confirmed drift; if validator disappears after failed refresh, treat as publication-integrity failure; otherwise continue evidence collection.  
**Constraints:** do not infer schema identity from tool name alone.  
**Expected output:** incident record containing Facts, Generation timeline, Failure class, Evidence, Confidence, Next action.  
**Metrics:** mismatch count, missing-validator count, refresh-failure preservation rate.  
**Verification:** replay the same timeline through the deterministic guard.  
**Failure handling:** if traces lack generation data, add instrumentation before changing behavior.  
**Stop conditions:** confirmed class or two bounded reproductions without evidence.

## Skill 2 — Build and Publish a Failure-Atomic Catalog Snapshot
**Purpose:** prevent a failed or partial refresh from corrupting the last known-good metadata.  
**Trigger:** startup catalog load, TTL expiration, explicit refresh, or `tools/list_changed`.  
**Inputs:** candidate `tools/list` result.  
**Preconditions:** a current generation may already exist.  
**Required context:** validator compiler, task metadata rules, trusted server/session identity.  
**Tools:** schema compiler, immutable maps/sets, atomic reference swap.  
**Procedure:** (1) fetch candidate catalog; (2) canonicalize and hash schemas; (3) compile every output validator into temporary state; (4) compute all routing/task metadata; (5) reject candidate if any element fails; (6) construct immutable generation object; (7) atomically publish one reference; (8) keep previous generation available to its in-flight leases; (9) emit refresh telemetry.  
**Decisions:** publish only complete candidates; preserve previous generation on all candidate failures.  
**Constraints:** no clear-then-fill mutation; no partial visibility.  
**Expected output:** one immutable generation with ID, tool metadata, validators, and creation timestamp.  
**Metrics:** refresh success rate, publish critical-section latency, partial-publication count (must be 0).  
**Verification:** inject compilation failure at first/middle/last tool and assert current generation identity remains unchanged.  
**Failure handling:** retry fetch/compile at most twice; then keep last good generation and surface stale status.  
**Stop conditions:** published complete generation or bounded failure recorded.

## Skill 3 — Pin Request Validation Provenance
**Purpose:** ensure each call is interpreted under one coherent tool contract.  
**Trigger:** immediately before `tools/call`.  
**Inputs:** tool name, arguments, current catalog generation.  
**Preconditions:** current generation is complete and trusted.  
**Required context:** output validator, task-support metadata, generation ID, schema hash.  
**Tools:** generation lease/ref-count or equivalent lifecycle mechanism.  
**Procedure:** (1) acquire current generation lease; (2) resolve tool and required task mode; (3) capture validator/schema hash before yielding; (4) dispatch request with trace provenance; (5) on response, validate using captured validator only; (6) release lease after validation/terminal failure; (7) never re-read mutable current metadata for this call.  
**Decisions:** if a schema was expected but no pinned validator exists, fail closed; error results follow protocol-specific error handling but remain generation-attributed.  
**Constraints:** refresh may proceed concurrently but cannot mutate pinned generation.  
**Expected output:** validated result plus provenance `{request_id,generation_id,schema_hash}`.  
**Metrics:** cross-generation validation count (0), validation coverage (100% when outputSchema exists).  
**Verification:** race test with old call/new refresh must accept old-conformant response and reject old-invalid response regardless of new schema.  
**Failure handling:** validation failure is terminal for that response; do not silently retry a side-effecting tool merely to obtain a new-schema response.  
**Stop conditions:** response validated/rejected and lease released.
