from scrapy.exceptions import DropItem
from musicrawling.items import TrackItem, ArtistItem, AlbumItem
import pymongo
from itemadapter import ItemAdapter

class ValidationPipeline:
    def process_item(self, item, spider):
        if isinstance(item, (TrackItem, AlbumItem)):
            fields_to_search = ['rank', 'name', 'artist', 'url', 'chart', 'time']
        elif isinstance(item, ArtistItem):
            fields_to_search = ['rank', 'name', 'url', 'chart', 'time']
        else:
            raise DropItem("Item is not of type TrackItem, AlbumItem, or ArtistItem")

        fields_missing = self.get_missing_fields(item, fields_to_search)

        if fields_missing:
            raise DropItem(f"Missing required field(s): {fields_missing}")

        return item

    @staticmethod
    def get_missing_fields(item, fields):
        return [field for field in fields if not item.get(field)]

class DuplicatesPipeline:
    def __init__(self):
        self.items_seen = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        key = (adapter['url'], adapter['chart'], adapter.get('tag'))

        if key in self.items_seen:
            raise DropItem(f"Item already seen: {key}")
        else:
            self.items_seen.add(key)
            return item

class NormalizePipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        adapter['rank'] = int(adapter['rank'])
        adapter['name'] = adapter['name'].strip()

        if adapter.get('artist'):
            adapter['artist'] = adapter['artist'].strip()

        if adapter.get('cover'):
            adapter['cover'] = adapter['cover'].strip()

        if adapter.get('image'):
            adapter['image'] = adapter['image'].strip()

        if adapter.get('listeners'):
            adapter['listeners'] = int(adapter['listeners'].replace(',','').replace('.','').strip())

        adapter['chart'] = adapter['chart'].strip()
        adapter['url'] = adapter['url'].strip()

        if adapter.get('tag'):
            adapter['tag'] = adapter['tag'].strip()

        if adapter.get('artist_url'):
            adapter['artist_url'] = adapter['artist_url'].strip()

        return item

COLLECTION_MAP = {
    TrackItem: "tracks",
    ArtistItem: "artists",
    AlbumItem: "albums",
}

class MongoPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI", "mongodb://localhost:27017"),
            mongo_db=crawler.settings.get("MONGO_DATABASE", "music_crawler"),
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

        self._create_indexes()

    def _create_indexes(self):
        for collection_name in COLLECTION_MAP.values():
            collection = self.db[collection_name]

            collection.create_index(
                [("url", pymongo.ASCENDING), ("chart", pymongo.ASCENDING), ("tag", pymongo.ASCENDING)],
                unique=True,
                name="uniq_url_chart_tag"
            )

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        item_dict = adapter.asdict()

        collection_name = COLLECTION_MAP.get(type(item), "items")
        collection = self.db[collection_name]

        query = {
            "url": item_dict["url"],
            "chart": item_dict["chart"],
            "tag": item_dict.get("tag"),
        }

        found_at = item_dict.get("time")

        item_dict_without_time = {
            key: value
            for key, value in item_dict.items()
            if key != "time"
        }

        collection.update_one(query, {"$set": {"time": found_at}, "$setOnInsert": item_dict_without_time}, upsert=True)

        return item