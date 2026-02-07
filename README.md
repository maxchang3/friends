<p align="center">
<img src="./public/logo.svg" width="50%"/>
</p>

[简体中文](./README.zh-CN.md)

# Max Chang & Friends

Hi there! This is where you can exchange friend links with me. :)

If we haven't interacted before, I'm glad to get to know you through this
opportunity!

In today's era of declining independent blogs and mobile internet dominance, the
meaning of friend links seems to be more important than ever.

Although it's often said "friendship first, then links", for me, there aren't
many opportunities to exchange friend links with people I already know.

Therefore, I hope to take this opportunity to "link first, then friendship",
establishing connections between us.

## Basic Requirements

Here are some basic requirements:

- The website should have substantial content and be stably accessible.
- Independent domain: Including any paid domain, or domains that meet the
  following conditions:
  - Suffixes included in the
    [Public Suffix List](https://publicsuffix.org/list/public_suffix_list.dat).
    - Such as: `github.io`, `vercel.app`, `netlify.app`, `pages.dev`, `js.org`,
      etc.
  - Subdomains of some online content hosting services, such as:
    `wordpress.com`, `wodemo.com`.
- The website does not contain illegal, pornographic, gambling, violent,
  political, or similar content.

## How to Exchange Friend Links

1. First, you need to add my site to your friend links. Information as follows:
     ```yaml
     - name: Max Chang
       link: https://maxchang.me
       avatar: https://avatars.githubusercontent.com/u/36927158
       descr: My shadow wants to fly, but I'm still on the ground.
       rss: https://maxchang.me/rss.xml
     ```

     ```jsonc
     {
       "name": "Max Chang",
       "link": "https://maxchang.me",
       "avatar": "https://avatars.githubusercontent.com/u/36927158",
       "descr": "My shadow wants to fly, but I'm still on the ground.",
       "rss": "https://maxchang.me/rss.xml"
     }
     ```
2. Fork this repository, modify [src/data/links.json](./src/data/links.jsonc), and add your site information (you can edit it directly on GitHub). Format as follows (without comments):
     ```jsonc
     {
       "name": "Site Name",
       "link": "https://example.com", // Site link
       "avatar": "https://example.com/favicon.ico", // Site avatar (icon)
       "descr": "Site description" // One-line introduction: 20-30 characters recommended
       // "rss": "https://example.com/rss.xml" // Optional: RSS feed link
     }
     ```
3. Submit a Pull Request. Wait for automatic format checks to pass and then merge.
4. After the PR is merged, your site information will appear on the
  [Friends](https://maxchang.me/friends) page shortly.

---

<sub>
* Largely inspired by <a href="https://github.com/SukkaW/Friends">SukkaW/Friends</a>, some content and code are borrowed from that repository.
</sub>
