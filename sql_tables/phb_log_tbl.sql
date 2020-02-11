CREATE TABLE IF NOT EXISTS "phb_log_tbl" (
    "log_id" INT UNIQUE,
    "log_ts" TEXT DEFAULT '',
    "log_module" TEXT DEFAULT '',
    "log_isError" INT DEFAULT '1',
    "log_data" TEXT DEFAULT '',
    PRIMARY KEY ("log_id" AUTOINCREMENT)
);