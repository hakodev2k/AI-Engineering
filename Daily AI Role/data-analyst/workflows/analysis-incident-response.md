# Workflow: Analysis Incident Response

**Trigger:** published metric/analysis is materially wrong, sensitive data was mishandled, or a decision may be affected by a data defect.

1. Classify severity by user/business/security/compliance impact.
2. Stop propagation: mark affected reports unreliable and pause dependent decisions where authorized.
3. Preserve evidence, query/version, timestamps, and affected audience.
4. Parallelize source-defect investigation, metric-definition review, downstream impact assessment, and correction preparation.
5. Do not silently overwrite history; clearly mark correction and scope.
6. Escalate privacy/security/legal concerns immediately to accountable humans.
7. Validate corrected analysis independently before republishing.
8. Notify stakeholders with what changed, affected decisions, confidence, and next steps.
9. Complete Failure → Root Cause → Lesson → Process Improvement → Future Prevention.

**Stop condition:** incident closes only when corrected evidence is verified, affected consumers are informed, and prevention owner/date exists.
