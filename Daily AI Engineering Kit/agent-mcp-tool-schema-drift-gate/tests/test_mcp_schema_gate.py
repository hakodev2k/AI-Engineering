import importlib.util,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("gate",R/"scripts/mcp_schema_gate.py");G=importlib.util.module_from_spec(S);S.loader.exec_module(G)
class T(unittest.TestCase):
    def snap(self,s): return {"tools":[{"name":"t","inputSchema":s}],"resources":[],"prompts":[]}
    def test_optional_add_is_non_breaking(self):
        a=self.snap({"type":"object","properties":{"q":{"type":"string"}},"required":["q"]})
        b=self.snap({"type":"object","properties":{"q":{"type":"string"},"limit":{"type":"integer"}},"required":["q"]})
        self.assertEqual("pass",G.compare(G.validate(a),G.validate(b))["status"])
    def test_required_add_breaks(self):
        a=self.snap({"type":"object","properties":{"q":{"type":"string"}},"required":["q"]})
        b=self.snap({"type":"object","properties":{"q":{"type":"string"},"scope":{"type":"string"}},"required":["q","scope"]})
        self.assertEqual("fail",G.compare(G.validate(a),G.validate(b))["status"])
    def test_schema_change_breaks(self):
        a=self.snap({"type":"object","properties":{"n":{"type":"integer","maximum":100}}})
        b=self.snap({"type":"object","properties":{"n":{"type":"integer","maximum":10}}})
        self.assertEqual("fail",G.compare(G.validate(a),G.validate(b))["status"])
    def test_removed_tool_breaks(self):
        a={"tools":[{"name":"t","inputSchema":{}}],"resources":[],"prompts":[]};b={"tools":[],"resources":[],"prompts":[]}
        self.assertEqual("fail",G.compare(G.validate(a),G.validate(b))["status"])
    def test_description_change_ignored(self):
        a={"tools":[{"name":"t","description":"a","inputSchema":{"type":"object"}}],"resources":[],"prompts":[]}
        b={"tools":[{"name":"t","description":"b","inputSchema":{"type":"object"}}],"resources":[],"prompts":[]}
        self.assertEqual("pass",G.compare(G.validate(a),G.validate(b))["status"])
if __name__=="__main__":unittest.main()
