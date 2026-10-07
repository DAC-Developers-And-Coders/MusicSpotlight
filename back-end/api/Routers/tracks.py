from fastapi import APIRouter, HTTPException
from Model.Items import TrackItem
import controller as ctrl

router = APIRouter(prefix="/tracks", tags=["Tracks"])

@router.get("", response_model=list[TrackItem])
def list_general_top_tracks():
    return ctrl.list_general_top_tracks()

@router.get("/{tag}", response_model=list[TrackItem])
def list_tag_top_tracks(tag: str):
    tracks = ctrl.list_tag_top_tracks(tag)

    if not tracks:
        raise HTTPException(status_code=404, detail=f"Top tracks not found for {tag}")
    return tracks
