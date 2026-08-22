# Instrumentation and Measurement
Purpose: make growth decisions traceable to trustworthy events and metric contracts.
Trigger: new funnel, experiment, attribution or reporting change.
Inputs: journey, business definitions, event catalog, privacy constraints.
Procedure: define actor/action/object/context; specify event names/properties; map identity and attribution rules; define metric formulas/windows; validate firing, deduplication, ordering and freshness; document known gaps; add monitoring for critical events.
Decisions: block decision-grade analysis when required events are materially untrusted.
Output: instrumentation contract, metric dictionary and validation evidence.
Quality: every decision metric has owner, formula, source, window and caveats.
Failure: schema drift -> quarantine affected analysis and repair upstream.
Stop: critical events and metrics pass validation.