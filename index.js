const model = require("./model"),
  basicPath = "http://www.mzitu.com/page/";
let start = 1,
  end = 10;
const main = async url => {
  let list = [],
    index = 0;
  const data = await model.getPage(url);
  list = model.getUrl(data);
  downLoadImages(list, index);//下载
};
const downLoadImages = async (list, index) => {
  if (index == list.length) {
    start++;
    if (start < end) {
      main(basicPath + start);//进行下一页图片组的爬取。
    }
    return false;
  }
  if (model.getTitle(list[index])) {
    let item = await model.getPage(list[index].url),//获取图片所在网页的url
      imageNum = model.getImagesNum(item.res,list[index].name);//获取这组图片的数量
    for (var i = 1; i <= imageNum; i++) {
      let page = await model.getPage(list[index].url + `/${i}`);//遍历获取这组图片每一张所在的网页
      await model.downloadImage(page, i);//下载
    }
    index++;
    downLoadImages(list, index);//循环完成下载下一组
  } else {
    index++;
    downLoadImages(list, index);//下载下一组
  }
};
main(basicPath + start);
