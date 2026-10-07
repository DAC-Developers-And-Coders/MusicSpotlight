from fastapi import APIRouter, HTTPException
from Model.Items import ArtistItem, AlbumArtistItem
import controller as ctrl

router = APIRouter(prefix="/artists", tags=["Artists"])

@router.get("", response_model=list[ArtistItem])
def list_general_top_artists():
    return ctrl.list_general_top_artists()

@router.get("/{tag}", response_model=list[ArtistItem])
def list_tag_top_artists(tag: str):
    artists = ctrl.list_tag_top_artists(tag)

    if not artists:
        raise HTTPException(status_code=404, detail=f"Top artists not found for {tag}")
    return artists