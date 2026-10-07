from fastapi import APIRouter, HTTPException
from Model.Items import AlbumItem, AlbumArtistItem
import controller as ctrl

router = APIRouter(prefix="/albums", tags=["Albums"])

@router.get("", response_model=list[AlbumItem])
def list_general_new_releases():
    return ctrl.list_general_new_releases()

@router.get("/{tag}", response_model=list[AlbumItem])
def list_tag_top_albums(tag: str):
    albums = ctrl.list_tag_top_albums(tag)

    if not albums:
        raise HTTPException(status_code=404, detail=f"Top albums not found for {tag}")
    return albums