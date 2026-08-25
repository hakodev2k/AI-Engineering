# Index Design Rules
## Purpose
Balance read acceleration against write, storage, and maintenance cost.
## Scope
Primary, secondary, covering, filtered, partial, and specialized indexes.
## MUST
- Justify new indexes with observed workload evidence and expected access patterns.
- Evaluate write amplification, storage, maintenance, and overlapping-index cost before deployment.
- Validate selectivity and key ordering against representative predicates and joins.
## MUST NOT
- Add indexes speculatively to every filtered or joined column.
- Drop a production index without dependency, workload, and rollback analysis plus required approval.
## SHOULD
- Consolidate redundant indexes when evidence supports safe removal.
## Exceptions
Temporary incident mitigation may add an index rapidly with approval and mandatory post-incident review.
## Verification
Use query plans, index-usage statistics, write metrics, storage estimates, benchmark results, and schema review.