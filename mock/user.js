function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req, res) => {
    const { password, username, type } = req.body;

    if (password === '111111' && username === 'admin') {
      res.send({
        status: true,
        code: 0,
        msg: '操作成功',
        body: {
          principal: {
            id: '904939186011455489',
            username: 'admin',
          },
          token: '2F1022077C70E78F68C2F082B175E16B',
          trees: [
            {
              id: '925242725850562562',
              text: '系统管理',
              state: 'open',
              checked: false,
              data: '',
              code: null,
              childSize: 0,
              attributes: {},
              children: [
                {
                  id: '907147580340400130',
                  text: '权限管理',
                  state: 'open',
                  checked: false,
                  data: '',
                  code: null,
                  childSize: 0,
                  attributes: {},
                  children: [
                    {
                      id: '907147733956784129',
                      text: '管理员信息',
                      state: 'open',
                      checked: false,
                      data: '/account/list',
                      code: null,
                      childSize: 0,
                      attributes: {},
                      children: [],
                      button: [
                        {
                          id: '907489035537760257',
                          text: '管理员添加',
                          state: 'open',
                          checked: false,
                          data: '/account/save',
                          code: 'system:admin:save',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907489398537994241',
                          text: '管理员编辑',
                          state: 'open',
                          checked: false,
                          data: '/account/edit',
                          code: 'system:admin:edit',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907489752172347394',
                          text: '管理员删除',
                          state: 'open',
                          checked: false,
                          data: '/account/del',
                          code: 'system:admin:del',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                      ],
                    },
                    {
                      id: '907149956623339522',
                      text: '权限资源管理',
                      state: 'open',
                      checked: false,
                      data: '/resource/list',
                      code: null,
                      childSize: 0,
                      attributes: {},
                      children: [],
                      button: [
                        {
                          id: '907496908728709122',
                          text: '资源添加',
                          state: 'open',
                          checked: false,
                          data: '/resource/save',
                          code: 'system:menu:save',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907497028484476930',
                          text: '资源编辑',
                          state: 'open',
                          checked: false,
                          data: '/resource/edit',
                          code: 'system:menu:edit',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907497185385000961',
                          text: '资源删除',
                          state: 'open',
                          checked: false,
                          data: '/resource/del',
                          code: 'system:menu:del',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                      ],
                    },
                    {
                      id: '907151439368523778',
                      text: '角色管理',
                      state: 'open',
                      checked: false,
                      data: '/role/list',
                      code: null,
                      childSize: 0,
                      attributes: {},
                      children: [],
                      button: [
                        {
                          id: '907496399192076290',
                          text: '角色添加',
                          state: 'open',
                          checked: false,
                          data: '/role/save',
                          code: 'system:role:save',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907496518587133953',
                          text: '角色删除',
                          state: 'open',
                          checked: false,
                          data: '/role/del',
                          code: 'system:role:del',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907496650070175745',
                          text: '角色编辑',
                          state: 'open',
                          checked: false,
                          data: '/role/edit',
                          code: 'system:role:edit',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                        {
                          id: '907500101256753154',
                          text: '分配权限',
                          state: 'open',
                          checked: false,
                          data: '/role/saveResource',
                          code: 'system:role:distribution',
                          childSize: 0,
                          attributes: {},
                          children: [],
                          button: [],
                        },
                      ],
                    },
                  ],
                  button: [],
                },
                {
                  id: '925282428591226882',
                  text: '系统监控',
                  state: 'open',
                  checked: false,
                  data: '',
                  code: null,
                  childSize: 0,
                  attributes: {},
                  children: [
                    {
                      id: '925282659378610178',
                      text: 'Druid监控',
                      state: 'open',
                      checked: false,
                      data: '/druid',
                      code: null,
                      childSize: 0,
                      attributes: {},
                      children: [],
                      button: [],
                    },
                    {
                      id: '945866486565437441',
                      text: '应用监控',
                      state: 'open',
                      checked: false,
                      data: 'status/list',
                      code: null,
                      childSize: 0,
                      attributes: {},
                      children: [],
                      button: [],
                    },
                  ],
                  button: [],
                },
                {
                  id: '945577731933773825',
                  text: '日志管理',
                  state: 'open',
                  checked: false,
                  data: 'log',
                  code: null,
                  childSize: 0,
                  attributes: {},
                  children: [],
                  button: [],
                },
              ],
              button: [],
            },
          ],
        },

        // currentAuthority: 'admin',
      });
      return;
    }

    if (password === '111111' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
