# [chopwood.me](https://chopwood.me)

基于 wencai 的 template 进行修改和优化，作为个人网站和博客使用。

- jest 替换成 vitest 方便进行单元测试
- wakatime 的 access_token 以及 refresh_token 存储到数据库中，避免 token 过期，同时加入缓存提高速度
- dashboard 页面使用 next js 的 app router 重构

## 如何运行

克隆代码

```sh
git clone https://github.com/chopwood
```

安装依赖

```sh
cd chopwood && pnpm install

# 或者
cd chopwood && yarn
```

启动开发服务

```sh
pnpm run dev
# 或者
yarn dev
```

然后修改 `src/contents/` 里面的内容即可。

wencai update:

- 个人信息/站点信息**硬编码**到项目中
- 博客文章是本地文件，评论可选择使用 giscus
- 关闭在线留言功能(Guestbook)功能
- ChatGPT AI、Spotify、Cal.com、Web3Forms、Github 分析、wakatime 记录都改为可配置项，自由决定是否启用
- 「Project」和 「learn」功能取消 API 层，直接在 `getStaticProps` 中完成数据获取
- 所有个人信息/站点信息改为可配置项
- 更容易扩展和定制（例如 menu 和技术栈）
- 增加「周刊」功能
- 一些优化：例如减少 `getStaticProps` 数据体积、链接代替 js 跳转等等
- 更多小细节...

_以下是原 readme_

---

<div align="center">
  <h1>Personal Website</h1>
  <p>🔥 Personal website was built originally from scratch using Next.js, TypeScript, Tailwind CSS, SWR, Firebase and Prisma with MySQL</p>
</div>
<br />

![3-devices-black](https://github.com/aulianza/aulianza.id/assets/15605885/068cae0e-7867-4767-b558-80ee049c9f1b)

## Introduction

This website was meticulously crafted from the ground up using Next.js, along with various complementary technologies. Its inception dates back to June 2023.

Ongoing enhancements, encompassing both functionality and content, are in the pipeline. This website stands as a treasured repository of my acquired knowledge, also serving as a platform for me to disseminate insights.

Feel welcome to utilize this website as a point of reference, a wellspring of inspiration, or as a template, all in accordance with the provided license. The source code is at your disposal to suit your specific requirements.

Should you find value in this resource, your consideration of leaving a rating is greatly appreciated. 😎👍🏻

If you have any questions, suggestions, input or anything else, don't hesitate to contact me🧑‍💻
<br /><br />

## Features

On this website there are several features that will continue to be updated and added in the future.

### 🤖 ChatGPT AI

You can access this feature by opening the command palette [cmd+k], then typing whatever you want to search/ask for.

Note:

If you're using Chat Completions engine model of ChatGPT, please concern about this:

Due this site is using free cloud hosting services (Vercel) with certain limitations (Serverless Function Execution Timeout), sometimes an error will occur if the response from the open AI API is too long, but you can change it in the vercel.json file to upgrade memory and maxDuration to be bigger according to the capabilities of your vercel plan.

### 💻 JavaScript Playground

A no-fuss pure JavaScript playground with a live feedback loop.

### 💬 Realtime Guestbook

Realtime guestbook chat is powered by Firebase. Anyone can leave me a message in this website.

### 🎧 Spotify

Displays song information being played on spotify in real time using the Spotify API and SWR.

### 🕗 Wakatime

Data is retrieved using the Wakatime API and then displayed on the dashboard, built with Next.js API routes deployed as serverless functions.

### 📝 Blogs

The content on this blog is meticulously managed and sourced from a self-hosted headless CMS powered by WordPress, exemplifying our commitment to a streamlined and efficient content delivery system.

The data fetching technique used to retrieve articles from WordPress CMS API involves using Client-Side Rendering (CSR) for the blog list and Server-Side Rendering (SSR) for the blog details.

### 🗳 Projects

The data projects on this blog are taken from the MySQL database connected through the Prisma Client. The database for this application is hosted on PlanetScale DB.

The data fetching method used to retrieve data projects is Incremental Static Regeneration (ISR) with 1 second revalidation and Server-Side Rendering (SSR) for the project details..
<br /><br />

## Performance

### PageSpeed Insights

Report URL: https://pagespeed.web.dev/analysis/https-aulianza-id/pk0y6xcz25?form_factor=desktop

![image](https://github.com/aulianza/aulianza.id/assets/15605885/d87a6083-caf3-4b84-ba59-975c07193a9f)

### GTmetrix

Report URL: [https://pagespeed.web.dev/analysis/https-aulianza-id/pk0y6xcz25?form_factor=desktop](https://gtmetrix.com/reports/aulianza.id/REEiduoo/)

![image](https://github.com/aulianza/aulianza.id/assets/15605885/953dc131-bf52-4ef6-913c-f6eb8fb6c6a7)
<br /><br />

## Getting Started

If you are interested in running this project on your local machine, you can do so in just 3 easy steps below. Additionally, remember to update the ".env.example" file to ".env" and replace the variables with your own in the ".env" file.

### 1. Clone this template using one of the three ways:

1. Clone using git

   ```bash
   git clone https://github.com/aulianza/aulianza.id
   ```

2. Using `create-next-app`

   ```bash
   npx create-next-app -e https://github.com/aulianza/aulianza.id project-name
   ```

3. Using `degit`

   ```bash
   npx degit aulianza/aulianza.id YOUR_APP_NAME
   ```

4. Deploy to Vercel or Netlify, etc

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/aulianza/aulianza.id)
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aulianza/aulianza.id)

### 2. Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### 3. Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.
<br /><br />

## License

This project is forked and adapted from [aulianza/aulianza.id](https://github.com/aulianza/aulianza.id) and [wencaizhang/webjam.cn](https://github.com/wencaizhang/webjam.cn).
Licensed under the [GPL-3.0 license](https://github.com/aulianza/aulianza.id/blob/master/LICENSE).
