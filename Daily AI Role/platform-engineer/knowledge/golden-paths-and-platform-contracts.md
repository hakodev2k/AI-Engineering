# Golden Paths and Platform Contracts

A golden path packages an opinionated, supported journey for a common developer task such as service creation, deployment, observability, or environment provisioning.

A strong platform contract specifies:
- consumer and use case;
- supported inputs and defaults;
- outputs and observable state;
- permissions and ownership;
- failure semantics and retry behavior;
- SLO/support expectations;
- compatibility/version policy;
- lifecycle/deprecation behavior;
- extension and exception points.

Avoid leaky abstractions that hide failure modes consumers must understand. Avoid portals that merely wrap manual tickets. Prefer templates/APIs/workflows that produce reproducible state.

When exceptions are justified, record why the paved road does not fit, who owns the deviation, its risk, and whether the platform should evolve to support the use case broadly.