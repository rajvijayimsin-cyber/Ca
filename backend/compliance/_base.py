"""Locate the application's SQLAlchemy Base.

Generated projects keep it in different places depending on the
template. Guessing one and swallowing the failure is how a compliance
layer ends up not running while the site says it is.
"""
import importlib

# In the order they are likely, newest layout first.
CANDIDATES = (
    ("app.db", "Base"),
    ("app.database", "Base"),
    ("database", "Base"),
    ("db", "Base"),
    ("app.models", "Base"),
    ("models", "Base"),
)


def _find():
    tried = []
    for module_name, attr in CANDIDATES:
        try:
            module = importlib.import_module(module_name)
        except Exception as exc:  # noqa: BLE001
            tried.append(f"{module_name}: {exc.__class__.__name__}")
            continue
        found = getattr(module, attr, None)
        if found is not None:
            return found
        tried.append(f"{module_name}: no {attr}")
    raise ImportError(
        "the compliance layer could not find the application's SQLAlchemy "
        "Base, so its tables cannot be registered. Looked in: "
        + "; ".join(tried)
    )


Base = _find()
