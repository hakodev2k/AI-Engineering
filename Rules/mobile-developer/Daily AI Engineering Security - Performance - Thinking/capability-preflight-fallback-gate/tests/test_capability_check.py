import importlib.util
import pathlib
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "capability_check.py"
spec = importlib.util.spec_from_file_location("capability_check", MODULE)
cc = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(cc)


class CapabilityCheckTests(unittest.TestCase):
    def test_missing_hard_capability_blocks(self):
        doc = {"capabilities": [{
            "name": "browser",
            "hard": True,
            "declared": True,
            "discoverable": False,
            "callable": False,
            "healthy": False,
            "required_semantics": ["auth"],
            "provided_semantics": [],
        }]}
        result = cc.evaluate(doc)
        self.assertEqual("blocked", result["overall"])

    def test_ready_capability_passes(self):
        doc = {"capabilities": [{
            "name": "browser",
            "hard": True,
            "discoverable": True,
            "callable": True,
            "healthy": True,
            "required_semantics": ["dom"],
            "provided_semantics": ["dom", "screenshot"],
        }]}
        self.assertEqual("ready", cc.evaluate(doc)["overall"])

    def test_weaker_fallback_rejected(self):
        doc = {"capabilities": [{
            "name": "iab",
            "hard": True,
            "discoverable": False,
            "callable": False,
            "healthy": False,
            "required_semantics": ["authenticated-session", "dom"],
            "provided_semantics": [],
            "fallbacks": [{
                "name": "headless",
                "discoverable": True,
                "callable": True,
                "healthy": True,
                "provided_semantics": ["dom"],
            }],
        }]}
        result = cc.evaluate(doc)
        self.assertEqual("blocked", result["overall"])
        self.assertEqual("block", result["capabilities"][0]["decision"])

    def test_equivalent_fallback_accepted(self):
        doc = {"capabilities": [{
            "name": "primary",
            "hard": True,
            "discoverable": True,
            "callable": False,
            "healthy": False,
            "required_semantics": ["auth", "dom"],
            "provided_semantics": [],
            "fallbacks": [{
                "name": "alternate",
                "discoverable": True,
                "callable": True,
                "healthy": True,
                "provided_semantics": ["auth", "dom", "shot"],
            }],
        }]}
        result = cc.evaluate(doc)
        self.assertEqual("ready", result["overall"])
        self.assertEqual("fallback", result["capabilities"][0]["decision"])

    def test_optional_missing_degrades(self):
        doc = {"capabilities": [{
            "name": "viz",
            "hard": False,
            "discoverable": False,
            "callable": False,
            "healthy": False,
            "required_semantics": [],
            "provided_semantics": [],
        }]}
        self.assertEqual("degraded", cc.evaluate(doc)["overall"])


if __name__ == "__main__":
    unittest.main()
