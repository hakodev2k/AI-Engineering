import importlib.util, json, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("denial_gate", ROOT / "scripts" / "denial_gate.py")
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

CFG = {
  "trust_zones":{"local_sandbox":1,"mcp_remote":4},
  "side_effect_levels":{"read":1,"write":2,"execute":3}
}

class GateLogicTests(unittest.TestCase):
    def test_remote_equivalent_is_stronger(self):
        denied={"action":"build","target":"repo","side_effect":"execute","trust_zone":"local_sandbox"}
        proposed={"action":"build","target":"repo","side_effect":"execute","trust_zone":"mcp_remote"}
        _,a=mod.fingerprint(denied); _,b=mod.fingerprint(proposed)
        self.assertTrue(mod.equivalent(a,b,CFG))

    def test_different_target_is_not_equivalent(self):
        a={"action":"build","target":"repo-a","side_effect":"execute","trust_zone":"local_sandbox"}
        b={"action":"build","target":"repo-b","side_effect":"execute","trust_zone":"mcp_remote"}
        _,a=mod.fingerprint(a); _,b=mod.fingerprint(b)
        self.assertFalse(mod.equivalent(a,b,CFG))

    def test_missing_field_rejected(self):
        with self.assertRaises(ValueError):
            mod.fingerprint({"action":"build"})

if __name__ == "__main__": unittest.main()
