<p align="center">
    <img src="./assets/logo.svg" width="50%"/>
</p>

# Max Chang & Friends 张麦麦和朋友们

嗨！你好！这里是和我交换友情链接的地方。（目前应该没什么人来Orz）

## 基本要求

以下是一些基本要求：

+ 网站应有实质性内容、可稳定访问。
+ 独立域名：包括任意付费域名，或符合以下条件：
  + 包含在 [Public Suffix List](https://publicsuffix.org/list/public_suffix_list.dat) 中的后缀，如：`github.io`、`vercel.app`、`netlify.app`、`pages.dev`、`js.org` 等。
  + 部分在线内容托管服务的子域名，如：`wordpress.com`、`wodemo.com` 。
  + 以下域名不属于「独立域名」范畴：
    + 由 Freenom 公司运营的免费域名后缀。如 `.tk`、`.ml`、`.ga`、`.cf` 等。
    + 不包含在 Public Suffix List 中的后缀，如：~~`gitee.io`~~、`coding.io` 等。
+ 网站不包含违法、色情、赌博、暴力、政治等内容。

对于新认识的朋友们，希望借这个机会我们可以「先链后友」。

## 如何交换友链

+ 首先你需要添加我的站点到你的友链中。信息如下：

  ```yaml
  - name: 张麦麦
  link: https://zhangmaimai.com
  avatar: https://zhangmaimai.com/favicon.svg
  descr: 我的影子想要去飞翔，我的人还在地上。
  ```

  ```json
  {
    "name": "张麦麦",
    "link": "https://zhangmaimai.com",
    "avatar": "https://zhangmaimai.com/favicon.svg",
    "descr": "我的影子想要去飞翔，我的人还在地上。"
  }
  ```
+ Fork 本仓库，修改 [data/links.json](./data/links.json)，添加你的站点信息（可在 GitHub 直接编辑）。格式如下（不包含注释）：
  ```jsonc
  {
    "name": "站点名称",
    "link": "https://example.com", // 站点链接
    "avatar": "https://example.com/favicon.ico", // 站点头像（图标）
    "descr": "站点描述"
  }
  ```

+ 提交 Pull Request。等待自动格式检查通过后合并。
+ 当 PR 合并后，您的站点信息在 12 小时内会出现在 [Friends](https://zhangmaimai.com/friends) 页面。

---
<sub>
* 很大程度上受到了 <a href="https://github.com/SukkaW/Friends">SukkaW/Friends</a> 的启发，部分内容和代码借鉴了该仓库的内容。
</sub>
