import importlib.util, unittest
from pathlib import Path
SCRIPT = Path(__file__).parents[1] / 'scripts' / 'boundary_verifier.py'
spec = importlib.util.spec_from_file_location('boundary_verifier', SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
POLICY = {'max_depth': 8, 'forbidden_type_markers': ['function','constructor','prototype','error','class-instance','accessor','symbol','weakmap','weakset','proxy','host-bridge']}
class BoundaryVerifierTests(unittest.TestCase):
    def test_plain_json_passes(self): self.assertEqual([], mod.inspect_node({'tool': {'name':'read','args':[1, True, None]}}, POLICY))
    def test_host_error_blocked(self): self.assertTrue(any(f['reason']=='forbidden_host_type' for f in mod.inspect_node({'value': {'__host_type__':'error'}}, POLICY)))
    def test_constructor_surface_blocked(self): self.assertTrue(any(f['reason']=='prototype_or_constructor_surface' for f in mod.inspect_node({'schema': {'constructor':'Function'}}, POLICY)))
    def test_host_bridge_blocked(self): self.assertTrue(mod.inspect_node({'runtime': {'__host_type__':'host-bridge'}}, POLICY))
if __name__ == '__main__': unittest.main()
