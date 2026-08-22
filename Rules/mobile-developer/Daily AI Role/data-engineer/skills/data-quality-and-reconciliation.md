# Data Quality and Reconciliation

**Purpose:** prove that delivered data is fit for declared use.

**Trigger:** release, scheduled quality review, incident or source change.

**Procedure**
1. Select dimensions: schema, completeness, uniqueness, validity, freshness, referential integrity and reconciliation.
2. Establish baselines and thresholds with owners.
3. Run checks at source boundary, transformation boundaries and serving output.
4. Segment failures by deterministic data issue vs transient pipeline issue.
5. Quarantine invalid records when policy allows; never silently discard.
6. Reconcile counts and business totals against authoritative references.
7. Compare to historical distributions for anomaly evidence without treating anomaly as proof of defect.
8. Produce pass/fail evidence and affected consumer scope.

**Outputs:** quality report, failed-rule evidence, disposition and owner.

**Retry:** only transient checks; maximum from config. Deterministic invalid data does not improve by retry.
