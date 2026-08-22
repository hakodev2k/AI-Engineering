# Schema Evolution and Backfill Knowledge

## Evolution
Additive fields are not automatically safe: consumers may use strict decoders, positional files or `SELECT *`. Type widening can still alter semantics. Renames and key/grain changes are usually breaking unless versioned.

## Backfill
A safe backfill defines range, deterministic inputs, target write semantics, chunk/checkpoint boundaries, dependency order, expected totals, cost limit and stop conditions. Full historical replay should not be the default when only bounded partitions are affected.

## Verification
Compare row counts, business totals, key uniqueness, expected null distribution and consumer-facing aggregates before/after. Preserve before-state evidence when rollback is possible.
