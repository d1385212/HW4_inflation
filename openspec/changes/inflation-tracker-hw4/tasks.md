# Tasks: 開發任務清單

依據指示，依照「資料庫建置 -> 後端 API 開發 -> 前端畫面實作」順序拆解任務。

## 階段 1：資料庫建置與寫入種子資料 (`db.js`)
- [x] 初始化 Node.js 專案 (`npm init -y`) 並安裝必備套件 (如 `express`, `sqlite3` 等，不使用 ORM)。
- [x] 建立 `db.js`，包含連接 SQLite 資料庫的邏輯。
- [x] 撰寫純 SQL 語法：`CREATE TABLE IF NOT EXISTS price_records` (包含 `id, date, item_name, price` 欄位)。
- [x] 撰寫純 SQL 語法檢查是否有資料，若無則 `INSERT` 預設的測試歷史價格資料 (包含能驗證漲價趨勢的同一商品不同時期的資料)。

## 階段 2：後端 API 開發 (`server.js`)
- [x] 建立 `server.js` 啟動 Express 伺服器，並設定基礎的靜態檔案伺服 (`express.static`)。
- [x] 實作 `GET /api/records` 路由，並結合 `db.js` 查詢 `price_records` 資料表的全部資料。
- [x] 實作 `POST /api/insert` 路由，解析 request body。
- [x] 在 `POST /api/insert` 使用純 SQL `INSERT INTO price_records`，並回傳純文字 `新增成功` 訊息 (嚴禁回傳 JSON)。

## 階段 3：前端畫面實作 (`index.html`)
- [x] 建立 `public/index.html` 基礎結構 (包含 CSS 與 JS 所需的區塊)。
- [x] 刻畫輸入表單 UI (`date`, `item_name`, `price`) 以及「新增」按鈕。
- [x] 刻畫即時搜尋區塊 UI (搜尋文字輸入框)。
- [x] 刻畫資料呈現表格 UI (加入 `date`, `item_name`, `price`, `trend` 趨勢四個表格標頭)。
- [x] 撰寫 Vanilla JS：宣告一個全域變數存儲目前的歷史紀錄陣列。畫面載入時自動 `fetch` `GET /api/records` 將資料存入變數。
- [x] 撰寫 Vanilla JS：**實作趨勢箭頭判斷邏輯**。將取得的資料按時間排序，比對各商品的前次價格，若發現漲價，於趨勢欄位填入紅色的 `↑ 漲價`。
- [x] 撰寫 Vanilla JS：以計算出趨勢的資料去渲染表格。
- [x] 撰寫 Vanilla JS 添加事件監聽器：**實作即時搜尋過濾功能**。監聽搜尋框的 `input` 事件，依據輸入的值從全域變數中 `filter` 符合的項目重新呼叫渲染表格的方法 (無須 fetch 新的資料)。
- [x] 撰寫 Vanilla JS 添加事件監聽器：新增表單送出後，以 `fetch` 打向 `POST /api/insert`。
- [x] 新增成功後彈出 `alert(回傳純文字)`，之後清空表單、重撈全部資料 (`GET /api/records`)、重新計算趨勢並渲染表格。
