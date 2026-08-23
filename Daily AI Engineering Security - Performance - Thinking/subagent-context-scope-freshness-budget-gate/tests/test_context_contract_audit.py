import importlib.util
import pathlib
import unittest

PATH = pathlib.Path(__file__).parents[1] / 'scripts' / 'context_contract_audit.py'
SPEC = importlib.util.spec_from_file_location('cca', PATH)
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)


class TestAudit(unittest.TestCase):
    def test_unopted_memory_blocked(self):
        doc = {'sources': [{'name': 'MEMORY.md', 'kind': 'auto_memory', 'tokens': 7000, 'required': False, 'opted_in': False}]}
        result = MOD.audit(doc, 30000)
        self.assertFalse(result['allowed'])
        self.assertIn('MEMORY.md', result['exclude'])
        self.assertEqual(result['effective_tokens_after_exclusions'], 0)

    def test_stale_required_refresh(self):
        doc = {'sources': [{'name': 'CLAUDE.md', 'kind': 'instructions', 'tokens': 1000, 'required': True, 'opted_in': True, 'captured_at': 10, 'current_mtime': 20}]}
        result = MOD.audit(doc, 30000)
        self.assertFalse(result['allowed'])
        self.assertIn('CLAUDE.md', result['refresh'])

    def test_required_over_budget(self):
        doc = {'sources': [{'name': 'policy', 'kind': 'instructions', 'tokens': 40000, 'required': True, 'opted_in': True}]}
        codes = [v['code'] for v in MOD.audit(doc, 30000)['violations']]
        self.assertIn('required_context_over_budget', codes)

    def test_clean_payload(self):
        doc = {'sources': [
            {'name': 'task', 'kind': 'task', 'tokens': 2000, 'required': True, 'opted_in': True, 'captured_at': 20, 'current_mtime': 20},
            {'name': 'notes', 'kind': 'memory', 'tokens': 1000, 'required': False, 'opted_in': True},
        ]}
        self.assertTrue(MOD.audit(doc, 30000)['allowed'])

    def test_duplicate_name_does_not_drop_required_tokens(self):
        doc = {'sources': [
            {'name': 'shared', 'kind': 'memory', 'tokens': 1000, 'required': False, 'opted_in': False},
            {'name': 'shared', 'kind': 'instructions', 'tokens': 2000, 'required': True, 'opted_in': True},
        ]}
        result = MOD.audit(doc, 30000)
        self.assertEqual(result['effective_tokens_after_exclusions'], 2000)
        self.assertEqual(result['required_tokens'], 2000)

    def test_invalid_tokens(self):
        with self.assertRaises(ValueError):
            MOD.audit({'sources': [{'name': 'x', 'tokens': -1}]}, 100)
        with self.assertRaises(ValueError):
            MOD.audit({'sources': [{'name': 'x', 'tokens': True}]}, 100)


if __name__ == '__main__':
    unittest.main()