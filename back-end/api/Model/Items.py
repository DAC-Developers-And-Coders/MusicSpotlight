from datetime import datetime

from pydantic import BaseModel

class TrackItem(BaseModel):
    rank: int
    name: str
    artist: str
    cover: str | None = None
    url: str
    artist_url: str | None = None
    chart: str
    time: datetime
    tag: str | None = None

class AlbumItem(BaseModel):
    rank: int
    name: str
    artist: str
    cover: str | None = None
    listeners: int | None = None
    url: str
    artist_url: str | None = None
    chart: str
    time: datetime
    tag: str | None = None

class ArtistItem(BaseModel):
    rank: int
    name: str
    image: str | None = None
    listeners: int | None = None
    url: str
    chart: str
    time: datetime
    tag: str | None = None

class AlbumArtistItem(BaseModel):
    name: str
    listeners: int | None = None
    url: str
    time: datetime

class TrackSimplifiedItem(BaseModel):
    name: str
    url: str
    time: datetime
