import unittest
from scripts.endpoint_binding_guard import evaluate

POLICY = {
    "allowed_schemes": ["https"],
    "default_allowed_ports": [443],
    "deny_ip_literals": True,
    "deny_url_userinfo": True,
    "credential_bindings": {
        "amazon-mq-rabbitmq": {
            "allowed_host_regex": r"^[a-zA-Z0-9-]+\.mq\.[a-z0-9-]+\.on\.aws$",
            "allowed_tools": ["rabbitmq_broker_initialize_connection"]
        }
    },
    "require_human_approval_for_exception": True
}

class GuardTests(unittest.TestCase):
    def test_valid_bound_endpoint_allows(self):
        event = {"tool": "rabbitmq_broker_initialize_connection", "credential_class": "amazon-mq-rabbitmq", "destination": "https://b-123.mq.us-east-1.on.aws"}
        self.assertTrue(evaluate(event, POLICY)["ok"])

    def test_attacker_domain_blocks(self):
        event = {"tool": "rabbitmq_broker_initialize_connection", "credential_class": "amazon-mq-rabbitmq", "destination": "https://evil.example"}
        r = evaluate(event, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("destination_not_bound_to_credential", r["reasons"])

    def test_ip_literal_blocks(self):
        event = {"tool": "rabbitmq_broker_initialize_connection", "credential_class": "amazon-mq-rabbitmq", "destination": "https://127.0.0.1"}
        self.assertFalse(evaluate(event, POLICY)["ok"])

    def test_http_blocks(self):
        event = {"tool": "rabbitmq_broker_initialize_connection", "credential_class": "amazon-mq-rabbitmq", "destination": "http://b-123.mq.us-east-1.on.aws"}
        self.assertFalse(evaluate(event, POLICY)["ok"])

    def test_wrong_tool_blocks(self):
        event = {"tool": "http_post", "credential_class": "amazon-mq-rabbitmq", "destination": "https://b-123.mq.us-east-1.on.aws"}
        self.assertFalse(evaluate(event, POLICY)["ok"])

if __name__ == "__main__":
    unittest.main()
