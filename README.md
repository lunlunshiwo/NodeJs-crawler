# NodeJs-crawler
## 使用说明
-------------
1.下载代码，npm install<br />
2.node index.js即可<br />
3.停止Cltr+c<br />
## 博文
好的，我们从爬虫流程开始分析我们需要的一些模块。<br />
首先，我们需要发送请求获得页面，在这里呢，我们用到了request-promise模块。<br />
<pre><code>
    const rp = require("request-promise"), //进入request-promise模块
      async getPage(URL) {
        const data = {
          url, <br />
          res: await rp(
             url: URL
          }) 
      }; 
      return data //这样，我们返回了一个对象，就是这个页面的url和页面内容。
    }
</code></pre>
其次，解析页面，我们使用一个叫做Cheerio的模块将上面返回的对象中的res解析成类似JQ的调用模式。Cheerio使用一个非常简单，一致的DOM模型。因此解析，操作和渲染非常高效。初步的端到端基准测试表明cheerio 比JSDOM快大约8倍。<br />
<pre><code>
    const cheerio = require("cheerio");//引入Cheerio模块
    const $ = cheerio.load(data.res); //将html转换为可操作的节点
</code></pre>
    
此时，我们要对我们即将进行爬取的页面进行分析。[www.mzitu.com/125685](www.mzitu.com/125685)，这是我们进行爬取的网址，F12查看DOM结构，根据这个结构我们可以使用$(".main-image").find("img")[0].attribs.src来爬取这张图片的地址（如果不知道为什么是attribs.src的话可以一步一步console.log()一下看看）。<br />
最后，到了最关键的时候，我们使用fs模块进行创建文件夹以及下载文件。这里用到了fs模块的几个指令：<br />
　　　　1.fs.mkdirSync(downloadPath)：查看是否存在这个文件夹。<br />
　　　　2.fs.mkdirSync(downloadPath)：创建文件夹。<br />
　　　　3.fs.createWriteStream(`${downloadPath}/${index}.jpg`):写入文件，这里需要注意的是fs.createWriteStream 似乎不会自己创建不存在的文件夹，所以在使用之前需要注意，保存文件的文件夹一定要提前创建。<br />
好的，大体的方法就是以上的几个模块和步骤。<br />
在这里，我针对这个网站的一些情况进行一下分析：<br />
        1.这个网站一个页面只有一张图片，但是每个页面的网址都是有根据的。[http://www.mzitu.com/125685](http://www.mzitu.com/125685)（当你输入[http://www.mzitu.com/125685/1](http://www.mzitu.com/125685/1)时也会跳转此页面），[http://www.mzitu.com/125685/2](http://www.mzitu.com/125685/2)等等。那么我们可以根据这个规律去爬取，并且我们需要在页面的下方的页码栏中获得这一组图图片的页码：<br />
        2.我们一般不会只爬取一组图片，但是这个网站的图片的标题也就是最后的六位数基本没有规律可言，那么我们只能从最开始的首页入手。具体方法不多做描述，与获取图片的URL方式相同。<br />
        3.同理，我们爬取完一页的目录之后会进行对第二个目录的爬取，[http://www.mzitu.com/page/2](http://www.mzitu.com/page/2/)，其原理和第一条相同。<br />
        4.但是，有的网站存在防盗链的情况，面对这种措施，我们需要伪造一个请求头来避开这个情况。这个可以从F12的Network中查到，看到这里的朋友我想也会明白。<br/>
<pre><code>
    let headers = {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          Host: "i.meizitu.net",
          Pragma: "no-cache",
          "Proxy-Connection": "keep-alive",
          Referer: data.url,//根据爬取的网址跟换
          "Upgrade-Insecure-Requests": 1,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
    };
</code></pre>

以上就是我的全部思路。
总结：
至于后续操作，比如存到分类保存到本地和MongoDB数据库这样的操作，我下次再写，请关注我。

郑重提升，爬虫虽好，一定不能触犯法律。

如果本本文触犯您的利益，请留言。

如果觉得本文不错，不要吝啬您的点赞和关注。谢谢。
