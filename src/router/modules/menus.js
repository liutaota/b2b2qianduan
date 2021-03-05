/** When your routing table is too long, you can split it into small modules**/
/*
* Tips：name 是唯一值，用作权限操作
by css
*/
import Layout from '@/layout';
// 开发中
const UnderConstruction = () => import('@/views/error-page/UnderConstruction');
const menus = [{
  path: '/customer',
  name: 'customer',
  component: Layout,
  meta: {
    title: '客戶',
    icon: 'el-icon-user-solid',
    roles: ['admin'], // you can set roles in root nav
  },
  children: [{
    path: 'customerList',
    name: 'CustomerList',
    component: () => import('@/views/customer/customerList'),
    meta: { title: '客戶列表' },
    roleList: [{
      name: 'CustomerListLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'CustomerListReset',
      path: '',
      meta: { title: '重置密码' },
      hidden: true
    }, {
      name: 'CustomerListEdit',
      path: '',
      meta: { title: '修改账号' },
      hidden: true
    }, {
      name: 'CustomerListBill',
      path: '',
      meta: { title: '账单流水' },
      hidden: true
    }, {
      name: 'CustomerListResetAdd',
      path: '',
      meta: { title: '添加用户' },
      hidden: true
    }, {
      name: 'CustomerListRecords',
      path: '',
      meta: { title: '积分记录' },
      hidden: true
    }],
  },
  {
    path: 'customerInfo',
    name: 'CustomerInfo',
    component: () => import('@/views/customer/customerInfo'),
    hidden: true,
    meta: { title: '证件信息' },
  }, {
    path: 'authentication',
    name: 'Authentication',
    component: () => import('@/views/authentication/index'),
    meta: { title: '企业认证' },
  },
  {
    path: 'authenticationInfo',
    name: 'AuthenticationInfo',
    hidden: true,
    component: () => import('@/views/authentication/edit'),
    meta: { title: '企业认证审核' },
  },
  {
    path: 'licence',
    name: 'Licence',
    component: () => import('@/views/customer/licence/licence'),
    meta: { title: '证照管理' },
  },
  {
    path: 'integralRecord',
    name: 'IntegralRecord',
    component: () => import('@/views/customer/integralRecord/integralRecord'),
    meta: { title: '积分列表' },
    roleList: [{
      name: 'IntegralRecordLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'IntegralRecordReset',
      path: '',
      meta: { title: '积分变更' },
      hidden: true
    }]
  },
  {
    path: 'feedback',
    name: 'Feedback',
    component: () => import('@/views/customer/feedback/feedback'),
    meta: { title: '建议反馈' },
  },
  ],
},
{
  path: '/reportCenter',
  name: 'ReportCenter',
  component: Layout,
  meta: { title: '报表中心', icon: 'el-icon-tickets', roles: [] },
  children: [
    {
      name: 'financing',
      path: 'financing',
      component: () => import('@/views/subRouter'),
      redirect: 'bannedList',
      meta: { title: '财务', icon: '', roles: [] },
      hidden: true,
      children: [{
        path: 'finance',
        name: 'Finance',
        component: () => import('@/views/reportCenter/finance/finance'),
        meta: { title: '财务报表' },
        hidden: true
      }]
    },
    {
      name: 'market',
      path: 'market',
      component: () => import('@/views/subRouter'),
      redirect: 'bannedList',
      meta: { title: '销售', icon: '', roles: [] },
      children: [{
        path: 'salesReport',
        name: 'SalesReport',
        component: () => import('@/views/customer/salesMonthilyReport'),
        meta: { title: '销售报表' },
        roleList: [{
          name: 'CustomerListLook',
          path: '',
          meta: { title: '查看' },
          hidden: true
        }]
      },
      {
        path: 'monthlyStatement',
        name: 'MonthlyStatement',
        component: () => import('@/views/reportCenter/monthlyStatement/monthlyStatement'),
        meta: { title: '客户月报表' },
      },
      {
        path: 'goodsSalesReport',
        name: 'GoodsSalesReport',
        component: () => import('@/views/reportCenter/goodsSalesReport/goodsSalesReport'),
        meta: { title: '商品销售报告' },
        roleList: [{
          name: 'exportStatement',
          path: '',
          meta: { title: '导出' },
          // hidden: true
        }]
      },
      ]
    },
    {
      name: 'service',
      path: 'service',
      component: () => import('@/views/subRouter'),
      redirect: 'bannedList',
      meta: { title: '客服', icon: '', roles: [] },
      children: [{
        path: 'wantBook',
        name: 'WantBook',
        component: () => import('@/views/reportCenter/wantBook/wantBook'),
        meta: { title: '缺货登记' },
      },
      {
        path: 'integralCommodity',
        name: 'IntegralCommodity',
        component: () => import('@/views/reportCenter/integralCommodity/integralCommodity'),
        meta: { title: '积分商品' },
      },
      {
        path: 'shortCutReport',
        name: 'ShortCutReport',
        component: () => import('@/views/reportCenter/shortCutReport/shortCutReport'),
        meta: { title: '短减报表' },
      },
      ]
    },
  ]
},
{
  path: '/market',
  name: 'market',
  component: Layout,
  meta: { title: '销售', icon: 'el-icon-sold-out', roles: [] },
  children: [
    {
      path: 'goodsMarketingPlan',
      name: 'GoodsMarketingPlan',
      component: () => import('@/views/market/goodsMarketingPlan/goodsMarketingPlan'),
      meta: { title: '商品销售计划' },
      roleList: [{
        name: 'addGoodsPlan',
        path: '',
        meta: { title: '新增' },
        // hidden: true
      }, {
        name: 'updatePlanUseStatus',
        path: '',
        meta: { title: '确定' },
        // hidden: true
      }]
    }
  ]
},
{
  path: '/goods',
  name: 'goods',
  component: Layout,
  meta: { title: '货品', icon: 'el-icon-goods', roles: [] },
  children: [{
    name: 'Goods',
    path: 'goodsList',
    component: () => import('@/views/goods/goodsList'),
    meta: { title: '货品列表', icon: '', roles: [] },
    roleList: [{
      name: 'GoodsLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'GoodsEdit',
      path: '',
      meta: { title: '货品编辑' },
      hidden: true
    }, {
      name: 'GoodsExport',
      path: '',
      meta: { title: '导出Excel' },
      hidden: true
    }],
  },
  {
    name: 'GoodsIntegral',
    path: 'goodsIntegral',
    component: () => import('@/views/goods/goodsIntegral/goodsIntegral'),
    meta: { title: '积分货品', icon: '', roles: [] },
    roleList: [{
      name: 'GoodsIntegralLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'GoodsIntegralGoodsEdit',
      path: '',
      meta: { title: '货品编辑' },
      hidden: true
    }, {
      name: 'GoodsIntegralEdit',
      path: '',
      meta: { title: '积分编辑' },
      hidden: true
    }, {
      name: 'GoodsIntegralExport',
      path: '',
      meta: { title: '导出Excel' },
      hidden: true
    }, {
      name: 'GoodsIntegralIsputaway',
      path: '',
      meta: { title: '是否上架' },
      hidden: true
    }],
  },
  {
    name: 'LuckDrawGoods',
    path: 'luckDrawGoods',
    component: () => import('@/views/goods/luckDrawGoods/luckDrawGoods'),
    meta: { title: '抽奖商品', icon: '', roles: [] },
    roleList: [{
      name: 'luckDrawScreen',
      path: '',
      meta: { title: '查询' },
      hidden: true
    },
    {
      name: 'GoodsIntegralGoodsAdd',
      path: '',
      meta: { title: '新增抽奖商品' },
      hidden: true
    },
    {
      name: 'luckDrawOperation',
      path: '',
      meta: { title: '操作' },
      hidden: true
    },
    {
      name: 'luckDrawStatus',
      path: '',
      meta: { title: '是否抽奖' },
      hidden: true
    },
    //  {
    //   name: 'GoodsIntegralEdit',
    //   path: '',
    //   meta: { title: '积分编辑' },
    //   hidden: true
    // }, {
    //   name: 'GoodsIntegralExport',
    //   path: '',
    //   meta: { title: '导出Excel' },
    //   hidden: true
    // }
    ],
  },
  {
    name: 'GoodsClassification',
    path: 'goodsClassification',
    component: () => import('@/views/goods/goodsClassification/goodsClassification'),
    meta: { title: '货品分类', icon: '', roles: [] },
  },
  {
    name: 'goodsCompile',
    path: 'goodsCompile',
    component: () => import('@/views/goods/components/goodsCompile'),
    hidden: true,
    meta: { title: '编辑货品', icon: '', roles: [] },
  }, {
    name: 'banned',
    path: 'banned',
    component: () => import('@/views/subRouter'),
    redirect: 'bannedList',
    meta: { title: '禁销限销', icon: '', roles: [] },
    children: [{
      name: 'BannedList',
      path: 'bannedList',
      component: () => import('@/views/goods/banned/bannedList'),
      meta: { title: '禁销列表', icon: '', roles: [] },
      roleList: [{
        name: 'BannedListLook',
        path: '',
        meta: { title: '查看' },
        hidden: true
      }, {
        name: 'BannedListCustomer',
        path: '',
        meta: { title: '客户集合' },
        hidden: true
      }, {
        name: 'BannedListGoods',
        path: '',
        meta: { title: '货品集合' },
        hidden: true
      }],
    }, {
      name: 'BannedMemberList',
      path: 'bannedMemberList',
      component: () => import('@/views/goods/banned/components/bannedMemberList'),
      meta: { title: '客户集合', icon: '', roles: [] },
    },
    {
      name: 'BannedGoodsList',
      path: 'bannedGoodsList',
      component: () => import('@/views/goods/banned/components/bannedGoodsList'),
      meta: { title: '货品集合', icon: '', roles: [] },
    }]
  },
  {
    path: 'lackGoods',
    name: 'LackGoods',
    component: () => import('@/views/goods/lackGoods/lackGoods'),
    meta: { title: '缺货登记', icon: '', roles: [] },
    roleList: [{
      name: 'LackGoodsLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'LackGoodsExcel',
      path: '',
      meta: { title: '导出Excel' },
      hidden: true
    }],
  },
  {
    path: 'newProduct.vue',
    name: 'NewProduct.vue',
    component: () => import('@/views/goods/newProduct/newProduct'),
    meta: { title: '新品登记', icon: '', roles: [] },
  },
  {
    name: 'FactoryList',
    path: 'factoryList',
    component: () => import('@/views/goods/factory/factoryList'),
    meta: { title: '厂家列表', icon: '', roles: [] },
    roleList: [{
      name: 'FactoryListLook',
      path: '',
      meta: { title: '查看' },
      hidden: true
    }, {
      name: 'FactoryListTopping',
      path: '',
      meta: { title: '置顶' },
      hidden: true
    }, {
      name: 'FactoryListBottoming',
      path: '',
      meta: { title: '置底' },
      hidden: true
    }, {
      name: 'FactoryListTop',
      path: '',
      meta: { title: '上移' },
      hidden: true
    }, {
      name: 'FactoryListBottom',
      path: '',
      meta: { title: '下移' },
      hidden: true,
    }],
  },
  ]
},
{
  path: '/platform',
  name: 'platform',
  component: Layout,
  meta: { title: '平台设置', icon: 'el-icon-present', roles: [] },
  children: [
    {
      path: 'notice',
      name: 'Notice',
      component: () => import('@/views/platform/notice/notice'),
      meta: { title: '公告设置', icon: '', roles: [] },
      roleList: [{
        name: 'NoticeLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'NoticeAdd',
        path: '',
        meta: { title: '新增' },
        hidden: true,
      }, {
        name: 'NoticeEdit',
        path: '',
        meta: { title: '编辑' },
        hidden: true,
      }, {
        name: 'NoticeDel',
        path: '',
        meta: { title: '删除' },
        hidden: true,
      }, {
        name: 'NoticeTopping',
        path: '',
        meta: { title: '置顶/置底/上移/下移' },
        hidden: true,
      }],
    },
    {
      path: 'apList',
      name: 'apList',
      component: () => import('@/views/subRouter'),
      redirect: 'apList',
      meta: { title: '广告设置', icon: '', roles: [] },
      children: [
        {
          path: 'apList',
          name: 'ApList',
          component: () => import('@/views/platform/advertisement/advertisement'),
          meta: { title: '广告列表', icon: '', roles: [] },
          roleList: [{
            name: 'ApListLook',
            path: '',
            meta: { title: '查看' },
            hidden: true,
          }, {
            name: 'ApListAdd',
            path: '',
            meta: { title: '新增' },
            hidden: true
          }, {
            name: 'ApListEdit',
            path: '',
            meta: { title: '编辑' },
            hidden: true
          }, {
            name: 'ApListDel',
            path: '',
            meta: { title: '删除' },
            hidden: true
          }]
        },
        {
          path: 'TOP_BANNER',
          name: '顶部广告',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/singleChart'),
          meta: { title: '顶部广告', icon: '', roles: [] },
        },
        {
          path: 'CENTER_ONLY',
          name: '中部广告单图',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/singleChart'),
          meta: { title: '中部广告单图', icon: '', roles: [] },
        },
        {
          path: 'CENTER_MORE_LITTLE',
          name: '中部广告多图（小）',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/Multigraph'),
          meta: { title: '中部广告多图（小）', icon: '', roles: [] },
        },
        {
          path: 'CENTER_MORE_BIG',
          name: '中部广告多图（大）',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/Multigraph'),
          meta: { title: '中部广告多图（大）', icon: '', roles: [] },
        },
        {
          path: 'POPUP_BANNER',
          name: '弹窗广告',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/singleChart'),
          meta: { title: '弹窗广告', icon: '', roles: [] },
        },
        {
          path: 'CAROUSEL_BANNER',
          name: '轮播广告',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/Multigraph'),
          meta: { title: '轮播广告', icon: '', roles: [] },
        },
        {
          path: 'BROADSIDE_BANNER',
          name: '侧边广告',
          hidden: true,
          component: () => import('@/views/platform/advertisement/components/Multigraph'),
          meta: { title: '侧边广告', icon: '', roles: [] },
        }
      ]
    },
    {
      path: 'floor',
      name: 'floor',
      component: () => import('@/views/subRouter'),
      redirect: 'floor',
      meta: { title: '楼层设置', icon: '', roles: [] },
      children: [
        {
          path: 'floor',
          name: 'Floor',
          component: () => import('@/views/platform/floor/floor'),
          meta: { title: '楼层列表', icon: '', roles: [] },
          roleList: [{
            name: 'FloorLook',
            path: '',
            meta: { title: '查看' },
            hidden: true,
          }, {
            name: 'FloorAdd',
            path: '',
            meta: { title: '新增' },
            hidden: true,
          }, {
            name: 'FloorEdit',
            path: '',
            meta: { title: '编辑' },
            hidden: true,
          }, {
            name: 'FloorDel',
            path: '',
            meta: { title: '删除' },
            hidden: true,
          }, {
            name: 'FloorTopping',
            path: '',
            meta: { title: '置顶/置底/上移/下移' },
            hidden: true,
          }],
        },
        {
          path: 'ROLL_LINE',
          name: '单行样式',
          hidden: true,
          component: () => import('@/views/platform/floor/components/singleChart'),
          meta: { title: '单行样式', icon: '', roles: [] },
        },
        {
          path: 'SINGLE_LINE',
          name: '多行样式',
          hidden: true,
          component: () => import('@/views/platform/floor/components/MultiLine'),
          meta: { title: '多行样式', icon: '', roles: [] },
        },
        {
          path: 'MULTI_LINE',
          name: '标签样式',
          hidden: true,
          component: () => import('@/views/platform/floor/components/double'),
          meta: { title: '标签样式', icon: '', roles: [] },
        },
        {
          path: 'BG_IMAGE',
          name: '背景样式',
          hidden: true,
          component: () => import('@/views/platform/floor/components/BgImage'),
          meta: { title: '背景样式', icon: '', roles: [] },
        },
      ]
    },
    {
      path: 'helpGuide',
      name: 'HelpGuide',
      component: () => import('@/views/platform/helpGuide/helpGuide'),
      meta: { title: '帮助指南设置', icon: '', roles: [] },
      roleList: [
        {
          name: 'HelpGuideList',
          path: '',
          meta: { title: '帮助指南' },
          hidden: true,
          roleList: [{
            name: 'HelpGuideAdd',
            path: '',
            meta: { title: '新增指南' },
            hidden: true
          }, {
            name: 'HelpGuideEdit',
            path: '',
            meta: { title: '编辑' },
          }, {
            name: 'HelpGuideDel',
            path: '',
            meta: { title: '删除' },
          }, {
            name: 'HelpGuideTopping',
            path: '',
            meta: { title: '置顶/置底/上移/下移' },
          }]
        },
        {
          name: 'HelpGuideType',
          path: '',
          meta: { title: '帮助类型' },
          hidden: true,
          roleList: [{
            name: 'HelpGuideLook',
            path: '',
            meta: { title: '查看' },
          }, {
            name: 'HelpGuideTypeEdit',
            path: '',
            meta: { title: '编辑' },
          }, {
            name: 'HelpGuideTypeDel',
            path: '',
            meta: { title: '删除' },
          }, {
            name: 'HelpGuideTypeAdd',
            path: '',
            meta: { title: '新增指南类型' },
          }, {
            name: 'HelpGuideTypeTopping',
            path: '',
            meta: { title: '置顶/置底/上移/下移' },
          }]
        }
      ],
    },
    {
      path: 'pageSetup',
      name: 'pageSetup',
      component: () => import('@/views/subRouter'),
      redirect: 'pageSetup',
      meta: { title: '页面设置', icon: '', roles: [] },
      children: [
        {
          path: 'pageSetup',
          name: 'PageSetup',
          component: () => import('@/views/platform/pageSetup/index'),
          meta: { title: '页面列表', icon: '', roles: [] },
          roleList: [
            {
              name: 'PageSetupWeb',
              path: '',
              meta: { title: '页面设置' },
              hidden: true,
              roleList: [{
                name: 'PageSetupWebLook',
                path: '',
                meta: { title: '查看' },
                hidden: true,
              }, {
                name: 'PageSetupWebAdd',
                path: '',
                meta: { title: '新增页面' },
                hidden: true,
              }, {
                name: 'PageSetupWebTopping',
                path: '',
                meta: { title: '置顶/置底/上移/下移' },
                hidden: true,
              }],
            },
            {
              name: 'PageSetupMenus',
              path: '',
              meta: { title: '菜单设置' },
              hidden: true,
              roleList: [{
                name: 'PageSetupMenusAdd',
                path: '',
                meta: { title: '新增' },
                hidden: true,
              }, {
                name: 'PageSetupMenusTopping',
                path: '',
                meta: { title: '置顶/置底/上移/下移' },
                hidden: true,
              }],
            }
          ]
        },
        {
          path: 'page',
          name: '页面编辑',
          hidden: true,
          component: () => import('@/views/platform/pageSetup/components/page/page'),
          meta: { title: '页面编辑', icon: '', roles: [] },
        },
      ]
    },
    {
      path: 'giveRise',
      name: 'GiveRise',
      component: () => import('@/views/platform/giveRise/giveRise'),
      meta: { title: '地区起送金额', icon: '', roles: [] },
      roleList: [{
        name: 'GiveRiseLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'GiveRiseAdd',
        path: '',
        meta: { title: '新增' },
        hidden: true,
      }]
    },
    {
      path: 'parameter',
      name: 'Parameter',
      component: () => import('@/views/platform/parameter/parameter'),
      meta: { title: '参数设置', icon: '', roles: [] },
      roleList: [{
        name: 'ParameterListSet',
        path: '',
        meta: { title: '商城设置' },
        hidden: true,
      }, {
        name: 'ParameterList',
        path: '',
        meta: { title: '系统参数' },
        hidden: true,
        children: [{
          name: 'ParameterListAdd',
          path: '',
          meta: { title: '新增数据' },
        },
        {
          name: 'ParameterListScreen',
          path: '',
          meta: { title: '查询' },
        }]
      }]
    },
    {
      path: 'activityStrategy',
      name: 'ActivityStrategy',
      component: () => import('@/views/platform/activityStrategy/activity'),
      meta: { title: '活动策略', icon: '', roles: [] },

    },
    {
      path: 'pdaParameterSetting',
      name: 'PdaParameterSetting',
      component: () => import('@/views/platform/pdaParameterSetting/pdaParameterSetting'),
      meta: { title: 'pad版本更新', icon: '', roles: [] },
    },
    {
      path: 'marketing',
      name: 'Marketing',
      component: () => import('@/views/platform/Marketing/marketing'),
      meta: { title: '优惠卷', icon: '', roles: [] },
      roleList: [{
        name: 'MarketingLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'MarketingAdd',
        path: '',
        meta: { title: '新增' },
        hidden: true,
      }, {
        name: 'MarketingEdit',
        path: '',
        meta: { title: '编辑' },
        hidden: true,
      }, {
        name: 'MarketingDel',
        path: '',
        meta: { title: '删除' },
        hidden: true,
      }, {
        name: 'MarketingCustomerSend',
        path: '',
        meta: { title: '客户赠送' },
        hidden: true,
      }, {
        name: 'MarketingSend',
        path: '',
        meta: { title: '集合赠送' },
        hidden: true,
      }]
    },
    {
      path: 'userCoupon',
      name: 'UserCoupon',
      component: () => import('@/views/platform/userCoupon/userCoupon'),
      meta: { title: '用户优惠卷', icon: '', roles: [] },
      roleList: [{
        name: 'UserCouponLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'UserCouponDel',
        path: '',
        meta: { title: '删除' },
        hidden: true,
      }]
    }
  ]
},
{
  path: '/order',
  name: 'Order',
  component: Layout,
  meta: { title: '订单', icon: 'el-icon-s-order', roles: [] },
  children: [
    {
      path: 'orderList',
      name: 'OrderList',
      component: () => import('@/views/order/orderList'),
      meta: { title: '订单列表', icon: '', roles: [] },
      roleList: [{
        name: 'OrderListLook',
        path: '',
        meta: { title: '筛选' },
        hidden: true,
      }, {
        name: 'OrderListDetails',
        path: '',
        meta: { title: '订单详情' },
        hidden: true,
      }, {
        name: 'OrderListRepair',
        path: '',
        meta: { title: '补货单' },
        hidden: true,
      }, {
        name: 'OrderListPay',
        path: '',
        meta: { title: '代客下单' },
        hidden: true,
      }, {
        name: 'OrderListBank',
        path: '',
        meta: { title: '恢复订单' },
        hidden: true,
      }, {
        name: 'OrderListDel',
        path: '',
        meta: { title: '删除订单' },
        hidden: true,
      }, {
        name: 'OrderListRecepte',
        path: '',
        meta: { title: '订单拦截' },
        hidden: true,
      }, {
        name: 'OrderListWriteOff',
        path: '',
        meta: { title: '核销' },
        hidden: true,
      }, {
        name: 'OrderWholeOrder',
        path: '',
        meta: { title: '整单不出' },
        hidden: true,
      }, {
        name: 'OrderStatus',
        path: '',
        meta: { title: '状态变更' },
        hidden: true,
      }, {
        name: 'OrderIssue',
        path: '',
        meta: { title: '重新下发' },
        hidden: true,
      }, {
        name: 'OrderSee',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'OrderExcel',
        path: '',
        meta: { title: 'Excel导出' },
        hidden: true,
      }],
    },
    {
      path: 'placeOrder',
      name: 'PlaceOrder',
      component: () => import('@/views/order/placeOrder/placeOrder'),
      meta: { title: '代客下单', icon: '', roles: [] },
      roleList: [{
        name: 'PlaceOrderLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'PlaceOrderUsed',
        path: '',
        meta: { title: '选用' },
        hidden: true,
      }]
    },
    {
      path: 'details',
      name: 'Details',
      component: () => import('@/views/order/components/orderDetails'),
      hidden: true,
      meta: { title: '订单详情', icon: '', roles: [] },
    },
    {
      name: 'ExchangePoints',
      path: 'exchangePoints',
      component: () => import('@/views/goods/exchangePoints/exchangePoints'),
      meta: { title: '积分兑换', icon: '', roles: [] },
      roleList: [],
    },
    {
      path: 'abnormal',
      name: 'Abnormal',
      component: () => import('@/views/order/abnormal/orderException'),
      meta: { title: '异常订单', icon: '', roles: [] },
      roleList: [{
        name: 'AbnormalOrderSee',
        path: '',
        meta: { title: '查看' },
      }, {
        name: 'AbnormalReplay',
        path: '',
        meta: { title: '重新下发' },
      }, {
        name: 'AbnormalConfirmException',
        path: '',
        meta: { title: '重新下发' },
      },{
        name: 'AbnormalScreen',
        path: '',
        meta: { title: '筛选' },
      },{
        name: 'AbnormalStats',
        path: '',
        meta: { title: '状态' },
      },{
        name: 'AbnormalOrder',
        path: '',
        meta: { title: '整单不出' },
        hidden: true,
      }]
    },
    {
      path: 'returnAdmin',
      name: 'ReturnAdmin',
      component: () => import('@/views/order/returnsAdmin/returnAdmin'),
      meta: { title: '退货管理', icon: '', roles: [] },
      roleList: [{
        name: 'ReturnAdminList',
        path: '',
        meta: { title: '退货订单' },
        hidden: true,
        roleList: [{
          name: 'ReturnAdminLook',
          path: '',
          meta: { title: '查看' },
        }, {
          name: 'ReturnAdminCheck',
          path: '',
          meta: { title: '审核' },
        }, {
          name: 'ReturnAdminUpdate',
          path: '',
          meta: { title: '状态更新' },
        }, {
          name: 'ReturnAdminReplay',
          path: '',
          meta: { title: '重新下发' },
        }, {
          name: 'ReturnAdminDetails',
          path: '',
          meta: { title: '详情' },
        }, {
          name: 'ReturnAdminSureReceive',
          path: '',
          meta: { title: '确认收货' },
        }]
      }, {
        name: 'ReturnAdmReason',
        path: '',
        meta: { title: '退货原因' },
        hidden: true,
        roleList: [{
          name: 'ReturnAdmReasonLook',
          path: '',
          meta: { title: '查看' },
        }, {
          name: 'ReturnAdmReasonAdd',
          path: '',
          meta: { title: '新增' },
        }, {
          name: 'ReturnAdmReasonEdit',
          path: '',
          meta: { title: '编辑' },
        }, {
          name: 'ReturnAdmReasonDel',
          path: '',
          meta: { title: '删除' },
        }]
      }]
    },
    {
      path: 'deliverListAdmin',
      name: 'DeliverListAdmin',
      component: () => import('@/views/deliverList/deliverList'),
      meta: { title: '送货列表', icon: '', roles: [] },
      roleList: [
        {
          name: 'DeliverListAdminReciverDetails',
          path: '',
          meta: { title: '查看收款详情' },
        },
        {
          name: 'DeliverListAdminExcel',
          path: '',
          meta: { title: 'Excel导出' },
        }
      ]
    },
    {
      path: 'deliverListAdminDetails',
      name: 'DeliverListAdminDetails',
      hidden: true,
      component: () => import('@/views/deliverList/components/orderDetails'),
      meta: { title: '收款详情', icon: '', roles: [] },
    },
  ]
},
{
  path: '/storage',
  name: 'Storage',
  component: Layout,
  meta: { title: '仓储', icon: 'el-icon-box', roles: [] },
  children: [
    // {
    //   path: 'storageScreen',
    //   name: 'StorageScreen',
    //   component: () => import('@/views/storage/storage'),
    //   meta: { title: '仓储电子大屏', icon: '', roles: [] },
    // },
    {
      path: 'inteceptOrder',
      name: 'InteceptOrder',
      component: () => import('@/views/storage/inteceptOrder/inteceptOrder'),
      meta: { title: '手工拦单订单', icon: '', roles: [] },
      roleList: [{
        name: 'InteceptOrderAdd',
        path: '',
        meta: { title: '新增' },
        hidden: true,
      }, {
        name: 'InteceptOrderSure',
        path: '',
        meta: { title: '确定拦截' },
        hidden: true,
      }, {
        name: 'InteceptOrderCancel',
        path: '',
        meta: { title: '取消拦截' },
        hidden: true,
      }]
    },
    {
      path: '/货品上架',
      name: 'GoodsUpdate',
      component: UnderConstruction,
      hidden: true,
      meta: { title: '货品上架', icon: '', roles: [] },
    },
    {
      path: '/intecept',
      name: 'Intecept',
      component: () => import('@/views/intecept/inteceptList'),
      meta: { title: '订单拦截列表', icon: '', roles: [] },
      roleList: [{
        name: 'InteceptLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'InteceptDetails',
        path: '',
        meta: { title: '订单详情' },
        hidden: true,
      }, {
        name: 'InteceptSure',
        path: '',
        meta: { title: '确定拦截' },
        hidden: true,
      }, {
        name: 'InteceptCancel',
        path: '',
        meta: { title: '取消拦截' },
        hidden: true,
      }]
    },
  ]
},
{
  path: '/finance',
  name: 'Finance',
  component: Layout,
  meta: { title: '财务', icon: 'el-icon-coin', roles: [] },
  children: [
    {
      path: 'payRecords',
      name: 'PayRecords',
      component: () => import('@/views/payRecords/payRecords'),
      meta: { title: '支付流水', icon: '', roles: [] },
    },
    {
      path: 'reportTotal',
      name: 'ReportTotal',
      component: () => import('@/views/finance/reportTotal/reportTotal'),
      meta: { title: '财务报表总计', icon: '', roles: [] },
      roleList:[
        {
          name: 'ReportTotalExcel',
          path: '',
          meta: { title: '导出' },
          hidden: true,
        },
        {
          name: 'ReportTotalScreen',
          path: '',
          meta: { title: '查找' },
          hidden: true,
        },
        {
          name: 'ReportTotalOrderSee',
          path: '',
          meta: { title: '查看订单' },
          hidden: true,
        },
      ]
    },
    {
      path: 'bottomTable',
      name: 'BottomTable',
      component: () => import('@/views/finance/financeBottomTable/financeBottomTable'),
      meta: { title: '财务报表底表', icon: '', roles: [] },
      roleList:[
        {
          name: 'bottomTableExcel',
          path: '',
          meta: { title: '导出' },
          hidden: true,
        },
        {
          name: 'bottomTableScreen',
          path: '',
          meta: { title: '查找' },
          hidden: true,
        },
        {
          name: 'bottomTableOrderSee',
          path: '',
          meta: { title: '查看订单' },
          hidden: true,
        },
      ]
    },
    {
      path: 'financeList',
      name: 'FinanceList',
      component: () => import('@/views/finance/finance'),
      meta: { title: '对账管理', icon: '', roles: [] },
      roleList: [
        {
          name: 'FinanceListRepeatRefundCheck',
          path: '',
          meta: { title: '重复核销' },
          hidden: true,
        },
        {
          name: 'FinanceListOrderDetails',
          path: '',
          meta: { title: '订单详情' },
          hidden: true,
        },
        {
          name: 'FinanceListAPPExcel',
          path: '',
          meta: { title: '导出' },
          hidden: true,
        },
        {
          name: 'FinanceListUpdateRepeatRefund',
          path: '',
          meta: { title: '修改核销状态' },
          hidden: true,
        },
        {
          name: 'FinanceListRecive',
          path: '',
          meta: { title: '收款单' },
          hidden: true,
          roleList: [{
            name: 'FinanceListReciveCheck',
            path: '',
            meta: { title: '核销' },
          },
          {
            name: 'FinanceListOrderSee',
            path: '',
            meta: { title: '订单查看' },
          },
          {
            name: 'FinanceListReciveLook',
            path: '',
            meta: { title: '查看' },
          }
          ]
        }, {
          name: 'FinanceListRefund',
          path: '',
          meta: { title: '退款单' },
          hidden: true,
          roleList: [{
            name: 'FinanceListRefundCheck',
            path: '',
            meta: { title: '核销' },
          },
          {
            name: 'FinanceListRefundAmount',
            path: '',
            meta: { title: '退款' },
          },
          {
            name: 'FinanceListOrderSee',
            path: '',
            meta: { title: '订单查看' },
          },
          {
            name: 'FinanceListRefundLook',
            path: '',
            meta: { title: '查看' },
          },
          {
            name: 'FinanceListAPPUpdateRefund',
            path: '',
            meta: { title: '修改退款状态' },
          },
          ]
        },
        {
          name: 'FinanceListAPP',
          path: '',
          meta: { title: 'APP对账管理' },
          hidden: true,
          roleList: [{
            name: 'FinanceListAPPWriteOff',
            path: '',
            meta: { title: '核销' },
          },
          {
            name: 'FinanceListAPPRefund',
            path: '',
            meta: { title: '退款' },
          },
          {
            name: 'FinanceListAPPOrderSee',
            path: '',
            meta: { title: '查看' },
          },
          {
            name: 'FinanceListAPPCollection',
            path: '',
            meta: { title: '确认收款' },
          },
          {
            name: 'FinanceListAPPDelOrder',
            path: '',
            meta: { title: '删除' },
          },

          ]
        }]
    },
    {
      path: 'billList',
      name: 'BillList',
      component: () => import('@/views/billList/billList'),
      meta: { title: '月账单管理', icon: '', roles: [] },
      roleList: [{
        name: 'BillListLook',
        path: '',
        meta: { title: '查看' },
        hidden: true,
      }, {
        name: 'BillListDetails',
        path: '',
        meta: { title: '查看详情' },
        hidden: true,
      }, {
        name: 'BillListPay',
        path: '',
        meta: { title: '去还款' },
        hidden: true,
      }]
    }
  ]
},
{
  path: '/accountNumber',
  name: 'AccountNumber',
  component: Layout,
  meta: { title: '设定', icon: 'el-icon-setting', roles: [] },
  children: [
    {
      path: 'accountNumberList',
      name: 'AccountNumberList',
      component: () => import('@/views/setUp/accountNumber/accountNumber'),
      meta: { title: '账户管理', icon: '', roles: [] },
      children: [{
        name: 'AccountNumberUser',
        path: 'AccountNumberUser',
        meta: { title: '账号管理' },
        hidden: true,
        children: [{
          name: 'AccountNumberUserAdd',
          path: '',
          meta: { title: '新增' },
        }, {
          name: 'AccountNumberUserEdit',
          path: '',
          meta: { title: '编辑' },
        }, {
          name: 'AccountNumberUserReset',
          path: '',
          meta: { title: '重置密码' },
        }]
      }, {
        name: 'AccountNumberRole',
        path: 'AccountNumberRole',
        meta: { title: '角色管理' },
        hidden: true,
        children: [{
          name: 'AccountNumberRoleAdd',
          path: '',
          meta: { title: '新增' },
        }, {
          name: 'AccountNumberRoleEdit',
          path: '',
          meta: { title: '编辑' },
        }]
      }]
    }
  ]
},
{
  path: '/systmeLog',
  name: 'SystmeLog',
  component: Layout,
  meta: { title: '系统日志', icon: 'el-icon-document', roles: [] },
  children: [
    {
      path: 'adminLog',
      name: 'AdminLog',
      component: () => import('@/views/systemLog/components/adminLog'),
      meta: { title: '用户操作日志', icon: '', roles: [] },
    },
    {
      path: 'orderLog',
      name: 'OrderLog',
      component: () => import('@/views/systemLog/components/orderLog'),
      meta: { title: '订单日志', icon: '', roles: [] },
    },
    {
      path: 'couponLog',
      name: 'CouponLog',
      component: () => import('@/views/systemLog/components/couponLog'),
      meta: { title: '优惠券日志', icon: '', roles: [] },
    },
    {
      path: 'memberLog',
      name: 'MemberLog',
      component: () => import('@/views/systemLog/components/memberLog'),
      meta: { title: '客户日志', icon: '', roles: [] },
    },
  ]
},
{
  path: '/appCheckout',
  name: 'appCheckout',
  component: Layout,
  hidden: true,
  meta: { title: 'app菜单权限', icon: 'el-icon-setting', roles: [] },
  children: [
    {
      path: 'abnormalList',
      name: 'abnormalList',
      meta: { title: '异常订单', icon: '', roles: [] },
      children: [{
        name: 'abnormalListLook',
        path: 'abnormalListLook',
        meta: { title: '查看订单' },
        hidden: true,
      }, {
        name: 'abnormalListSend',
        path: 'abnormalListSend',
        meta: { title: '重新下发' },
        hidden: true,
      }, {
        name: 'abnormalListMake',
        path: 'abnormalListMake',
        meta: { title: '处理异常' },
        hidden: true,
      }]
    }, {
      path: 'appOrderList',
      name: 'appOrderList',
      meta: { title: '全部订单', icon: '', roles: [] },
      children: [{
        name: 'appOrderListLook',
        path: 'appOrderListLook',
        meta: { title: '查看订单' },
        hidden: true,
      }, {
        name: 'appOrderListReject',
        path: 'appOrderListReject',
        meta: { title: '拒收' },
        hidden: true,
      }, {
        name: 'appOrderListReceive',
        path: 'appOrderListReceive',
        meta: { title: '去收款' },
        hidden: true,
      }]
    }, {
      path: 'appCustomerList',
      name: 'appCustomerList',
      meta: { title: '客户列表', icon: '', roles: [] },
      children: [{
        name: 'appCustomerListLook',
        path: 'appCustomerListLook',
        meta: { title: '查看订单' },
        hidden: true,
      }, {
        name: 'appCustomerListAll',
        path: 'appCustomerListAll',
        meta: { title: '历史账单' },
        hidden: true,
      }, {
        name: 'appCustomerListPay',
        path: 'appCustomerListPay',
        meta: { title: '去还款' },
        hidden: true,
      }, {
        name: 'appCustomerOrderList',
        path: 'appCustomerOrderList',
        meta: { title: '查看订单' },
        hidden: true,
      }]
    }, {
      path: 'appInterceptList',
      name: 'appInterceptList',
      meta: { title: '待拦截列表', icon: '', roles: [] },
      children: [{
        name: 'appInterceptListLook',
        path: 'appInterceptListLook',
        meta: { title: '查看订单' },
        hidden: true,
      }, {
        name: 'appInterceptListSuccess',
        path: 'appInterceptListSuccess',
        meta: { title: '拦截成功' },
        hidden: true,
      }, {
        name: 'appInterceptListFail',
        path: 'appInterceptListFail',
        meta: { title: '拦截失败' },
        hidden: true,
      }]
    }, {
      path: 'appCancelList',
      name: 'appCancelList',
      meta: { title: '已取消订单', icon: '', roles: [] },
      children: [{
        name: 'appCancelListLook',
        path: 'appCancelListLook',
        meta: { title: '查看订单' },
        hidden: true,
      }]
    }, {
      path: 'appOrderDetails',
      name: 'appOrderDetails',
      meta: { title: '订单详情', icon: '', roles: [] },
      children: [{
        name: 'appOrderDetailsRefresh',
        path: 'appOrderDetailsRefresh',
        meta: { title: '刷新' },
        hidden: true,
      }, {
        name: 'appOrderDetailsReject',
        path: 'appOrderDetailsReject',
        meta: { title: '拒收' },
        hidden: true,
      }, {
        name: 'appOrderDetailsReceive',
        path: 'appOrderDetailsReceive',
        meta: { title: '收款码' },
        hidden: true,
      }, {
        name: 'appOrderDetailsSure',
        path: 'appOrderDetailsSure',
        meta: { title: '确认送货' },
        hidden: true,
      }, {
        name: 'appOrderInvoice',
        path: 'appOrderInvoice',
        meta: { title: '查看发票' },
        hidden: true,
      }]
    }, {
      path: 'appReturnList',
      name: 'appReturnList',
      meta: { title: '退货列表', icon: '', roles: [] },
      children: [{
        name: 'appReturnListDetails',
        path: 'appReturnListDetails',
        meta: { title: '退货详情' },
        hidden: true,
      }, {
        name: 'appReturnListSure',
        path: 'appReturnListSure',
        meta: { title: '确认收货' },
        hidden: true,
      }, {
        name: 'appReturnListRefresh',
        path: 'appReturnListRefresh',
        meta: { title: '状态更新' },
        hidden: true,
      }, {
        name: 'appReturnListCheck',
        path: 'appReturnListCheck',
        meta: { title: '审核' },
        hidden: true,
      }]
    }, {
      path: 'appBillList',
      name: 'appBillList',
      meta: { title: '月账单列表', icon: '', roles: [] },
      children: [{
        name: 'appBillListPay',
        path: 'appBillListPay',
        meta: { title: '去还款' },
        hidden: true,
      }]
    }, {
      path: 'appBillDetails',
      name: 'appBillDetails',
      meta: { title: '月账单详情', icon: '', roles: [] },
      children: [{
        name: 'appBillDetailsPay',
        path: 'appBillDetailsPay',
        meta: { title: '去还款' },
        hidden: true,
      }]
    }, {
      path: 'appBillWater',
      name: 'appBillWater',
      meta: { title: '账单流水', icon: '', roles: [] },
      children: [{
        name: 'appBillWaterCreate',
        path: 'appBillWaterCreate',
        meta: { title: '生成账单' },
        hidden: true,
      },
      ]
    }, {
      path: 'deliveryList',
      name: 'deliveryList',
      meta: { title: '送货列表', icon: '', roles: [] },
      children: [{
        name: 'deliveryERPOrder',
        path: 'deliveryERPOrder',
        meta: { title: 'ERP待收货' },
        hidden: true,
      }, {
        name: 'deliveryOrderList',
        path: 'deliveryOrderList',
        meta: { title: '查看订单' },
        hidden: true,
      }]
    }, {
      path: 'collectionOrder',
      name: 'collectionOrder',
      meta: { title: '收款确认列表', icon: '', roles: [] },
      children: [
        {
          name: 'collectionConfirmReceipt',
          path: 'collectionConfirmReceipt',
          meta: { title: '确认收款' },
          hidden: true,
        }, {
          name: 'collectionScreen',
          path: 'collectionScreen',
          meta: { title: '筛选' },
          hidden: true,
        }, {
          name: 'deliveryCustomerReceipt',
          path: 'deliveryCustomerReceipt',
          meta: { title: '客户收款单' },
          hidden: true,
        }, {
          name: 'deliveryDelOrder',
          path: 'deliveryDelOrder',
          meta: { title: '撤销订单' },
          hidden: true,
        }]
    },
  ]
},
  // {
  //   path: '/previewImg',
  //   name: 'previewImg',
  //   component: () => import('@/views/platform/floor/components/previewImg'),
  //   // meta: { title: '楼层预览', icon: '', roles: [] },
  // },
  // {
  //   path: '/warehouse',
  //   name: 'warehouse',
  //   component: () => import('@/views/warehouse/warehouse'),
  //   meta: { title: '楼层预览', icon: '', roles: [] },
  // },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('@/views/warehouse/test'),
  //   meta: { title: '楼层预览', icon: '', roles: [] },
  // }
];

export default menus;
