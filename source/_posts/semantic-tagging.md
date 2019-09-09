---
title: 语义类标签学习及实操
date: 2019-01-31
tags:
 - html
 - tag
categories:
 - 
---

最近读了 `winter` 的 `“如何运用语义类标签来呈现Wiki网页”`。
所以自己也撸了一个简易版的Wiki网页来学习下。
<!--more-->

## 前言
这里不会讲所有标签，该怎么用，什么时候用，只会列出学到的，和自己撸出来的 Wiki 网页。

## Wiki 使用到的标签

|标签|说明|
|---|---|
|aside|侧边栏，可作当做文章的侧栏导航之类。|
|aritical|文章主体部分，常用于文章、帖子、博文、百科等。|
|nav|导航，例如：顶部导航、侧边栏导航、目录导航等。|

#### 标题

|标签|说明|
|---|---|
|hgroup|标题组，常用于标题搭配副标题。|
|h1~h6|标题，可以搭配标题组使用。|

#### 文本格式

|标签|说明|
|---|---|
|abbr|缩写内容，常见于 WWW、HTTP 等。|
|p|普通段落。|
|p.note|额外注释没有标签，可以用 p 标签加 note 类名来代替。|
|em|强调文本。|
|strong|重要文本。|
|dfn|被定义的名词，还可能有助于创建文档的索引或术语表例如：Internet、World Wide Web。|
|time|日期，让机器阅读更加方便。|

#### 引述标签

|标签|说明|
|---|---|
|blockquote|引述，段落级引述内容。|
|q|引述，行内引述内容。|
|cite|引述，作品名引述内容。|

#### 流内容

|标签|说明|
|---|---|
|figure|插入文章中的流内容，不仅限图片，音频、视频、代码、表格等。|
|figcaption|流内容的标题。|

#### 预格式化的文本

|标签|说明|
|---|---|
|pre|表示预先排版过，不需要浏览器帮忙排版。|
|samp|样式文本、示例文本、demo文本，一般和 pre 搭配使用。|
|code|代码文本，一般和 pre 搭配使用。|

#### 其他标签

|标签|说明|
|---|---|
|hr|表示故事走向的转变或者话题的转变，没有明显转变信息可以用 CSS 的 border 来实现纯视觉效果。|

## 补充标签

|标签|说明|
|---|---|
|small|之前表示字体缩小的废弃标签，HTML5 救回来表示补充评论。|
|s|之前表示斜体的废弃标签，HTML5 救回来表示错误的内容，经常用于电商领域表示打折前的价格。|
|i|之前表示斜体的废弃标签，HTML5 救回来表示读的时候变调。|
|b|之前表示黑体的废弃标签，HTML5 救回来表示关键词。|
|u|之前表示下划线的废弃标签，HTML5 救回来表示避免歧义的注记。|
|data|跟 time 标签类似，给机器阅读的内容，意义广泛，可以自由定义。|
|var|变量，多用于计算机和数学领域。|
|kbd|用户输入，表示键盘按键居多。|
|sup,sub|多用于化学/物理/数学领域（上标，下标）。|
|bdi,bdo|用于多语言混合时指定语言或者书写方向（左到右，右到左）。|
|mark|表示高亮，这里并非指显示为高亮，而是从读者角度希望的高亮（注意与 strong 的区分）。|
|wbr|表示可以换行的位置，主要是英文等文字不允许单词中间换行，这个标签一般在把多个单词沾成很长的单词时候用。|
|menu|ul的变体，用于功能菜单时使用|
|dl,dd,dt|一般出现较为严肃的文章，对一些术语进行定义，dt和dd其实并不总是成对出现，两者是多对多的关系。|
|main|整个页面只出现一个，表示页面的主要内容，可以理解为特殊的 div。|

## Demo

[wiki.html](https://unclay.github.io/blog/demo/semantic-tagging/wiki.html)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>World Wide Web - Wikipedia</title>
  </head>
  <body>
    <aside>
      <nav>
        <ul>
          <li><a href="#">Main page</a></li>
          <li><a href="#">Contents</a></li>
          <li><a href="#">Featured content</a></li>
        </ul>
      </nav>
      <nav>
        <h4>Interaction</h4>
        <ul>
          <li><a href="#">Help</a></li>
          <li><a href="#">About Wikipedia</a></li>
          <li><a href="#">Community portal</a></li>
        </ul>
      </nav>
    </aside>
    <article>
      <hgroup>
        <h1>World Wide Web</h1>
        <h4>From Wikipedia, the free encyclopedia</h4>
      </hgroup>
      <p class="note">
        "<dfn>WWW</dfn>" and "<dfn>The Web</dfn>" redirect here. For other uses of <dfn>WWW</dfn>, see <dfn>WWW</dfn> (disambiguation). For other uses of web, see <dfn>Web</dfn> (disambiguation).
        For the first web software, see WorldWideWeb.
        Not to be confused with the Internet.
      </p>
      <p>The <strong>World Wide Web</strong>, also known as the <strong>WWW</strong> and the <strong>Web</strong>, is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and accessible via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser in 1990 while employed at CERN near Geneva, Switzerland.[2][3] The browser was released outside CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.</p>
      <figure>
        <img src="" alt="/wiki/File:Web_Index.svg">
        <figcaption>A global map of the web index for countries in 2014</figcaption>
      </figure>
      <nav>
        <h4>Contents</h4>
        <ol>
          <li>1 History</li>
          <li>2 Function</li>
          <li>
            <ol>
              <li>2.1 Linking</li>
              <li>2.2 Dynamic updates of web pages</li>
            </ol>
          </li>
          <li>3 Web security</li>
        </ol>
      </nav>
      <hgroup>
        <h2>History</h2>
        <h4>Main article: History of the World Wide Web</h4>
      </hgroup>
      <figure>
        <img src="" alt="The NeXT Computer">
        <figcaption>The NeXT Computer used by Tim Berners-Lee at CERN.</figcaption>
      </figure>
      <figure>
        <img src="" alt="The corridor">
        <figcaption>The corridor where WWW was born. CERN, ground floor of building No.1</figcaption>
      </figure>
      <p>Tim Berners-Lee's vision of a global hyperlinked information system became a possibility by the second half of the 1980s.[8] By 1985, the global Internet began to proliferate in Europe and the Domain Name System (upon which the Uniform Resource Locator is built) came into being. In 1988 the first direct IP connection between Europe and North America was made and Berners-Lee began to openly discuss the possibility of a web-like system at CERN.[9] In March 1989 Berners-Lee issued a proposal to the management at CERN for a system called "Mesh" that referenced ENQUIRE, a database and software project he had built in 1980, which used the term "web" and described a more elaborate information management system based on links embedded in readable text: "Imagine, then, the references in this document all being associated with the network address of the thing to which they referred, so that while reading this document you could skip to them with a click of the mouse." Such a system, he explained, could be referred to using one of the existing meanings of the word hypertext, a term that he says was coined in the 1950s. There is no reason, the proposal continues, why such hypertext links could not encompass multimedia documents including graphics, speech and video, so that Berners-Lee goes on to use the term hypermedia.[10]</p>
      <ul>
        <li>a system of globally unique identifiers for resources on the Web and elsewhere, the universal document identifier (UDI), later known as uniform resource locator (<dfn>URL</dfn>) and uniform resource identifier (<dfn>URI</dfn>);</li>
        <li>the publishing language HyperText Markup Language (<dfn>HTML</dfn>);</li>
        <li><s>the Hypertext Transfer Protocol (<dfn>HTTP</dfn>).</s><small>[24]</small></li>
      </ul>
      <pre>
        <smap>
          GET /home.html HTTP/1.1
          Host: www.example.org
        </smap>
      </pre>
      <p>The computer receiving the HTTP request delivers it to web server software listening for requests on port 80. If the web server can fulfil the request it sends an HTTP response back to the browser indicating success:</p>
      <pre>
        <code>
          &lt;html&gt;
            &lt;head&gt;
              &lt;title&gt;www.Example.org – The World Wide Web&lt;/title&gt;
            &lt;/head&gt;
            &lt;body&gt;
              &lt;p&gt;The World Wide Web, abbreviated as WWW and commonly known ...&lt;/p&gt;
            &lt;/body&gt;
          &lt;/html&gt;
        </code>
      </pre>
      <h2>References</h2>
      <ol>
        <li><a href="">What is the difference between the Web and the Internet?</a>. World Wide Web Consortium. [<time>2016-04-18</time>].</li>
      </ol>
    </article>
  </body>
</html>
```
