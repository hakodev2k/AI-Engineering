import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "check_litellm_mcp_auth.py"
spec = importlib.util.spec_from_file_location("gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class GateTests(unittest.TestCase):
    def test_blocks_vulnerable_exposed_version(self):
        f = gate.inspect({"litellm_version":"1.83.7","mcp_exposed":True,"mcp_routes_blocked":False,"routes":[]})
        self.assertTrue(any("below fixed" in x for x in f))

    def test_allows_vulnerable_version_when_routes_verified_blocked(self):
        f = gate.inspect({"litellm_version":"1.83.7","mcp_exposed":True,"mcp_routes_blocked":True,"routes":[]})
        self.assertEqual([], f)

    def test_blocks_oauth_fallback_without_oauth_targets(self):
        f = gate.inspect({"litellm_version":"1.84.0","mcp_exposed":True,"routes":[{"name":"x","oauth_passthrough":True,"all_targets_oauth2":False,"capabilities":[]}]})
        self.assertTrue(any("OAuth passthrough" in x for x in f))

    def test_blocks_broad_public_exception(self):
        f = gate.inspect({"litellm_version":"1.84.0","mcp_exposed":True,"routes":[{"name":"x","public":True,"public_path_prefix":"/mcp/?x=.well-known","capabilities":[]}]})
        self.assertTrue(any("public MCP" in x for x in f))

    def test_blocks_anonymous_sensitive_capability(self):
        f = gate.inspect({"litellm_version":"1.84.0","mcp_exposed":True,"routes":[{"name":"x","anonymous_tool_access":True,"capabilities":["command-exec"]}]})
        self.assertTrue(any("anonymous access" in x for x in f))


if __name__ == "__main__":
    unittest.main()
