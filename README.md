# 永不凋零的玫瑰花束

这是一个可以直接在手机浏览器打开的网页版本。它把原项目的 Python / pygame 桌面效果移植到了 HTML Canvas：粒子花束会持续旋转和盛开，支持重新盛开、切换配色和手机系统分享。

## 发布到 GitHub Pages

1. 把本目录中的文件上传到一个 GitHub 仓库的根目录。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. Branch 选择 `main`，目录选择 `/ (root)`，点击 **Save**。
5. 等待约一分钟，GitHub 会生成一个 `https://你的用户名.github.io/仓库名/` 链接。

把这个链接发给别人即可，微信、手机浏览器和 Safari / Chrome 都能打开。

## 本地预览

在项目目录运行：

```bash
python3 -m http.server 4173
```

然后打开 http://localhost:4173 。

## 说明

网页版本延续了原项目的创意和视觉方向；原项目由 Ling-Ta 创建，采用 MIT License。
