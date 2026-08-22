# Schema Change Workflow

1. Classify proposed change: additive-compatible, conditionally compatible or breaking.
2. Map producers, consumers and stored history.
3. Parallelize contract review and downstream lineage impact.
4. Define migration/versioning strategy and coexistence window.
5. Add compatibility tests before deployment.
6. For breaking change, require explicit owner/consumer approval and rollback/migration plan.
7. Deploy producer/consumer changes in dependency-safe order.
8. Monitor parsing failures, null rates, freshness and rejected records.
9. Remove deprecated fields only after agreed exit criteria.

**Stop:** unknown consumers, missing owner, invalid compatibility assumptions or no safe migration path.
