# Memory Security Rules

1. Every durable memory write MUST include source identity, source type, trust level, writer identity, acquisition timestamp, and memory class.
2. Unknown or incomplete provenance MUST NOT be promoted directly into trusted memory.
3. External content containing instruction-like text MUST be stored, if at all, as untrusted data and MUST NOT be rendered as system/developer/tool instruction.
4. Low-trust memory MUST NOT authorize tool execution, credential access, policy changes, or production/repository writes.
5. Secret-like values MUST NOT be persisted unless the application explicitly supports a protected secret-reference memory class; raw secrets SHOULD be replaced with references.
6. Quarantined memory MUST NOT participate in autonomous privileged decisions.
7. Promotion from quarantine into `policy`, `authorization`, `credential-reference`, or `tool-instruction` memory MUST require an independent security review and configured human approval.
8. Memory readers MUST preserve provenance labels when retrieved content enters a model prompt.
9. Memory retrieval SHOULD distinguish fact, claim, instruction, policy, and observation classes rather than flattening them into plain text.
10. Expired memory MUST NOT be treated as current authority.
11. Security logging MUST record decision metadata and hashes, not raw secrets.
12. Gate/scanner failure MUST fail closed for privileged memory classes.
13. Security tests MUST include replay: a blocked/quarantined payload MUST remain unable to drive privileged behavior on later retrieval.
14. Implementers MUST NOT weaken trust thresholds or disable provenance checks merely to reduce false positives or latency.
15. Automated retry of a blocked write MUST be bounded to one corrected re-evaluation; repeated model paraphrasing MUST NOT be used as a bypass mechanism.
