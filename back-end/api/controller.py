import service

def list_general_top_tracks():
    return service.list_general_top_tracks()

def list_general_top_artists():
    return service.list_general_top_artists()

def list_general_new_releases():
    return service.list_general_new_releases()

def list_tag_top_tracks(tag: str):
    return service.list_tag_top_tracks(tag)

def list_tag_top_artists(tag: str):
    return service.list_tag_top_artists(tag)

def list_tag_top_albums(tag: str):
    return service.list_tag_top_albums(tag)

def get_all_albums():
    return service.get_all_albums()

def get_all_artists():
    return service.get_all_artists()

def get_all_tracks():
    return service.get_all_tracks()