import importlib.util
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / 'scripts' / 'pagination_gate.py'
spec = importlib.util.spec_from_file_location('pagination_gate', MODULE)
pg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pg)

class Dummy:
    def __init__(self, links=None): self.links = links or {}

def test_extract_items_from_list():
    assert pg.extract_items([{'id': 1}], None) == [{'id': 1}]

def test_extract_items_nested_field():
    body = {'data': {'items': [{'id': 2}]}}
    assert pg.extract_items(body, 'data.items') == [{'id': 2}]

def test_link_next_target():
    r = Dummy({'next': {'url': 'https://api.example.test/items?page=2'}})
    assert pg.next_target(r, {}, 'link', None).endswith('page=2')

def test_cursor_terminal_when_missing():
    class A: cursor_field = 'meta.next'
    assert pg.next_target(Dummy(), {'meta': {'next': None}}, 'cursor', A()) is None

def test_fingerprint_is_stable():
    assert pg.fingerprint({'b': 2, 'a': 1}) == pg.fingerprint({'a': 1, 'b': 2})
