from fastapi import APIRouter, HTTPException
from Model.Items import ArtistItem, AlbumArtistItem
import controller as ctrl

router = APIRouter(prefix="/all", tags=["All"])

@router.get("/{album_or_artists}", response_model=list[AlbumArtistItem])
def get_all_artists(album_or_artists: str):
    if album_or_artists == "AL":
        results = ctrl.get_all_albums()
        error_message = "No albums found"
    elif album_or_artists == "AR":
        results = ctrl.get_all_artists()
        error_message = "No artists found"
    else:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {album_or_artists}")

    if not results:
        raise HTTPException(status_code=404, detail=error_message)
    return results