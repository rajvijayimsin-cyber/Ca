"""HIPAA ORM Access Hooks — § 164.528 Accounting of Disclosures.
SQLAlchemy event listeners that auto-log access to models flagged as PHI.
Register by calling `register_phi_hooks(mapper_registry)` after models load.
"""
import logging
from sqlalchemy import event

logger = logging.getLogger(__name__)

# Models flagged as holding PHI. Populate at app startup; see register_phi_hooks.
PHI_MODELS = set()


def mark_phi_model(model_cls):
    """Decorator or helper — tags a SQLAlchemy model as PHI-bearing."""
    PHI_MODELS.add(model_cls)
    return model_cls


def _log_access(event_name: str, target) -> None:
    try:
        tbl = getattr(target, '__tablename__', type(target).__name__)
        logger.info('PHI_ACCESS: event=%s table=%s id=%r', event_name, tbl, getattr(target, 'id', None))
    except Exception:
        pass


def register_phi_hooks(base_or_models):
    """Register event listeners on all PHI_MODELS (or everything derived from Base).

    Call from startup after all models are imported:

        from compliance.orm_hooks import register_phi_hooks, mark_phi_model
        # mark models that contain PHI
        mark_phi_model(Patient); mark_phi_model(LabResult)
        register_phi_hooks(Base)
    """
    targets = list(PHI_MODELS)
    # Accept either a Base class (register on all subclasses) or an iterable
    if not targets and hasattr(base_or_models, '__subclasses__'):
        try:
            targets = list(base_or_models.__subclasses__())
        except Exception:
            targets = []
    elif not targets:
        try:
            targets = list(base_or_models)
        except TypeError:
            targets = []
    for m in targets:
        try:
            event.listen(m, 'after_insert', lambda _m, _c, t: _log_access('insert', t))
            event.listen(m, 'after_update', lambda _m, _c, t: _log_access('update', t))
            event.listen(m, 'after_delete', lambda _m, _c, t: _log_access('delete', t))
            # after_select is not a real event; SELECT-time logging is done at query layer
            logger.info('phi_hooks: registered for %s', getattr(m, '__tablename__', m.__name__))
        except Exception as e:
            logger.warning('phi_hooks: failed for %r: %s', m, e)
