export const setCookie = (key, value, time = 1) => {
  var exp = new Date();
  exp.setTime(exp.getTime() + time * 60 * 1000);
  document.cookie = key + '=' + escape(value) + ';path=/' + ';expires=' + exp.toGMTString();
};

export const getCookie = key => {
  var cookieArr = document.cookie.split('; ');
  for (var i = 0; i < cookieArr.length; i++) {
    var arr = cookieArr[i].split('=');
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return false;
};
export const removeCookie = key => {
  setCookie(key, '', -24);
};
