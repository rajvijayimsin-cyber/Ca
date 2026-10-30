from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/api/all", tags=["all"])

_store: Dict[int, Dict[str, Any]] = {}
_next_id = 1


@router.get("")
def list_all() -> List[Dict[str, Any]]:
    return list(_store.values())


@router.get("/{item_id}")
def get_all(item_id: int) -> Dict[str, Any]:
    if item_id not in _store:
        raise HTTPException(status_code=404, detail="Not found")
    return _store[item_id]


@router.post("")
def create_all(data: Dict[str, Any]) -> Dict[str, Any]:
    global _next_id
    item = {"id": _next_id, **data}
    _store[_next_id] = item
    _next_id += 1
    return item


@router.put("/{item_id}")
def update_all(item_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    if item_id not in _store:
        raise HTTPException(status_code=404, detail="Not found")
    _store[item_id].update(data)
    return _store[item_id]


@router.delete("/{item_id}")
def delete_all(item_id: int) -> Dict[str, str]:
    if item_id not in _store:
        raise HTTPException(status_code=404, detail="Not found")
    del _store[item_id]
    return {"status": "deleted"}
