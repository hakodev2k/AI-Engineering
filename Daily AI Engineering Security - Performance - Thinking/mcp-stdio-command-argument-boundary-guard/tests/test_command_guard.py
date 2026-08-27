import unittest
from scripts.command_guard import evaluate

POLICY = {
    "deny_shell_metacharacters": True,
    "forbidden_flags": ["-c", "--command", "-e", "--eval", "/c"],
    "servers": {
        "filesystem": {
            "executable": "npx",
            "required_prefix": ["-y", "@modelcontextprotocol/server-filesystem"],
            "max_extra_args": 1,
            "extra_arg_regex": r"^[A-Za-z0-9_./:\\-]+$",
        }
    },
}

class CommandGuardTests(unittest.TestCase):
    def test_exact_contract_allowed(self):
        r = evaluate({"server_id":"filesystem","transport":"stdio","executable":"npx","argv":["-y","@modelcontextprotocol/server-filesystem","/workspace"]}, POLICY)
        self.assertTrue(r["ok"])

    def test_npx_command_flag_blocked(self):
        r = evaluate({"server_id":"filesystem","transport":"stdio","executable":"npx","argv":["-y","-c","id"]}, POLICY)
        self.assertFalse(r["ok"])

    def test_shell_metacharacters_blocked(self):
        r = evaluate({"server_id":"filesystem","transport":"stdio","executable":"npx","argv":["-y","@modelcontextprotocol/server-filesystem","/tmp;id"]}, POLICY)
        self.assertFalse(r["ok"])

    def test_executable_only_allow_is_not_enough(self):
        r = evaluate({"server_id":"filesystem","transport":"stdio","executable":"npx","argv":["-y","evil-package"]}, POLICY)
        self.assertFalse(r["ok"])

    def test_unknown_server_fails_closed(self):
        r = evaluate({"server_id":"unknown","transport":"stdio","executable":"npx","argv":[]}, POLICY)
        self.assertFalse(r["ok"])

if __name__ == "__main__":
    unittest.main()
