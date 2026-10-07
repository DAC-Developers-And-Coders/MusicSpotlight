from fastapi import APIRouter, HTTPException
from Model.Items import AlbumArtistItem, TrackSimplifiedItem
import controller as ctrl

router = APIRouter(prefix="/all", tags=["All"])

@router.get("/{album_artists_or_tracks}", response_model=list[AlbumArtistItem | TrackSimplifiedItem])
def get_all_artists(album_artists_or_tracks: str):
    if album_artists_or_tracks == "AL":
        results = ctrl.get_all_albums()
        error_message = "No albums found"
    elif album_artists_or_tracks == "AR":
        results = ctrl.get_all_artists()
        error_message = "No artists found"
    elif album_artists_or_tracks == "TR":
        results = ctrl.get_all_tracks()
        error_message = "No tracks found"
    else:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {album_artists_or_tracks}")

    if not results:
        raise HTTPException(status_code=404, detail=error_message)
    return results