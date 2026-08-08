import hashlib, json, time, os

    
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
  


class Blockchain:
    def __init__(self):
        self.chain: list[Block] = [self._create_genesis_block()]

    def _create_genesis_block(self) -> Block:
        return Block(0, {"info": "genesis block"}, "0" * 64)

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_block(self, data: dict) -> Block:
        new_block = Block(len(self.chain), data, self.get_latest_block().hash)
        self.chain.append(new_block)
        return new_block

    def is_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current, prev = self.chain[i], self.chain[i - 1]
            if current.hash != current.compute_hash():
                return False
            if current.prev_hash != prev.hash:
                return False
        return True

    def add_event(self, asset_id: str, event_type: str, org: str, full_record: dict) -> Block:
        record_hash = hashlib.sha256(
            json.dumps(full_record, sort_keys=True, default=str).encode()
        ).hexdigest()
        block_data = {
            "asset_id": asset_id,
            "event_type": event_type,
            "org": org,
            "record_hash": record_hash,
        }
        return self.add_block(block_data)

    def get_asset_history(self, asset_id: str) -> list[dict]:
        return [b.to_dict() for b in self.chain if b.data.get("asset_id") == asset_id]

    def save_chain(self, path: str = "chain.json"):
        with open(path, "w") as f:
            json.dump([b.to_dict() for b in self.chain], f, indent=2)

    def load_chain(self, path: str = "chain.json"):
        if not os.path.exists(path):
            return
        with open(path, "r") as f:
            raw = json.load(f)
        self.chain = [Block.from_dict(b) for b in raw]

def verify_asset(self, asset_id: str, current_snapshot_by_event_type: dict) -> dict:
    """
    current_snapshot_by_event_type: dict mapping event_type -> the
    freshly-rebuilt snapshot dict for that event, computed from CURRENT
    database state by the caller. We recompute its hash and compare
    against what's stored on-chain for that event.
    """
    if not self.is_valid():
        return {
            "valid": False,
            "reason": "Chain structure is broken (hash links don't match)",
        }

    for block in self.chain:
        if block.data.get("asset_id") != asset_id:
            continue

        event_type = block.data.get("event_type")
        current_snapshot = current_snapshot_by_event_type.get(event_type)

        if current_snapshot is None:
            continue  # caller didn't supply a snapshot to check for this event type

        recomputed_hash = hashlib.sha256(
            json.dumps(current_snapshot, sort_keys=True, default=str).encode()
        ).hexdigest()

        stored_hash = block.data.get("record_hash")

        if recomputed_hash != stored_hash:
            return {
                "valid": False,
                "reason": f"Data for event '{event_type}' has been altered since it was recorded",
                "failed_event_type": event_type,
                "failed_block_index": block.index,
            }

    return {"valid": True, "reason": "All recorded events match their on-chain proof"}

blockchain = Blockchain()
blockchain.load_chain()



