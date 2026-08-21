# Engineering Rules

## MUST
- MUST bind execution to one active immutable plan contract identified by hash/version.
- MUST capture baseline repository state before the first mutation.
- MUST classify every mutating action by target path and operation class before execution.
- MUST evaluate cumulative changed scope, not only the current tool call.
- MUST treat forbidden paths as higher priority than allowed wildcards.
- MUST stop before mutation when a material deviation is detected.
- MUST create a new contract version and obtain explicit approval before architecture, dependency, business-rule, adjacent-subsystem, delete, deploy, or materially broader scope changes.
- MUST preserve Facts, Assumptions, Evidence, Decision, Risks, and Verification Status separately in deviation records.
- MUST use bounded retries: maximum 2 retries for the same failed execution mechanism unless the contract explicitly defines a lower limit.
- MUST verify every final changed path against the active contract/amendment chain.
- MUST map every acceptance criterion to evidence before reporting Verified.
- MUST keep implementation and independent verification separate for material/high-risk changes.

## MUST NOT
- MUST NOT treat filesystem/tool approval as approval to broaden task-level scope.
- MUST NOT infer plan approval from ambiguous state, tool error text, mode transitions, or absence of rejection.
- MUST NOT silently add dependencies, migrations, services, generated infrastructure, or unrelated refactors.
- MUST NOT “fix nearby issues while here” unless explicitly inside the contract.
- MUST NOT convert a failed planned mechanism into a broader workaround chain without a deviation gate.
- MUST NOT allow subagents to expand their delegated scope beyond the parent contract.
- MUST NOT weaken tests, validation, security controls, or acceptance criteria to make the implementation fit.
- MUST NOT claim success while unexplained changed files, unverified criteria, running mutators, or unresolved deviations remain.

## SHOULD
- SHOULD make allowed path patterns as narrow as practical.
- SHOULD include explicit out-of-scope examples for likely adjacent temptations.
- SHOULD prefer dry-run/read-only diagnosis before proposing an amendment.
- SHOULD display cumulative scope delta after each checkpoint for long-running tasks.
- SHOULD revalidate the active contract after context compaction, resume, delegation handoff, or workspace drift.
- SHOULD retain immutable contract/amendment records for audit and postmortem analysis.

## Material deviation test
A deviation is material when any answer is yes:
1. Does it touch a path/subsystem outside allowed scope?
2. Does it introduce an operation class absent from the contract?
3. Does it alter architecture, public API, schema, dependency graph, permissions, security posture, deployment, or business rules?
4. Does it change an acceptance criterion or invariant?
5. Does it substantially increase estimated blast radius or reversibility cost?

Material deviations require a new approved contract version before mutation.