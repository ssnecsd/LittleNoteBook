import json
import re

import requests

file_number=0
def get_text_picture(url):
    page = requests.get(url).text
    pattern_p = re.compile(r'(<p.*?>.+?</p>)|(<img.+?>)')  # 用于提取p标签和img标签
    pattern_img = re.compile(r'<img.*?src="(http.+?)".*?>')  # 用于提取p标签中的img标签
    pattern_fs=re.compile(r'(.+?[。！？!?])')
    pattern_scr = re.compile(r'src="(http.+?)"')  # 用于提取img标签中的src
    result_0 = pattern_p.findall(page)
    result_1 = []
    for item in result_0:
        # p标签
        if not item[0] == '':
            # p标签里面的img
            img = pattern_img.findall(item[0])
            if not len(img) == 0:
                result_1.append([0,img[0]])
            # 保留p标签中的文字部分
            new_item = re.sub(r'<.+?>', "", item[0])
            # 替换&nbsp
            new_item=new_item.replace('&nbsp','')
            # 用正则分开
            new_item_list=pattern_fs.findall(new_item)
            # 防止丢失最后一个没有符号的句子
            ex_list=re.split('。|！|？|!|\?',new_item)
            if len(new_item_list)<len(ex_list):
                if not ex_list[-1]== '':
                    new_item_list.append(ex_list[-1])
            # 在同一个p标签中，首句加缩进，末句加换行
            if not '' == new_item:
                total_length = 0
                if len(new_item_list)>0:
                    for _item in new_item_list:
                        total_length+=len(_item)
                if len(new_item_list)>0:
                    new_item_list[0]='  '+new_item_list[0]
                    new_item_list[-1]=new_item_list[-1]+'\n'
                else:
                    new_item='  '+new_item
                    result_1.append([1,new_item])


            for new_item in new_item_list:
                if not '' == new_item:
                    result_1.append([1,new_item])
        # p标签外面的img标签
        if not item[1] == '':
            img = pattern_img.findall(item[1])
            if not len(img) == 0:
                result_1.append([0,img[0]])
    with open('测试用的list文件'+str(file_number)+'.txt','w',encoding='utf-8')as f:
        for it in result_1:
            f.write(str(result_1))
    return result_1;

def get_title(url):
    page = requests.get(url).text
    pattern_t = re.compile(r'<h2.*?>((.*?\n*?)*?)</h2>')
    res = pattern_t.findall(page)
    result = []
    for item in res:
        result+=item
    return ''.join(result).strip()

def get_profile_nickname(url):
    page = requests.get(url).text
    pattern_n = re.compile(r'<.*?profile_nickname.*?>(.+?)<.*?>')
    res = pattern_n.findall(page)
    try:
        return res[0]
    except:
        return ''

def Spider(url):
    title=get_title(url)
    profile_nickname=get_profile_nickname(url)
    content=get_text_picture(url)
    image_url=''
    for item in content:
        item=item[1]
        try:
            hea=item[0:8]
        except:
            pass
        if 'https://'==hea:
            image_url=item
            break
    article_dic={
        'title':title,
        'profile_nickname':profile_nickname,
        'content':content,
        'image_url':image_url
    }
    return article_dic
# 调试时使用
if __name__ == '__main__':
    url_list = ['https://mp.weixin.qq.com/s/G11wlj1tVg8A-7o4NKR-aQ',
                'https://mp.weixin.qq.com/s/ySOaEEvCVM38wLmXGhHFQg',
                'https://mp.weixin.qq.com/s/D0btteJiKrDaVKpPbeTb4g',
                'https://mp.weixin.qq.com/s/E7VLtZLT7cUoP-hBNrJixQ',
                'https://mp.weixin.qq.com/s/HEg1ZuXB7rKTOQ6i0AMKKw',
                'https://mp.weixin.qq.com/s/82Y5a3ZwplKg4eIZvgAsEw',
                'https://mp.weixin.qq.com/s/HbiFXEh1hDc-6YT7OR4pGg',
                'https://mp.weixin.qq.com/s/D8-NRU_eny6LUJ_uBd_Mhg',
                'https://mp.weixin.qq.com/s/50iHOLGfl1RZEnUkzR-Cdg',
                'https://mp.weixin.qq.com/s/ZdQ6Rhp6hUCX-6DqYgbGwg',
                'https://mp.weixin.qq.com/s/uqwBanYt7KJ2C-1y8qhFkA',
                'https://mp.weixin.qq.com/s/US6y3y1560zJD9IYmQOEqg',
                'https://mp.weixin.qq.com/s/0f_r-5Jg153Euty_QbPKnQ',
                'https://mp.weixin.qq.com/s/76tF-6eVKfPUuQqRNv8kMw',
                'https://mp.weixin.qq.com/s/Up8aTdW32REPE5cEDiOsYg',
                'https://mp.weixin.qq.com/s/doL2ZtUOoHi5cgz_9Ev1Iw',
                'https://mp.weixin.qq.com/s/ZAQQuPVKOAMwQvKf25o1Jw',
                'https://wqs.jd.com/event/promote/51jiadian2019/index.shtml?ptag=17005.41.1779&scene=0&xtrack=1',
                'https://mp.weixin.qq.com/s/ayf3sIWMEZMyOyV7vZ6aTQ',
                'https://mp.weixin.qq.com/s/piWPWRdwhcNTNSn7eWjL1w',
                'https://mp.weixin.qq.com/s/NheUtlB_MDqiHyMTg-Rbzg',
                'https://mp.weixin.qq.com/s/n-yblL67MjaL2SqwLicbTg',
                ]
    for i in range(len(url_list)):
        file_number=i
        url = url_list[i]
        result = get_text_picture(url)
        result_json = json.dumps(result)
        # for item in result:
        #     print(item)
        print(str(i)+get_title(url))
        #print(Spider(url))
