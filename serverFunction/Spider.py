import json
import re

import requests


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


# 调试时使用
if __name__ == '__main__':
    url_list = ['https://mp.weixin.qq.com/s/G11wlj1tVg8A-7o4NKR-aQ',
                'https://mp.weixin.qq.com/s/ySOaEEvCVM38wLmXGhHFQg',
                'https://mp.weixin.qq.com/s/D0btteJiKrDaVKpPbeTb4g',
                'https://mp.weixin.qq.com/s/E7VLtZLT7cUoP-hBNrJixQ',
                ]
    url = url_list[3]
    result = get_text_picture(url)
    result_json = json.dumps(result)
    for item in result:
        print(item)
