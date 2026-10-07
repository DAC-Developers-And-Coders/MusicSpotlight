from pymongo import MongoClient

class Database:
    def __init__(self):
        self.URI = "mongodb://localhost:27017"
        self.client = MongoClient(self.URI)

        self.DATABASE = self.client['music_crawler']

    def get_general_top_tracks(self):
        return self.DATABASE['tracks'].find({"chart": "top_tracks", "tag": None}).limit(10)

    def get_general_top_artists(self):
        return self.DATABASE['artists'].find({"chart": "top_artists", "tag": None}).limit(10)

    def get_general_new_releases(self):
        return self.DATABASE['albums'].find({"chart": "new_releases", "tag": None}).limit(10)

    def get_tag_top_tracks(self, tag):
        return self.DATABASE['tracks'].find({"chart": "top_tracks", "tag": tag}).limit(10)

    def get_tag_top_artists(self, tag):
        return self.DATABASE['artists'].find({"chart": "top_artists", "tag": tag}).limit(10)

    def get_tag_top_albums(self, tag):
        return self.DATABASE['albums'].find({"chart": "top_albums", "tag": tag}).limit(10)

    def get_all_albums(self):
        albums = self.DATABASE['albums'].find({}, {"_id": 0, "name": 1, "listeners": 1, "url": 1})

        albums_to_return = []
        for album in albums:
            if album['name'] not in albums_to_return:
                albums_to_return.append(album)
        return albums_to_return

    def get_all_artists(self):
        artists = self.DATABASE['artists'].find({}, {"_id": 0, "name": 1, "listeners": 1, "url": 1})

        artists_to_return = []
        for artist in artists:
            if artist['name'] not in artists_to_return:
                artists_to_return.append(artist)
        return artists_to_return

    def close(self):
        self.client.close()