# Funnel Diagnosis
Purpose: find the highest-leverage constrained stage.
Trigger: KPI regression, growth plateau, planning cycle.
Inputs: funnel events, cohorts, segments, qualitative evidence, targets.
Preconditions: event definitions and data freshness known.
Procedure: map journey; validate instrumentation; calculate stage conversion; segment by source/persona/platform/time; isolate biggest economically meaningful gap; collect supporting qualitative evidence; rank hypotheses by impact/confidence/effort/reversibility.
Decisions: fix instrumentation before optimization when trust is low; prioritize downstream quality over raw volume.
Output: diagnosis with evidence, uncertainty, prioritized hypotheses and owner.
Quality: reproducible metric definitions and explicit baseline.
Failure: conflicting sources -> reconcile or mark uncertainty; two failed investigations -> escalate data ownership.
Stop: one decision-ready constraint and next test are identified.