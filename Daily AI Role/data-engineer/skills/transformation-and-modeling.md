# Transformation and Modeling

**Purpose:** convert raw data into stable, understandable data products.

**Inputs:** contracts, business rules, source samples, target grain, dimensions/measures, history requirements.

**Procedure**
1. State target grain and primary/business keys.
2. Separate cleansing, conformance and business derivation stages.
3. Choose incremental strategy and change-detection keys.
4. Handle late-arriving and corrected records explicitly.
5. Define history behavior for mutable dimensions/entities.
6. Make transformations deterministic for the same inputs/configuration.
7. Add schema, uniqueness, null, relationship and reconciliation checks.
8. Document lineage from source fields to outputs.

**Decisions:** denormalized vs normalized serving; snapshot vs event model; overwrite vs historical tracking.

**Quality:** one clear grain, no hidden many-to-many expansion, traceable calculations, reproducible output.

**Failure:** inconsistent business rules -> stop and obtain domain decision instead of guessing.
