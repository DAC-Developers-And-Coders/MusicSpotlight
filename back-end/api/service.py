from Model.Database import Database as Db
from Model.Items import ArtistItem, AlbumItem, TrackItem, AlbumArtistItem, TrackSimplifiedItem

database = Db()

def list_general_top_tracks():
    tracks = database.get_general_top_tracks()
    return [TrackItem(**track) for track in tracks]

def list_general_top_artists():
    artists = database.get_general_top_artists()
    return [ArtistItem(**artist) for artist in artists]

def list_general_new_releases():
    albums = database.get_general_new_releases()
    return [AlbumItem(**album) for album in albums]

def list_tag_top_tracks(tag):
    tracks = database.get_tag_top_tracks(tag)
    return [TrackItem(**track) for track in tracks]

def list_tag_top_artists(tag):
    artists = database.get_tag_top_artists(tag)
    return [ArtistItem(**artist) for artist in artists]

def list_tag_top_albums(tag):
    albums = database.get_tag_top_albums(tag)
    return [AlbumItem(**album) for album in albums]

def get_all_albums():
    all_albums = database.get_all_albums()
    return [AlbumArtistItem(**album) for album in all_albums]

def get_all_artists():
    all_artists = database.get_all_artists()
    return [AlbumArtistItem(**artist) for artist in all_artists]

def get_all_tracks():
    all_tracks = database.get_all_tracks()
    return [TrackSimplifiedItem(**track) for track in all_tracks]