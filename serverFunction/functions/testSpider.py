import json
import re

import requests


def testSpider(request_params):
    print("进入爬虫测试")

    def get_text_picture(url):
        page = requests.get(url).text
        pattern_p = re.compile(r'(<p.*?>.+?</p>)|(<img.+?>)')  # 用于提取p标签和img标签
        pattern_img = re.compile(r'<img.*?src="(http.+?)".*?>')  # 用于提取p标签中的img标签
        pattern_scr = re.compile(r'src="(http.+?)"')  # 用于提取img标签中的src
        result_0 = pattern_p.findall(page)
        result_1 = []
        for item in result_0:
            # p标签
            if not item[0] == '':
                # p标签里面的img
                img = pattern_img.findall(item[0])
                if not len(img) == 0:
                    result_1.append(img[0])
                # 保留p标签中的文字部分
                new_item = re.sub(r'<.+?>', "", item[0])
                if not '' == new_item:
                    result_1.append(new_item)
            # p标签外面的img标签
            if not item[1] == '':
                img = pattern_img.findall(item[1])
                if not len(img) == 0:
                    result_1.append(img[0])
        return result_1;

    url = request_params['url']
    result = get_text_picture(url)

    response_body = json.dumps(result)

    return response_body
