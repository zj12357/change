import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { uploadUrl, imagesUrl } from '@/utils/config.js';
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//拼接 get请求参数
export const serializeObject = obj => {
  let str = '';
  if (typeof obj !== 'object' && !Array.isArray(obj)) {
    return '';
  }
  Object.entries(obj).forEach(([key, value], index, arr) => {
    if (index === arr.length - 1) {
      str += `${key}=${value}`;
    } else {
      str += `${key}=${value}&`;
    }
  });
  return str;
};

//给多维数组增加一个属性  默认false
export const addAttribute = (arr, twoDime = 'children', addKeys = 'checkedKeys') => {
  let arrays = arr.map(item => {
    if (Array.isArray(item[twoDime]) && item[twoDime].length > 0) {
      addAttribute(item[twoDime]);
    }
    item[addKeys] = false;
    return item;
  });
  return arrays;
};

//多维数组和  一维数组比较  id是否相同  相同 则给checkedKeys ：true
export const manyArrCompare = (
  manArr,
  oneArr,
  manyKeys = 'id',
  twoDime = 'children',
  addKeys = 'checkedKeys',
) => {
  function compareArr(arrs, ids) {
    let status = false;
    if (Array.isArray(arrs) && arrs.length > 0) {
      arrs.forEach(items => {
        if (items[manyKeys] == ids) {
          status = true;
        }
      });
    }
    return status;
  }

  let arrays = manArr.map(item => {
    if (Array.isArray(item[twoDime]) && item[twoDime].length > 0) {
      manyArrCompare(item.children, oneArr);
    }
    item[addKeys] = compareArr(oneArr, item[manyKeys]);
    return item;
  });
  return arrays;
};

//图片地址添加
export const filterImages = imgPath => {
  if (imgPath) {
    if (imgPath.slice(0, 4) != 'http') imgPath = imagesUrl + imgPath;
    return imgPath;
  }
  return imgPath;
};

// 获取登录人信息
export const getUserInfo = () => {
  let userInfo = localStorage.getItem('userInfo');
  let data = {};
  try {
    data = JSON.parse(userInfo);
  } catch (error) {
    data = {};
    console.error(error);
  }
  return data || {};
};

//处理权限树结构
export const splicingTree = arr => {
  if (!Array.isArray(arr)) return arr;

  return arr.map(item => {
    // item.name = item.text;
    item.path = item.menuUrl;
    item.children = item.subSysNavigationList;

    // console.log(item,'children')
    if (
      item.subSysNavigationList &&
      Array.isArray(item.subSysNavigationList) &&
      item.subSysNavigationList.length > 0
    ) {
      if (!item.icon) {
        item.icon = 'unordered-list';
      }

      splicingTree(item.subSysNavigationList);
    }
    //  console.log('item', item)
    return item;
  });
};

//处理展览树
export const exhibitionTree = arr => {
  if (!Array.isArray(arr)) return arr;

  return arr.map(item => {
    item.title = item.text;
    item.key = item.id;

    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      exhibitionTree(item.children);
    }

    return item;
  });
};

//减少重复提交
export const throttle = (handler, wait) => {
  var lastTime = 0;

  return function() {
    var nowTime = new Date().getTime();

    if (nowTime - lastTime > wait) {
      handler.apply(this, arguments);
      lastTime = nowTime;
    }
  };
};

//生成随机ID
export const genID = (length = 10) => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

//扁平化多维数组
export const flatArrs = (arr, key = 'children') => {
  if (!Array.isArray(arr)) return arr;

  let res = [];

  arr.forEach(item => {
    if (Array.isArray(item[key])) {
      res = res.concat(flatArrs(item[key]));
    }
    res.push(item);
  });

  return res;
};

//对比元素列表  返回 boolean 是否显示元素按钮
export const filtEleBtn = (eleArr = [], menuText = '用户管理', btnIcon = '新增') => {
  // return true
  // console.log(eleArr,menuText,btnIcon)
  if (Array.isArray(eleArr) && eleArr.length <= 0) return false;
  const lgh = eleArr.length;
  for (let i = 0; i < lgh; i++) {
    if (eleArr[i].name === menuText && eleArr[i].buttonList.includes(btnIcon)) {
      return true;
    }
  }
  return false;
};

//从 字典按钮 数组 取 对应图标
export const takeIcon = (dictionaryList, code) => {
  if (Array.isArray(dictionaryList) && dictionaryList.length <= 0) return false;
  const lgh = dictionaryList.length;
  for (let i = 0; i < lgh; i++) {
    if (code && dictionaryList[i].code === code) {
      return dictionaryList[i].iconPath || false;
    }
  }
};

export const isString = str => {
  return Object.prototype.toString.call(str) === '[object String]';
};

// 字符串转数组
export const stringTurnArr = (str, convertType) => {
  if (!str || typeof str !== 'string') {
    // console.error('str不是字符串', str);
    return [];
  }
  let arrs = str.split(',');
  if (Object.prototype.toString.call(arrs) === '[object Array]') {
    if (convertType === 'Number') {
      arrs = arrs.map(item => Number(item));
    }
    return arrs;
  }
  return [];
};

//将数字转换成金额显示
export const toMoney = num => {
  if (num) {
    if (isNaN(num)) {
      alert('金额中含有不能识别的字符');
      return;
    }
    num = typeof num == 'string' ? parseFloat(num) : num; //判断是否是字符串如果是字符串转成数字
    num = num.toFixed(2); //保留两位
    num = parseFloat(num); //转成数字
    num = num.toLocaleString(); //转成金额显示模式
    //判断是否有小数
    if (num.indexOf('.') == -1) {
      num = num + '.00';
    } else {
      num = num.split('.')[1].length < 2 ? num + '0' : num;
    }
    return num; //返回的是字符串23,245.12保留2位小数
  } else {
    return (num = 0);
  }
};

//小数转百分比
export const toPercent = point => {
  if (!point) {
    return '0.00%';
  }
  let str = Number(point * 100).toFixed(2);
  str += '%';
  return str;
};

//转百分比不要小数
export const toPercentInt = point => {
  if (!point) {
    return '0%';
  }
  let str = parseInt(point * 100);
  str += '%';
  return str;
};
