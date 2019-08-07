export function getRankList(callback) {
  const retry = () => setTimeout(() => getRankList(callback), 3000);
  wx.request({
    url: "https://www.awesomes.cn/rank?sort=trend",
    header: {
      "accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
      "content-type": "text/html; charset=utf-8"
    },
    success: ({ data }) => {
      // console.log(data);
      try {
        const list = data.match(
          /<div class="list-item">([\s\S]*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/g
        );
        if (!list || !list.length) {
          return retry();
        }
        // console.log(list);
        callback(
          list.reduce((array, item) => {
            const [all, icon, name, detail] = item.match(
              /<img src="([\s\S]*?)"[\s\S]*?<h4>([\s\S]*?)<\/h4>[\s\S]*?<span class="sdesc">([\s\S]*?)<\/span>/
            );
            // console.log(icon, name, detail)
            // https://img.awesomes.cn/thumbs/told/151011135942-0-1.jpg vue 一个用以创建用户接口的直观、快速、简洁的 MVVM 框架
            return [...array, {
              icon,
              name,
              detail
            }];
          }, [])
        );
      } catch (e) {
        retry();
      }
    },
    fail: retry
  });
}