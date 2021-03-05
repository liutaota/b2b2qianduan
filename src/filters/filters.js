
const filters = {};

const statusGlobalData = {
  // 客户类型
  customerType: [
    {
      value: 'MIDDLEMAN',
      desc: '中间商'
    },
    {
      value: 'TERMINAL',
      desc: '终端客户'
    }
  ],
  // 客户状态
  customerStatus: [
    {
      value: 'PROTECT',
      desc: '保护客户'
    },
    {
      value: 'INTENTION',
      desc: '意向客户'
    },
    {
      value: 'SEND',
      desc: '寄样客户'
    },
    {
      value: 'HIGH_SEAS',
      desc: '公海客户'
    },
    {
      value: 'PENDING',
      desc: '待审核'
    },
    {
      value: 'FAIL',
      desc: '无效客户'
    }
  ],
  // 角色
  role: [
    {
      value: 'superAdmin',
      desc: '超级管理员'
    },
    {
      value: 'zhuguangAdmin',
      desc: '主管'
    },
    {
      value: 'tuanduiAdmin',
      desc: '团队主管'
    },
    {
      value: 'yewuyuanAdmin',
      desc: '业务员'
    }
  ],
  // 用户状态
  memberStatus: [
    {
      value: 'STAFF',
      desc: '在职'
    },
    {
      value: 'DIMISSION',
      desc: '离职'
    },
    {
      value: 'PROBATION',
      desc: '试用期'
    }
  ],
  // 订单类型
  orderType: [
    {
      value: 'ORDER_SEND',
      desc: '寄样订单'
    },
    {
      value: 'ORDER_GOODS',
      desc: '订货订单'
    }
  ]
};

// 客户类型过滤
filters.customerTypeFilter = value => statusGlobalData.customerType.filter(item => item.value === value)[0].desc;

// 客户状态过滤
filters.customerStatusFilter = value => statusGlobalData.customerStatus.filter(item => item.value === value)[0].desc;

// 角色过滤
filters.roleFilter = value => statusGlobalData.role.filter(item => true || item.value === value)[0].desc;

// 员工在职状态过滤
filters.memberStatusFilter = value => statusGlobalData.memberStatus.filter(item => item.value === value)[0].desc;

// 订单类型过滤
filters.orderTypeFilter = value => statusGlobalData.orderType.filter(item => item.value === value)[0].desc;

export { filters, statusGlobalData };
