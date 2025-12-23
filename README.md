# 快乐学习乐园 🌈

专为学龄前儿童（3-6岁）设计的英语和数学学习 PWA 应用。

## 功能特性

- 🔤 **字母乐园** - 学习 26 个英文字母，配合图片和发音
- 🖼️ **单词卡片** - 50+ 基础单词，分类学习
- 🔢 **数字世界** - 认识数字 1-10
- 🎯 **数数游戏** - 互动式数数练习
- 📊 **学习进度** - 追踪学习成就
- 👨‍👩‍👧 **家长仪表盘** - 查看学习报告

## 设计特点

- 📱 **PWA 支持** - 可安装到 iPad/Mac 主屏幕
- 🎨 **儿童友好 UI** - 大按钮、明亮色彩、丰富动画
- 📴 **离线可用** - 本地存储学习进度
- 🌐 **响应式设计** - 适配各种屏幕尺寸

## 技术栈

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand + Dexie.js (IndexedDB)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 构建 GitHub Pages 版本
npm run build:gh
```

## 部署

### GitHub Pages（自动）

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

访问地址：`https://AlanCheen.github.io/AIForRay`

### Vercel（推荐）

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 自动部署完成

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── english/           # 英语模块
│   │   ├── alphabet/      # 字母学习
│   │   └── words/         # 单词卡片
│   ├── math/              # 数学模块
│   │   ├── numbers/       # 数字认知
│   │   └── counting/      # 数数游戏
│   ├── progress/          # 学习进度
│   └── parent/            # 家长入口
├── components/            # 可复用组件
├── data/                  # 静态学习内容
├── lib/                   # 工具函数
└── stores/                # 状态管理
```

## License

MIT

