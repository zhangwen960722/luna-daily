---
name: oss-build-requires-npm-install
description: 重建 OSS 静态站时，需先确保 marked 依赖已安装
metadata:
  type: project
---

重建 `oss-site/` 时，`build-oss-site.js` 依赖 `marked` 包。`node_modules/` 可能已被删除（用户会自己清理），因此执行前必须先跑 `npm install`，再跑 `node build-oss-site.js`。

**Why:** `node_modules/` 不在版本控制中，用户会定期清理，marked 依赖不是常驻的。

**How to apply:** 用户说"更新 OSS""生成 OSS""OSS 站点"时，先检查 node_modules/ 是否存在，不存在则 `npm install` 后再跑 build。
