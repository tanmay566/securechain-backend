import hashlib, json, time

    
class Block:
    def __init__(self, index: int, data: dict, prev_hash: str, timestamp: float = None):
        self.index = index
        self.timestamp = timestamp or time.time()
        self.data = data #passed in dict/json format
        self.prev_hash = prev_hash
        self.hash = self.compute_hash()

    def compute_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "prev_hash": self.prev_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest() #hash

    def to_dict(self) -> dict:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "prev_hash": self.prev_hash,
            "hash": self.hash
        }

    @staticmethod
    def from_dict(d: dict) -> "Block":
        block = Block(d["index"], d["data"], d["prev_hash"], d["timestamp"])
        block.hash = d["hash"]  # trust stored hash when loading; is_valid() will catch tampering
        return block
  
class blockchain():
    pass



