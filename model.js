const rp = require("request-promise"), //进入request-promise模块
  fs = require("fs"), //进入fs模块
  cheerio = require("cheerio"), //进入cheerio模块
  depositPath = "D:/blog/reptile/meizi/"; //存放照片的地址
let downloadPath; //下载图片的文件夹地址
module.exports = {
  async getPage(url) {
    const data = {
      url,
      res: await rp({
        url: url
      })
    };
    return data;
  },
  getUrl(data) {
    let list = [];
    const $ = cheerio.load(data.res); //将html转换为可操作的节点
    $("#pins li a")
      .children()
      .each(async (i, e) => {
        let obj = {
          name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字
          url: e.parent.attribs.href //图片网页的url
        };
        list.push(obj); //输出目录页查询出来的所有链接地址
      });
    return list;
  },
  getTitle(obj) {
    downloadPath = depositPath + obj.name;
    if (!fs.existsSync(downloadPath)) {//查看是否存在这个文件夹
      fs.mkdirSync(downloadPath);//不存在就建文件夹
      console.log(`${obj.name}文件夹创建成功`);
      return true;
    } else {
      console.log(`${obj.name}文件夹已经存在`);
      return false;
    }
  },
  getImagesNum(res, name) {
    if (res) {
      let $ = cheerio.load(res);
      let len = $(".pagenavi")
        .find("a")
        .find("span").length;
      if (len == 0) {
        fs.rmdirSync(`${depositPath}${name}`);//删除无法下载的文件夹
        return 0;
      }
      let pageIndex = $(".pagenavi")
        .find("a")
        .find("span")[len - 2].children[0].data;
      return pageIndex;//返回图片总数
    }
  },
  //下载相册照片
  async downloadImage(data, index) {
    if (data.res) {
      var $ = cheerio.load(data.res);
      if ($(".main-image").find("img")[0]) {
        let imgSrc = $(".main-image").find("img")[0].attribs.src;//图片地址
        let headers = {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          Host: "i.meizitu.net",
          Pragma: "no-cache",
          "Proxy-Connection": "keep-alive",
          Referer: data.url,
          "Upgrade-Insecure-Requests": 1,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
        };//反防盗链
        await rp({
          url: imgSrc,
          resolveWithFullResponse: true,
          headers
        }).pipe(fs.createWriteStream(`${downloadPath}/${index}.jpg`));//下载
        console.log(`${downloadPath}/${index}.jpg下载成功`);
      } else {
        console.log(`${downloadPath}/${index}.jpg加载失败`);
      }
    }
  }
};
//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                       / .' \\| |// `. \
//                      / \\|||  :  |||// \
//                     / _||||| -:- |||||- \
//                     | | | \\\ - /// | |  |
//                     | \_| ''\---/'' | |  |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
