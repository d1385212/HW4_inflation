const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 設定靜態檔案伺服
app.use(express.static(path.join(__dirname, 'public')));

// 解析 request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 實作 GET /api/records 路由
app.get('/api/records', (req, res) => {
    const sql = 'SELECT * FROM price_records';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('查詢失敗:', err.message);
            res.status(500).send('查詢失敗');
            return;
        }
        res.json(rows);
    });
});

// 實作 POST /api/insert 路由
app.post('/api/insert', (req, res) => {
    const { date, item_name, price } = req.body;
    
    if (!date || !item_name || price === undefined || price === null) {
        res.status(400).send('欄位不齊全');
        return;
    }

    const sql = 'INSERT INTO price_records (date, item_name, price) VALUES (?, ?, ?)';
    db.run(sql, [date, item_name, price], function(err) {
        if (err) {
            console.error('新增失敗:', err.message);
            res.status(500).send('新增失敗');
            return;
        }
        res.send('新增成功');
    });
});

app.listen(PORT, () => {
    console.log(`伺服器啟動於 http://localhost:${PORT}`);
});
