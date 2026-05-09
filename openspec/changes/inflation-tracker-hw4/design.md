# Design: 冰淇淋物價大盤指數觀測站

## 技術架構
* **前端**：純 HTML / CSS / Vanilla JavaScript (不使用 Vue/React 等框架，使用原生的 `fetch` 呼叫 API)。
* **後端**：Node.js + Express.js
* **資料庫**：SQLite (純 SQL 語法操作，不使用 Sequelize/Prisma 等 ORM)

## 資料庫 Schema 設計
**資料表名稱**: `price_records`

| 欄位名稱  | 型態    | 說明                          |
| --------- | ------- | ----------------------------- |
| id        | INTEGER | 主鍵 (Primary Key), 自動遞增 |
| date      | TEXT    | 物價紀錄日期 (建議 YYYY-MM-DD) |
| item_name | TEXT    | 冰淇淋商品名稱                |
| price     | INTEGER | 價格                          |

**種子資料 (Seed Data)**
為利於驗證，伺服器啟動時寫入至少兩筆跨年份的測試資料：
1. `(date: '2010-01-01', item_name: '麥當勞蛋捲冰淇淋', price: 10)`
2. `(date: '2024-01-01', item_name: '麥當勞蛋捲冰淇淋', price: 18)`
3. `(date: '2024-05-01', item_name: '全家霜淇淋', price: 49)`

## API 路由規格

### 1. 取得物價紀錄清單
* **Endpoint**: `GET /api/records`
* **Description**: 從 SQLite 讀取並回傳 `price_records` 所有的資料。
* **Response**: 回傳 JSON 格式的紀錄陣列。

### 2. 新增物價紀錄
* **Endpoint**: `POST /api/insert`
* **Body** (URL-encoded 或 JSON):
  * `date` (string)
  * `item_name` (string)
  * `price` (number)
* **Description**: 將前端表單傳來的資料 INSERT 進入 `price_records` 表中。
* **Response**: 成功後回傳純文字訊息 (例如 `"新增成功"`，不回傳 JSON)。

## 前端邏輯設計 (Vanilla JS)
* **即時搜尋過濾**：前端在初次載入時透過 `GET /api/records` 取得所有資料並存在記憶體內。接著對搜尋框綁定 `input` 事件，一旦使用者打字，即時針對記憶體中的資料進行過濾 (`filter()`) 並重新渲染表格，達成免刷新即時搜尋。
* **趨勢計算邏輯**：
  1. 將取得的資料依據 `date` 進行升冪(或降冪)排序，或是確保迴圈判斷時是按時間順序。
  2. 建立一個追蹤各商品「前次價格」的 Map (如 `{ '麥當勞蛋捲冰淇淋': 10 }`)。
  3. 遍歷排序後的紀錄渲染表格時，比對該商品的目前價格與記錄中的前一次價格：
     * 如果大於前次價格，加入 `↑ 漲價` (紅色樣式)。
     * 更新 Map 中該商品的前次價格為目前處理中的價格，供下一筆紀錄比對。
