import hashlib, json, time
class Asset():
    def __init__(self, name, asset_id, asset_type, expiry, 
                 temp_constraint, status, created_at,
                 manufacturer, start_loc, end_loc):
        self.name = name
        self.asset_if = asset_id
        self.asset_type = asset_type
        self.expiry = expiry
        self.temp_constraint = temp_constraint
        self.status = status
        self.created_at = created_at
        self.manufacturer = manufacturer
        self.start_loc = start_loc
        self.end_loc = end_loc
    
class block():
    pass

class blockchain():
    pass

