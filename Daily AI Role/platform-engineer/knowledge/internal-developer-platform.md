# Internal Developer Platform Principles

An IDP is a product for internal engineering users. Its value comes from reducing cognitive load while preserving necessary control.

Core principles:
- Treat developers as users and platform capabilities as products with contracts.
- Golden paths are recommended paved roads, not arbitrary constraints.
- Self-service must expose safe abstractions and useful failure messages.
- Standardize repeated undifferentiated work; preserve justified workload variation.
- Make ownership boundaries explicit: platform provides capability, consuming team owns its application responsibilities.
- Prefer declarative desired state and idempotent reconciliation when automation manages shared resources.
- Version contracts. Breaking change without migration strategy transfers platform cost to consumers.
- A service catalog is useful only if metadata is trustworthy and operationally maintained.
- Platform adoption should be earned through usefulness, reliability, documentation, and reduced friction.
