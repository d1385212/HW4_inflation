const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 1. 連線到 SQLite 資料庫
let dbPath;
if (process.env.WEBSITE_SITE_NAME) {
    // 部署至 Azure 環境：將資料庫置於持久化目錄
    const dataDir = '/home/data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, 'database.sqlite');
} else {
    // 本機環境
    dbPath = path.resolve(__dirname, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('資料庫連線失敗:', err.message);
    } else {
        console.log('成功連線至 SQLite 資料庫。');
        initDb();
    }
});

// 2. 初始化資料庫設定
function initDb() {
    // 建立 price_records 資料表
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS price_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            item_name TEXT,
            price INTEGER
        )
    `;

    db.run(createTableSql, (err) => {
        if (err) {
            console.error('建立資料表失敗:', err.message);
            return;
        }
        console.log('price_records 資料表已確認存在（或已成功建立）。');
        
        // 檢查並寫入種子資料
        seedData();
    });
}

// 3. 寫入真實的種子資料 (防呆機制：先檢查是否有資料)
function seedData() {
    db.get('SELECT COUNT(*) AS count FROM price_records', (err, row) => {
        if (err) {
            console.error('檢查資料表紀錄數失敗:', err.message);
            return;
        }

        // 若 count 大於 0，代表資料庫內已經有紀錄，跳過寫入
        if (row.count > 0) {
            console.log(`資料庫內已有 ${row.count} 筆資料，跳過寫入種子資料程序。`);
        } else {
            console.log('資料庫為空，開始寫入歷史種子資料...');
            // 使用 Prepared Statement 來安全地寫入資料
            const stmt = db.prepare('INSERT INTO price_records (date, item_name, price) VALUES (?, ?, ?)');
            
            // 修改後的考證過的歷史種子資料（只保留全家，麥當勞交給爬蟲負責）
            const seeds = [
                // 麥當勞的資料已經刪除，將由爬蟲 API 動態抓取
                ['2013-03-01', '全家霜淇淋', 30],
                ['2017-05-01', '全家霜淇淋', 35],
                ['2022-08-01', '全家霜淇淋', 49]
            ];

            seeds.forEach(seed => {
                stmt.run(seed, (err) => {
                    if (err) {
                        console.error('寫入種子資料失敗:', err.message);
                    }
                });
            });

            stmt.finalize(() => {
                console.log('種子資料自動寫入完成。');
            });
        }
    });
}

// 匯出 db 模組供 server.js 使用
module.exports = db;
