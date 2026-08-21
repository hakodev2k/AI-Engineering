# Engineering Rules

## MUST
- MUST define expected permission behavior independently of observed runtime behavior.
- MUST test effective decisions at the execution boundary; UI labels, model statements, and config presence are not proof of enforcement.
- MUST include parent and subagent variants when delegation is enabled.
- MUST treat an unexpected `allow` where policy expects `ask` or `deny` as a blocking security failure.
- MUST treat a missing critical scenario as a failed verification.
- MUST preserve sandbox, network, credential, destructive-action, and external side-effect boundaries while diagnosing permission drift.
- MUST record runtime/product version, execution surface, active permission mode, sandbox mode, and active hooks/policy layers with every regression run.
- MUST use safe/disposable targets for destructive or state-changing conformance scenarios.
- MUST require explicit human approval before testing any irreversible action against a real external system.
- MUST identify the effective gate/reason for critical decisions; `unknown` is not sufficient for release verification.
- MUST re-run the same frozen scenario matrix after any remediation.
- MUST independently review critical mismatch fixes; the implementing agent cannot be the sole verifier.

## MUST NOT
- MUST NOT broaden permissions simply to eliminate repeated prompts.
- MUST NOT change expected outcomes to make a failing runtime appear compliant.
- MUST NOT infer child-agent permissions from parent-agent mode without runtime evidence.
- MUST NOT treat `bypass`, `full access`, `never ask`, or similar labels as equivalent across products/surfaces without explicit evidence.
- MUST NOT execute destructive test commands against home directories, production infrastructure, real credential stores, or live deployment targets.
- MUST NOT store secrets, raw credential contents, or sensitive transcript payloads in conformance reports.
- MUST NOT use unlimited retries to chase intermittent permission behavior.
- MUST NOT suppress a security mismatch because the action is "probably safe".
- MUST NOT conflate filesystem sandbox denials, network denials, policy asks, hook denials, classifier denials, and tool-annotation prompts; classify them separately.

## SHOULD
- SHOULD maintain separate matrices for local development, CI, unattended automation, and production-adjacent environments.
- SHOULD use stable scenario IDs so regressions can be compared across versions.
- SHOULD test low-risk read operations as canaries for unexpected prompts/denials.
- SHOULD include command segmentation/pipeline variants when shell prefix policies are used.
- SHOULD include MCP/app side-effect scenarios when external tools are available.
- SHOULD repeat long-session or post-compaction scenarios when permission drift has been intermittent.
- SHOULD keep the conformance suite fast enough to run before upgrades and unattended sessions.
- SHOULD retain failed reports and minimal reproductions for vendor/framework issue reports.

## Observable acceptance rules
A release or unattended run is permission-policy compliant only when:
1. every critical scenario is observed;
2. no critical/high security mismatch exists;
3. required reliability scenarios do not unexpectedly ask/deny;
4. no critical decision has an unexplained reason class;
5. parent/subagent paired scenarios agree with the intended inheritance contract;
6. the verifier exits `0` on the approved matrix and observation set.
