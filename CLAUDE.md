# iGeoGo

Wails 3 桌面應用程式，使用 Go 後端 + React TypeScript 前端，搭配 Leaflet 地圖。

## Tech Stack

- **Backend**: Go 1.25, Wails v3 alpha.71
- **Frontend**: React 19 RC, TypeScript 5.2, Vite 5
- **Styling**: Tailwind CSS 4.1 (`@tailwindcss/vite` plugin)
- **Map**: Leaflet 1.9 + react-leaflet 5 RC
- **Package Manager**: pnpm (frontend)
- **Task Runner**: [Task](https://taskfile.dev) (Taskfile.yml)
- **Formatter**: Prettier (via VS Code settings), Go formatter for `.go` files

## Project Structure

```
├── main.go                  # Wails app 入口、視窗設定、事件廣播
├── greetservice.go          # 範例 Go service（自動綁定到前端）
├── go.mod                   # Go module（目前名稱為 changeme，待更名）
├── Taskfile.yml             # 主要 task 定義
├── build/
│   ├── config.yml           # Wails 3 app 元資料與 dev mode 設定
│   ├── darwin/              # macOS 建置
│   ├── windows/             # Windows 建置
│   ├── linux/               # Linux 建置
│   ├── ios/                 # iOS 建置
│   └── android/             # Android 建置
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx         # React 入口
│       ├── main.css         # 全域 CSS（import tailwind + 自訂 CSS）
│       ├── App.tsx          # Root 元件：Header + Map + Footer
│       ├── Map.tsx          # Leaflet 地圖元件
│       ├── components/      # UI 元件
│       │   ├── AppHeader.tsx
│       │   ├── AppFooter.tsx
│       │   └── LocationIndicator.tsx
│       └── styles/          # 自訂 CSS
│           └── map.css      # 地圖相關樣式（動畫等）
└── frontend/bindings/       # Wails 自動生成的 Go→TS 綁定（不要手動編輯）
```

## Commands

```bash
task dev          # 開發模式（Go hot reload + Vite dev server, port 9245）
task build        # 依平台建置 production
task package      # 打包成可發布格式
task run          # 執行已建置的應用程式
```

Frontend only:
```bash
cd frontend
pnpm install      # 安裝前端依賴
pnpm dev          # 單獨啟動 Vite dev server
pnpm build        # 單獨建置前端
```

## Architecture

### Go Backend
- `main.go`: 初始化 Wails app、建立視窗、啟動事件 goroutine
- Services 透過 `application.NewService()` 註冊，自動產生 TypeScript 綁定
- 前端 dist 透過 `//go:embed frontend/dist` 嵌入二進位檔
- macOS 視窗設定：隱藏標題列、半透明背景、50px invisible title bar

### Frontend
- 佈局：`AppHeader`(32px) + `Map`(flex-1) + `AppFooter`(32px) 垂直排列
- 地圖預設中心：台北 101 (25.0338, 121.5645)，zoom 13
- `LocationIndicator`：iOS 風格藍色定位點 + 脈衝動畫（Leaflet DivIcon）

### Frontend-Backend 通訊
- Wails 自動產生 TypeScript bindings（`frontend/bindings/`）
- Go service 方法 → 前端 `ServiceName.Method()` 回傳 Promise
- 事件系統：`application.RegisterEvent[T]()` + `app.Event.Emit()`

## Conventions

### Path Alias
- `@/` → `frontend/src/`（tsconfig.json + vite.config.ts 同時設定）

### Code Style
- Prettier: printWidth 100, singleQuote, trailingComma "all", semi, 2 spaces
- Go: 標準 `gofmt` 格式化
- 元件匯出：`const Component = () => { ... }; export default Component;`
- 註解語言：繁體中文

### CSS 組織
- `main.css`：`@import 'tailwindcss'` + import 自訂 CSS 檔案
- 自訂 CSS 放在 `frontend/src/styles/` 目錄下
- 優先使用 Tailwind utility classes，複雜動畫才用自訂 CSS

### TypeScript
- Strict mode 開啟
- `noUnusedLocals: true`, `noUnusedParameters: false`, `noImplicitAny: false`

## Known Issues / TODOs
- `go.mod` module name 仍為 `changeme`，需更名
- `build/config.yml` 中的公司/產品資訊仍為 template 預設值
