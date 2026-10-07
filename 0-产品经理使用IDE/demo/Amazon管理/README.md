# Amazon管理原型与静态发布

唯一业务依据：[Amazon管理产品方案](../../drafts/Amazon管理/Amazon管理产品方案.md)。该文件位于与头程管理并列的独立文档目录，正文保留输入方案，版本与分期以正文为准。

## 首次准备

在仓库根目录打开 PowerShell：

```powershell
Set-Location '0-产品经理使用IDE/demo/Amazon管理/amazon-dw-prototype'
npm.cmd ci --prefer-offline --no-audit --no-fund --ignore-scripts
npm.cmd run build
Set-Location '../../../..'
node '0-产品经理使用IDE/.agent/scripts/amazon-local.cjs'
```

打开 [员工端首页](http://127.0.0.1:5180/demo/员工端-demo/index.html)，进入「头程管理 → Amazon管理」，四个菜单为 DW货件列表、DW提单列表、Amazon任务中心、Smart Reroute（二期）。菜单、面包屑与顶部页签由员工端统一维护；四个菜单即时切换，支持浏览器前进/后退，重复点击不增加页签。菜单间切换保留当前Amazon实例的演示状态；离开Amazon或刷新后重置，符合原型演示边界。

打开 [本地方案预览](http://127.0.0.1:5180/amazon-docs/Amazon管理产品方案.html) 查看目录、正文及10张流程图。预览文件生成在忽略目录 `.local-preview/`，仅针对Amazon文档，不重建oss-site、不修改其他模块生成页。本地服务为员工端首页提供同款Vue/Element Plus依赖，避免首页菜单依赖CDN；原有首页内容和其他页面仍沿用既有CDN方式。

## 后续查看与编辑

已构建时，在仓库根目录运行上面的 `node` 命令即可查看；按 Ctrl+C 停止。

修改React源码后在 `amazon-dw-prototype/` 执行 `npm.cmd run build`，刷新本地员工端。若需独立热更新预览，执行 `npm.cmd run dev`，打开 [独立React预览](http://127.0.0.1:5178/?view=dw)；独立预览也使用「头程管理 → Amazon管理」层级。

## 源码与适配

- 源包：`../../Amazon管理/amazon-dw-prototype-v2.2.zip`；来源版本 `802689be341e7793d1e68ce5bde1fb2dc1427c45`（输入标识，压缩包没有Git历史可独立认证）。
- 完整解压在 `amazon-dw-prototype/`，保留业务组件、二期页面及上游文件。
- 原依赖配置保存在 `package.source.json`，本地 `package.json` 与 `package-lock.json` 使用纯React/Vite入口；`vite.local.config.ts` 不加载托管插件、认证、Worker、部署或数据库。
- `app/page.tsx` 适配菜单层级、嵌入显示、初始页面与安全消息切换，并按方案修正提单出发准入与SLA校验；`app/lifecycle.tsx` 保留本次演示会话的失败快照，导出明确区分接口失败样例、业务异常与当前异常，不冒充生产历史。其他源码交互保留。
- 托管配置、原锁文件、部署脚本只是源包留存，不作为本地启动要求，不执行。
- 原型使用演示数据，没有真实Amazon、Track123、MQ、通知服务或生产历史。具体差异与验收见[本地修复验证记录](../../analysis/2026-10-07-Amazon本地修复验证.md)。

修改前备份位置记录于 `backup-location.txt`；原有改动的内容摘要和被修改文件原件已保留在该临时备份目录。

源包内的服务渠道配置仍可从[独立配置演示](http://127.0.0.1:5180/demo/Amazon管理/amazon-dw-prototype/dist-local/index.html?view=channel)查看；员工端原有「服务管理 → 服务渠道」入口保持原位置，未增加第五个Amazon菜单。两者没有生产数据联动。

运行浏览器检查：在仓库根目录执行 `node '0-产品经理使用IDE/.agent/scripts/check-amazon-local.cjs'`。检查使用本机已有Chromium；其他机器可通过 `AMAZON_CHROMIUM` 环境变量指定浏览器路径。截图、CSV和结果JSON保存于 `.local-preview/`。

## 阿里云静态发布

在仓库根目录执行：

```powershell
node '0-产品经理使用IDE/.agent/scripts/amazon-release.cjs'
```

该命令只进行必要的 Vite 构建、文件复制与静态资源引用核对，不启动服务或浏览器，不上传。需要已安装源码依赖。发布目录为 `0-产品经理使用IDE/amazon-release/staff/`。

- 将该目录下四个 `Amazon_*.html` 上传至阿里云已有的 `/staff/`，文件名保持原样（包括中文、大小写及 Smart Reroute 中的空格）。
- 四个入口各自内含完整业务页面、普通脚本与样式，可独立打开；上传只需要四个HTML文件，不需要额外资源子目录。
- 与员工端其他页面一致，首页只通过一层 iframe 加载四个业务 HTML，Amazon入口内没有第二层 iframe，也没有外部模块脚本。每个入口内置自己的初始页面映射。四个中文入口的 URL 由浏览器按 UTF-8 编码；OSS 对象键保持实际文件名，不将百分号编码保存成文件名。
- 现有 `/staff/index.html` 和菜单继续复用，不覆盖其他业务文件。上传时保留目录结构，不需上传源码、node_modules 或仓库的 `demo/` 路径。
- 上传 HTML 建议使用 `text/html; charset=utf-8`，JS 使用 `application/javascript`，CSS 使用 `text/css`，SVG 使用 `image/svg+xml`。覆盖四个业务入口；已有缓存需以新版 HTML 为准。

线上运行完全为静态文件，无 localhost、Node 服务或本机文件路径依赖。原型自身的 `amazon:ready` 事件移除加载提示，并将就绪消息直接发给员工端首页；15秒未就绪或脚本报错会显示明确提示。双击 `demo/员工端-demo/index.html` 直接使用四个单文件业务页，无需本地服务、通用页面或第二层iframe转发。本地 HTTP 预览保留既有命令，直接加载四个业务HTML。

只核对已生成的发布文件可运行 `node '0-产品经理使用IDE/.agent/scripts/amazon-release.cjs' --check-only`；该模式不构建、不启动浏览器。本次未连接阿里云或验证远端上传状态。

静态打包只生成四个员工端业务HTML及其发布副本。源码未变且已有构建产物时，可使用 `--package-only` 仅重新打包。
