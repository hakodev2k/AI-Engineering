# Retrieval Architecture Rules

## Purpose
Define Senior-level architectural constraints for retrieval-augmented generation (RAG) systems so retrieval, evidence, generation, and authorization remain separable, testable, observable, and evolvable.

## Scope
Applies to production RAG applications, assistants, search-to-answer systems, knowledge copilots, and agentic systems that retrieve external knowledge before generation.

## MUST
- The system MUST separate source ingestion, indexing, retrieval, evidence selection, prompt/context assembly, generation, and response validation into observable stages.
- Retrieval MUST remain independently testable from generation so relevance defects can be distinguished from model defects.
- The architecture MUST define explicit ownership for source-of-truth data, derived indexes, caches, and generated responses.
- Every retrieval path MUST preserve source identifiers and enough provenance to trace an answer back to retrieved evidence.
- Trust boundaries MUST be explicit wherever data crosses tenant, user, network, model-provider, or storage boundaries.
- Indexes MUST be treated as derived state unless the project explicitly defines otherwise; recovery MUST be possible from authoritative sources.
- Significant architectural changes MUST document expected effects on relevance, latency, cost, security, operability, and rollback.

## MUST NOT
- The generator MUST NOT be coupled to a single retrieval backend in a way that prevents independent evaluation or migration without a documented constraint.
- Generated text MUST NOT be treated as authoritative source data.
- Retrieval logic MUST NOT silently bypass authorization, provenance, or filtering layers for performance or convenience.
- Production architecture MUST NOT depend on undocumented implicit ordering between ingestion, indexing, and query-time components.

## SHOULD
- Interfaces between stages SHOULD use explicit contracts for queries, candidates, scores, metadata, evidence, and citations.
- Retrieval strategies SHOULD be replaceable behind stable boundaries when experimentation is expected.
- High-risk systems SHOULD include a response-validation or policy-enforcement stage after generation.

## Exceptions
Exceptions require documented context, rationale, alternatives considered, risk, verification evidence, and approval from the accountable technical owner when they weaken security, provenance, or production safety.

## Verification
Review architecture diagrams, module boundaries, interfaces, traces, integration tests, failure tests, and rollback procedures. Verify that retrieval can be evaluated without invoking generation and that every generated answer can be traced to its evidence path.