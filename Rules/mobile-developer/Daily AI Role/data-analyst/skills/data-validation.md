# Skill: Data Validation

**Purpose:** determine whether evidence is fit for interpretation.

**Trigger:** before material analysis, after source/schema change, or when results are surprising.

**Inputs:** tables/views/files, data dictionary, expected freshness, baseline totals.

**Steps:**
1. Verify source identity, owner, freshness, and observation window.
2. Check row counts and expected coverage by date/partition/key segment.
3. Test key uniqueness and duplicate behavior at analytical grain.
4. Quantify nulls, malformed values, late arrivals, impossible values, and excluded records.
5. Validate joins for one-to-one/one-to-many multiplication and dropped records.
6. Reconcile one or more material totals against a trusted reference when available.
7. Record unresolved defects and quantify likely bias direction/magnitude.

**Output:** source-fitness verdict: pass, pass-with-caveat, blocked.

**Quality:** checks must match the actual metric grain; generic row-count checks are insufficient.

**Failure:** block publication when defect could reverse a material conclusion; escalate upstream defect to data owner.
