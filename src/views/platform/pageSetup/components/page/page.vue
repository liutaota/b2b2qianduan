<template>
  <div style="margin: 10px">
    <div class="pageTop">
      <el-form ref="form" :model="visibleSet[0]" label-width="80px">
        <!-- 页面名称 -->
        <el-form-item label="页面名称" prop="title">
          <el-input v-model.trim="title" style="width:300px" />
        </el-form-item>
        <!-- 客户集合 -->
        <el-form-item label="客户集合" prop="memberSetList">
          <div class="aggregate">
            <!-- <el-checkbox v-model.trim="form">全选</el-checkbox> -->
            <el-select v-model.trim="visibleSet[0].type" placeholder="请选择" @change="getMemberList">
              <el-option label="全部可见" value="ALL_VISIBLE" />
              <el-option label="部分可见" value="PARTIALLY_VISIBLE" />
              <el-option label="部分不可见" value="UN_VISIBLE" />
            </el-select>
            <p class="goodsList" style="padding-left:10px;font-size:12px">
              <span
                v-for="(item, indexs) of visibleSet[0].memberSetList"
                :key="item.memberSetId"
              >{{ item.memberSetName }} {{ indexs === visibleSet[0].memberSetList.length - 1 ? '':'，' }}</span>
            </p>
            <el-link
              :type="visibleSet[0].type === 'ALL_VISIBLE'?'info':'primary'"
              :disabled="visibleSet[0].type === 'ALL_VISIBLE'?true:false"
              style="margin-right:10px"
              @click="customerCollection"
            >选择客户集合</el-link>
          </div>
        </el-form-item>
        <!-- 商品集合 -->
        <el-form-item label="商品集合" prop="memberSetList">
          <div class="aggregate">
            <!-- <el-checkbox v-model.trim="form">全选</el-checkbox> -->
            <!-- <el-select v-model.trim="visibleSet[0].type" placeholder="请选择" @change="getMemberList">
              <el-option label="全部可见" value="ALL_VISIBLE" />
              <el-option label="部分可见" value="PARTIALLY_VISIBLE" />
              <el-option label="部分不可见" value="PARTIALLY_IN_VISIBLE" />
            </el-select> -->
            <p class="goodsList" style="padding-left:10px;font-size:12px">
              <span
                v-for="(item, indexs) of goodsSetList"
                :key="item.goodsSetId"
              >{{ item.goodsSetName }} {{ indexs === goodsSetList.length - 1 ? '':'，' }}</span>
            </p>
            <el-link
              type="primary"
              style="margin-right:10px"
              @click="goodsCollection"
            >选择商品集合</el-link>
          </div>
        </el-form-item>
        <!-- 提示图标 -->
        <el-form-item label="提示图标" prop="title">
          <el-radio-group v-model.trim="hintIcon" size="medium">
            <el-radio-button label="NOT_HAVE">无</el-radio-button>
            <el-radio-button label="NEW">新上市</el-radio-button>
            <el-radio-button label="HOT">热门</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="remark" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 分类设置 -->
    <div class="classification-wrap">
      <p style="font-size:14px;font-weight: 900;color:#606266;display: inline-block;">分类设置</p>
      <span style="margin-left:20px">
        <el-checkbox v-model.trim="classifyAll" @change="classifysAll">全选（选择所有分类）</el-checkbox>
      </span>
      <el-table
        v-loading="loading"
        :data="classifySetList"
        stripe
        border
        fit
        style="width: 100%;margin-top:10px;font-size:12px"
        :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.accessList"
              stripe
              border
              fit
              style="width: 100%;font-size:12px"
              highlight-current-row
              :show-header="false"
              :show-overflow-tooltip="true"
            >
              <el-table-column label="序号" type="index" width="50" />
              <!-- 一级分类 -->
              <el-table-column label="一级分类" width="205" />
              <el-table-column label="二级分类" width="205">
                <template slot-scope="scopes">
                  <el-input v-model.trim="scopes.row.accessName" />
                </template>
              </el-table-column>
              <!-- 类型选择 -->
              <el-table-column prop="accessList" label="类型选择" width="200">
                <template slot-scope="scopes">
                  <el-select
                    v-model.trim="scopes.row.type"
                    placeholder="请选择"
                    @change="classifysSwitch(scope.$index, scopes.$index)"
                  >
                    <el-option label="选分类" value="CLASS" />
                    <el-option label="选商品" value="GOODS" />
                  </el-select>
                </template>
              </el-table-column>
              <!-- 类别选择 -->
              <el-table-column prop="accessList" label="类型选择">
                <template slot-scope="scopes">
                  <div style="display: flex">
                    <p v-show="scopes.row.goodsList" class="goodsList">
                      <span
                        v-for="(item, indexs) of scopes.row.goodsList"
                        :key="item.goodsId"
                      >{{ item.goodsName }} {{ indexs === scopes.row.goodsList.length - 1 ? '':'，' }}</span>
                    </p>
                    <p v-if="scopes.row.classifyList" style="width: 100%;">
                      <el-cascader
                        ref="cascaderAddr"
                        v-model.trim="scopes.row.classifyList[0].classifyId"
                        style="margin-right:10px;width:100%"
                        :options="options"
                        :props="{ label: 'classname', value: 'classnRow', children: 'subGoodsClassList', multiple: true, }"
                        collapse-tags
                      />
                    </p>
                    <div>
                      <el-button
                        v-show="scopes.row.type === 'GOODS'"
                        size="mini"
                        type="primary"
                        style="margin:12px 5px 0"
                        @click="goodsAdd(scope.$index, scopes.$index)"
                      >选择</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column label="操作" width="280" fixed="right">
                <template slot-scope="scopes">
                  <div class="operationIcon">
                    <!-- 前进一位 -->
                    <span
                      class="el-icon-caret-top"
                      style="font-weight: 900;cursor: pointer;font-size:16px"
                      @click="riseClassify(scopes.$index, scope.row.accessList)"
                    />
                    <!-- 后退一位 -->
                    <span
                      class="el-icon-caret-bottom"
                      style="font-weight: 900;cursor: pointer;font-size:16px"
                      @click="dropClassify(scopes.$index, scope.row.accessList)"
                    />
                    <el-button
                      class="el-icon-delete"
                      type="danger"
                      style="cursor: pointer;"
                      @click="secondLevelDel(scope.$index, scopes.$index)"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column label="序号" type="index" width="50" />
        <!-- 一级分类 -->
        <el-table-column
          prop="stairClassify"
          label="一级分类"
          width="205"
          @click="dialogFormVisible = true"
        >
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.stairClassify" />
          </template>
        </el-table-column>
        <!-- 二级分类 -->
        <el-table-column label="二级分类" width="205">
          <!-- <template slot-scope="scope">
            <el-input v-model.trim="scope.row.accessList[0].accessName" />
          </template>-->
        </el-table-column>
        <!-- 类型选择 -->
        <el-table-column label="类型选择" width="200">
          <!-- <template slot-scope="scope">
            <el-select v-model.trim="scope.row.accessList[0].type" placeholder="请选择" @change="classifysSwitch(scope.$index)">
              <el-option label="选分类" value="CLASS" />
              <el-option label="选商品" value="GOODS" />
            </el-select>
          </template>-->
        </el-table-column>
        <!-- 类别选择 -->
        <el-table-column label="类型选择">
          <!-- <template slot-scope="scope">
            <div style="display: flex">
              <p v-show="scope.row.accessList[0].goodsList" class="goodsList">
                <span v-for="(item, indexs) of scope.row.accessList[0].goodsList" :key="item.goodsId">{{ item.goodsName }} {{ indexs === scope.row.accessList[0].goodsList.length - 1 ? '':'，' }}</span>
              </p>
              <p v-if="scope.row.accessList[0].classifyList" style="width: 100%;">
                <el-cascader
                  ref="cascaderAddr"
                  v-model.trim="scope.row.accessList[0].classifyList[0].classifyId"
                  style="margin-right:10px;width:100%"
                  :options="options"
                  :props="{ label: 'classname', value: 'classnRow', children: 'subGoodsClassList', multiple: true, }"
                  collapse-tags
                />
              </p>
              <div>
                <el-button
                  v-show="scope.row.accessList[0].type === 'GOODS'"
                  size="mini"
                  type="primary"
                  style="margin:12px 5px 0"
                  @click="goodsAdd(scope.$index)"
                >选择</el-button>
              </div>
            </div>
          </template>-->
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <div class="operationIcon">
              <!-- 前进一位 -->
              <span
                class="el-icon-caret-top"
                style="font-weight: 900;cursor: pointer;font-size:16px"
                @click="riseClassify(scope.$index, classifySetList)"
              />
              <!-- 后退一位 -->
              <span
                class="el-icon-caret-bottom"
                style="font-weight: 900;cursor: pointer;font-size:16px"
                @click="dropClassify(scope.$index, classifySetList)"
              />
              <el-button
                type="primary"
                class="el-icon-circle-plus-outline"
                style="cursor: pointer;"
                @click="secondLevelAdd(scope.$index, scope.row)"
              >添加子分类</el-button>
              <el-button
                type="danger"
                class="el-icon-delete"
                style="cursor: pointer;"
                @click="classifyDel(scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加分类表格 -->
      <el-button
        size="mini"
        type="primary"
        style="margin: 10px 0"
        class="el-icon-circle-plus-outline"
        @click="classifySetAdd"
      >添加</el-button>
    </div>

    <!-- 页面设置 -->
    <div class="pageSetup-wrap">
      <p style="font-size:14px;font-weight: 900;color:#606266;display: inline-block;">页面设置</p>
      <el-table
        v-loading="loading"
        :data="pageSetList"
        stripe
        border
        fit
        style="width: 100%;margin-top:10px;font-size:12px"
        :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <el-table-column label="序号" type="index" />
        <el-table-column prop="accessList" label="类型选择">
          <template slot-scope="scope">
            <el-select
              v-model.trim="scope.row.type"
              placeholder="请选择"
              @change="pageSwitch(scope.$index)"
            >
              <el-option label="广告位" value="ADV" />
              <el-option label="楼层位" value="FLOOR" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="accessList" label="元素名称">
          <template slot-scope="scope">
            <div style="display: flex">
              <p class="goodsList">
                <span>{{ scope.row.advTitle }}</span>
                <span>{{ scope.row.floorTitle }}</span>
              </p>
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  style="margin:12px 5px 0"
                  @click="pageEleAdd(scope.$index)"
                >选择</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operationIcon">
              <!-- 前进一位 -->
              <span
                class="el-icon-caret-top"
                style="font-weight: 900;cursor: pointer;font-size:16px"
                @click="riseClassify(scope.$index, pageSetList)"
              />
              <!-- 后退一位 -->
              <span
                class="el-icon-caret-bottom"
                style="font-weight: 900;cursor: pointer;font-size:16px"
                @click="dropClassify(scope.$index, pageSetList)"
              />
              <el-button
                type="danger"
                class="el-icon-delete"
                @click="pageSetDel(scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加页面设置 -->
      <el-button
        size="mini"
        type="primary"
        style="margin: 10px 0"
        class="el-icon-circle-plus-outline"
        @click="pageSetAdd"
      >添加</el-button>
    </div>
    <div class="choice_btn" style="text-align: center;">
      <el-button type="primary" @click="handleEditAdd">确定</el-button>
      <el-button
        @click="$router.push({ path: 'pageSetup' });$store.dispatch('addPage', {page:[]})"
      >取消</el-button>
    </div>
    <!-- 客户集合 -->
    <Transfer
      v-if="memberMask"
      :dialog-form-visible="memberMask"
      :goods-list="memberList"
      :aggregate="aggregate"
      @onSubmit="memberSubmit"
      @cancel="cancel"
    />
    <!-- 货品集合 -->
    <Transfer
      v-if="goodsSetMask"
      :dialog-form-visible="goodsSetMask"
      :goods-list="goodList"
      :aggregate="aggregate"
      @onSubmit="goodsSubmit"
      @cancel="cancel"
    />
    <!-- 分类弹窗 -->
    <Transfer
      v-if="popupMask"
      :dialog-form-visible="popupMask"
      :goods-list="goodsList"
      :aggregate="aggregate"
      @onSubmit="onSubmit"
      @cancel="cancel"
    />
    <!-- 添加一级分类 -->
    <classifyPopup
      :dialog-form-visible="dialogFormVisible"
      :stair-classify-list="stairClassifyList"
      @classify="classify"
      @cancel="cancel"
    />
    <!-- 楼层弹窗 -->
    <floorPopup
      :dialog-form-visible="floorMask"
      :page-set-list="pageSetList[pageindex]"
      @onSubmit="floorSubmit"
      @cancel="cancel"
    />
    <!-- 广告弹窗 -->
    <advPopup
      :dialog-form-visible="advMask"
      :page-set-list="pageSetList[pageindex]"
      @onSubmit="advSubmit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Transfer from './Transfer';
import classifyPopup from './classifyPopup';
import floorPopup from './floorPopup';
import advPopup from './advPopup';
export default {
  components: {
    Transfer,
    classifyPopup,
    floorPopup,
    advPopup,
  },
  data() {
    return {
      hintIcon: 'NOT_HAVE',
      loading: false,
      dialogFormVisible: false,
      popupMask: false,
      floorMask: false,
      advMask: false,
      index: null,
      accessIndex: null,
      pageindex: null,
      classifyAll: false,
      goodsSetMask: false,
      // goodsSetList: [],
      title: '',
      remark: '',
      stairClassifyList: [],
      visibleSet: [
        {
          // 可见集合
          memberSetList: [],
        },
      ],
      // 分类设置
      classifySetList: [],
      // 页面设置
      pageSetList: [],
      // 选中商品列表
      goodsList: [],
      // 分类
      classifyList: [],
      // 客户与商品
      aggregate: {},
      goodsSetList: [],
      goodList: [],
      memberMask: false,
      // 选中客户集合
      memberList: [],
      rules: {
        title: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
        memberSetList: [
          { required: true, message: '请选择集合', trigger: 'blur' },
        ],
      },
      options: [],
      apList: [], // 广告
    };
  },
  async created() {
    this.goodsClassification();
    this.apList = await this.getAdvList();
    this.floorList = await this.getFloorList();
    const { id } = this.$route.query;
    if (id) {
      this.getPage(id);
      this.id = parseInt(id);
    }
  },
  methods: {
    getAdvList() {
      return new Promise((reslove, rejcet) => {
        this.$http.get('advPosition/isNotPageAdvPositionList').then(res => {
          res.map((item) => {
          // 判断类型
            switch (item.apDisplay) {
              case 'TOP_BANNER':
                item.ap_display = '顶部广告位';
                break;
              case 'CAROUSEL_BANNER':
                item.ap_display = '轮播广告位';
                break;
              case 'CENTER_ONLY':
                item.ap_display = '中部单图';
                break;
              case 'CENTER_MORE_LITTLE':
                item.ap_display = '中部多图小';
                break;
              case 'CENTER_MORE_BIG':
                item.ap_display = '中部多图大';
                break;
              case 'BROADSIDE_BANNER':
                item.ap_display = '侧边广告';
                break;
              case 'POPUP_BANNER':
                item.ap_display = '弹窗广告';
                break;
              default:
                break;
            }
            return item;
          });
          reslove(res);
        }).catch(err => {
          rejcet(err);
        });
      });
    },
    getPage(id) {
      this.$http.get('webPage/getWebPageById', { params: { id }}).then(res => {
        // 赋值
        this.classifySetList = res.classifySetList || [];
        this.visibleSet = res.visibleSet;
        this.title = res.title;
        this.hintIcon = res.hintIcon || 'NOT_HAVE';
        this.remark = res.remark;
        this.goodsSetList = res.goodsSetList || [];
        this.pageSetList = res.pageSetList.map((item, index) => {
          this.apList.forEach((data) => {
            if (item.type === 'ADV' && item.advId === data.id) {
              item.advTitle = data.advName;
              return;
            }
          });
          this.floorList.forEach(data => {
            if (item.type === 'FLOOR' && item.floorId === data.id) {
              item.floorTitle = data.title;
              return;
            }
          });
          return item;
        });
      });
    },
    getFloorList() {
      return new Promise((reslove, rejcet) => {
        this.$http.get('advPosition/isNotPageFloorList').then(res => {
          res.map(item => {
          // 判断类型
            switch (item.type) {
              case 'SINGLE_LINE':
                item.typeName = '单行样式';
                break;
              case 'MULTI_LINE':
                item.typeName = '多行样式';
                break;
              case 'BG_IMAGE':
                item.typeName = '背景样式';
                break;
              case 'SUGGEST_GOODS':
                item.typeName = '商品推荐样式';
                break;
              default:
                break;
            }
            return item;
          });
          reslove(res);
        }).catch(err => {
          rejcet(err);
        });
      });
    },
    // 分类请求
    goodsClassification() {
      this.$http.get('goods/getAdminGoodsClassTypeVoList').then((res) => {
        this.options = res;
      });
    },
    // 客户集合全部可见清空
    getMemberList() {
      if (this.visibleSet[0].type === 'ALL_VISIBLE') {
        this.visibleSet[0].memberSetList = [];
      }
    },
    // 打开客户集合
    customerCollection: _throttle(function () {
      this.memberList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.visibleSet[0].memberSetList.forEach((item) => {
        const { memberSetId: customsetid, memberSetName: customsetname } = item;
        this.memberList.push({ customsetid, customsetname });
      });
      this.aggregate = {
        path: 'member/getAdminMemberList',
        listKey: {
          key: 'customsetid',
          label: 'customsetname',
        },
      };
      this.memberMask = true;
    }),
    // 确认客户集合
    memberSubmit: _throttle(function (e) {
      const memberList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { customsetid: memberSetId, customsetname: memberSetName } = item;
        memberList.push({ memberSetId, memberSetName });
      });
      this.visibleSet[0].memberSetList = memberList;
      this.cancel();
    }),
    goodsCollection() {
      this.goodList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.goodsSetList.forEach((item) => {
        const { goodsSetId: goodssetid, goodsSetName: goodssetname } = item;
        this.goodList.push({ goodssetid, goodssetname });
      });
      this.aggregate = {
        path: 'goods/getAdminGoodsList',
        listKey: {
          key: 'goodssetid',
          label: 'goodssetname',
        },
      };
      this.goodsSetMask = true;
    },
    goodsSubmit(e) {
      const memberList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { goodssetid: goodsSetId, goodssetname: goodsSetName } = item;
        memberList.push({ goodsSetId, goodsSetName });
      });
      this.goodsSetList = memberList;
      this.cancel();
    },
    // 分类添加
    classifySetAdd: _throttle(function () {
      const list = {
        // 一级分类名称
        stairClassify: '',
        // 二级分类集合
        accessList: [
          {
            // stairClassify
            accessName: '',
            // 分类选择/商品选择
            type: '',
          },
        ],
      };
      this.classifySetList.push(list);
    }),
    // 二级分类添加
    secondLevelAdd(index, row) {
      const accessList = {
        accessName: '',
        type: '',
      };
      this.classifySetList[index].accessList.push(accessList);
    },
    // 分类删除
    classifyDel: _throttle(function (index) {
      this.$confirm('确认删除？')
        .then((_) => {
          this.classifySetList.splice(index, 1);
        })
        .catch((_) => {
          return;
        });
    }),
    secondLevelDel(parentIndex, subIndex) {
      this.$confirm('确认删除二级分类？')
        .then((_) => {
          this.classifySetList[parentIndex].accessList.splice(subIndex, 1);
        })
        .catch((_) => {
          return;
        });
    },
    // 升序
    riseClassify(index, el) {
      if (index === 0) return;
      const arrList = el[index];
      this.$set(el, index, el[index - 1]);
      this.$set(el, index - 1, arrList);
    },
    // 降序
    dropClassify(index, el) {
      if (index === el.length - 1) return;
      const arrList = el[index];
      this.$set(el, index, el[index + 1]);
      this.$set(el, index + 1, arrList);
    },
    // 添加页面设置
    pageSetAdd: _throttle(function () {
      const list = {
        type: '',
        // 页面元素
        floorId: '',
        // 元素名称
        floorTitle: '',
      };
      this.pageSetList.push(list);
    }, 300),
    // 页面设置删除
    pageSetDel: _throttle(function (index) {
      this.$confirm('确认删除？')
        .then((_) => {
          this.pageSetList.splice(index, 1);
        })
        .catch((_) => {
          return;
        });
    }),
    // 添加分类弹窗确认
    classify: _throttle(function (data) {
      this.stairClassifyList = data;
      this.cancel();
    }),
    // 类型选择设置清除相反的变量
    /**
     * CLASS: 清除商品变量
     * GOODS：清除分类变量
     */
    classifysSwitch(parentIndex, subIndex) {
      const accessList = this.classifySetList[parentIndex].accessList[subIndex];
      // 清空对应的变量
      if (accessList.type === 'CLASS') {
        delete accessList.goodsList;
        accessList.classifyList = [{ classifyId: null }];
      } else if (accessList.type === 'GOODS') {
        delete accessList.classifyList;
        accessList.goodsList = [];
      }
    },
    // 打开商品选择
    goodsAdd(parentIndex, subIndex) {
      this.goodsList = [];
      const accessList = this.classifySetList[parentIndex].accessList[subIndex];
      const goodsList = accessList.goodsList;
      if (accessList.type === '') {
        this.$message({
          message: '请选择类型选择',
          type: 'warning',
        });
        return;
      }
      // 更改获取变量，让其可以再弹窗中接受
      goodsList.forEach((item) => {
        const {
          goodsId: goodsid,
          goodsName: goodsname,
          factoryname,
          currencyname,
          goodstype,
        } = item;
        this.goodsList.push({
          goodsid,
          goodsname,
          factoryname,
          currencyname,
          goodstype,
        });
      });
      this.aggregate = {
        path: 'goods/goodsList',
        listKey: {
          key: 'goodsid',
          label: 'goodsname',
        },
      };
      this.popupMask = true;
      this.index = parentIndex;
      this.accessIndex = subIndex;
    },
    // 类型确认
    onSubmit(e) {
      const goodsList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const {
          goodsid: goodsId,
          goodsname: goodsName,
          factoryname,
          currencyname,
          goodstype,
        } = item;
        goodsList.push({
          goodsId,
          goodsName,
          factoryname,
          currencyname,
          goodstype,
        });
      });
      const { accessName } = this.classifySetList[this.index].accessList[
        this.accessIndex
      ];
      this.$set(this.classifySetList[this.index].accessList, this.accessIndex, {
        goodsList,
        accessName,
        type: 'GOODS',
      });
      this.cancel();
    },
    // 分类确认
    classifySubmit(e) {
      const classifyList = [];
      e.forEach((item) => {
        classifyList.push({
          classifyId: item.classid,
          classifyName: item.classname,
        });
      });
      const { accessName } = this.classifySetList[this.index].accessList[
        this.accessIndex
      ];
      this.$set(this.classifySetList[this.index].accessList, this.accessIndex, {
        classifyList,
        accessName,
        type: 'CLASS',
      });
      this.cancel();
    },
    // 页面设置 元素名称 选择 打开
    pageEleAdd(index) {
      if (this.pageSetList[index].type === '') {
        this.$message({
          message: '请选择类型选择',
          type: 'warning',
        });
        return;
      }
      this.pageindex = index;
      if (this.pageSetList[index].type === 'ADV') {
        this.advMask = true;
      } else if (this.pageSetList[index].type === 'FLOOR') {
        this.floorMask = true;
      }
    },
    // 楼层确认
    floorSubmit(e) {
      const { id, title } = e;
      // 动态赋值
      this.$set(this.pageSetList, this.pageindex, {
        type: 'FLOOR',
        floorId: id,
        floorTitle: title,
      });
      this.cancel();
    },
    // 广告确认
    advSubmit(e) {
      const { id, title } = e;
      // 动态赋值
      this.$set(this.pageSetList, this.pageindex, {
        type: 'ADV',
        advId: id,
        advTitle: title,
      });
      this.cancel();
    },
    // 页面设置清除相反的变量
    /**
     * ADV: 楼层数据
     * FLOOR：广告数据
     */
    pageSwitch(index) {
      // 清空对应的变量
      if (this.pageSetList[index].type === 'ADV') {
        // 删除
        delete this.pageSetList[index].floorId;
        delete this.pageSetList[index].floorTitle;
        // 新增
        this.pageSetList[index].advId = '';
        this.pageSetList[index].advTitle = '';
      } else if (this.pageSetList[index].type === 'FLOOR') {
        // 删除
        delete this.pageSetList[index].advId;
        delete this.pageSetList[index].advTitle;
        // 新增
        this.pageSetList[index].floorId = '';
        this.pageSetList[index].floorTitle = '';
      }
    },
    // 全选分类
    classifysAll(e) {
      if (this.stairClassifyList.length < 1) return;
      if (e) {
        const classifySetList = [];
        this.stairClassifyList.forEach((item) => {
          classifySetList.push({
            // 一级分类名称
            stairClassify: item.name,
            // 二级分类集合
            accessList: [
              {
                // stairClassify
                accessName: '',
                // 分类选择/商品选择
                type: '',
                goodsList: [
                  {
                    goodsId: '',
                    goodsName: '',
                  },
                ],
              },
            ],
          });
        });
        this.classifySetList = classifySetList;
      } else {
        this.classifySetList = [
          {
            // 一级分类名称
            stairClassify: '',
            // 二级分类集合
            accessList: [
              {
                // stairClassify
                accessName: '',
                // 分类选择/商品选择
                type: 'CLASS',
                goodsList: [
                  {
                    goodsId: '',
                    goodsName: '',
                  },
                ],
              },
            ],
          },
        ];
      }
    },
    // 编辑与新增
    handleEditAdd() {
      const intercept = this.pageTopIntercept();
      const pageSetIntercept = this.pageSetIntercept();
      const classifyIntercept = this.classifyIntercept();
      // 页面设置头部拦截
      if (intercept !== undefined) {
        this.$message({
          message: intercept,
          type: 'warning',
        });
        return;
      }
      // 分类拦截
      if (classifyIntercept !== undefined) {
        this.$message({
          message: classifyIntercept,
          type: 'warning',
        });
        return;
      }
      // 页面设置拦截
      if (pageSetIntercept !== undefined) {
        this.$message({
          message: pageSetIntercept,
          type: 'warning',
        });
        return;
      }
      // 发送数据
      if (this.id) {
        this.EditWebPage();
      } else {
        this.addWebPage();
      }
    },
    // 分类拦截
    classifyIntercept() {
      let message;
      if (this.classifySetList.length !== 0) {
        this.classifySetList.forEach((item) => {
          if (item.stairClassify === '') {
            message = '请输入一级分类名称';
            return message;
          }
          item.accessList.forEach((data) => {
            if (data.accessName === '') {
              message = '请输入二级分类名称';
              return message;
            } else if (data.type === '') {
              message = '请选择类型';
              return message;
            } else if (data.type === 'GOODS' && data.goodsList.length === 0) {
              message = '请选择商品';
              return message;
            } else if (
              data.type === 'CLASS' &&
              data.classifyList[0].classifyId === null
            ) {
              message = '请选择分类';
              return message;
            }
          });
        });
      }
      return message;
    },
    // 页面设置头部拦截
    pageTopIntercept() {
      let message = '';
      if (this.title === '') {
        message = '请输入名称';
        return message;
      }
      if (this.visibleSet[0].type === undefined) {
        message = '请选择集合';
        return message;
      }
      if (
        this.visibleSet[0].memberSetList.length === 0 &&
        this.visibleSet[0].type !== 'ALL_VISIBLE'
      ) {
        message = '请选择客户集合';
        return message;
      }
      // console.log(this.goodsSetList);
      // if (this.id !== 1 && this.id !== 3 && this.goodsSetList.length === 0) {
      //   message = '请选择商品集合集合';
      //   return message;
      // }
    },
    // 页面设置拦截
    pageSetIntercept() {
      let message;
      if (this.pageSetList.length === 0) {
        message = '页面设置为空';
        return message;
      }
      this.pageSetList.forEach((item) => {
        if (item.type === '' || item.type === undefined) {
          message = '请选择页面类型';
          return;
        }
        if (item.advId !== undefined && item.advId === '') {
          message = '请选择元素名称';
          return;
        }
        if (item.floorId !== undefined && item.floorId === '') {
          message = '请选择元素名称';
          return;
        }
      });
      return message;
    },
    // 新增页面
    addWebPage() {
      this.$http
        .post('webPage/addWebPage', {
          hintIcon: this.hintIcon,
          classifySetList: this.classifySetList,
          pageSetList: this.pageSetList,
          visibleSet: this.visibleSet,
          title: this.title,
          remark: this.remark,
          goodsSetList: this.goodsSetList
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '页面新增成功',
          });
          this.$router.push({ path: 'pageSetup' });
        });
    },
    // 编辑页面
    EditWebPage() {
      this.$http
        .post('webPage/updateWebPage', {
          hintIcon: this.hintIcon,
          classifySetList: this.classifySetList,
          pageSetList: this.pageSetList,
          visibleSet: this.visibleSet,
          title: this.title,
          id: this.id,
          remark: this.remark,
          goodsSetList: this.goodsSetList
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '页面编辑成功',
          });
          this.$router.push({ path: 'pageSetup' });
          this.$store.dispatch('addPage', { page: {}});
        });
    },
    // 取消弹窗
    cancel() {
      this.dialogFormVisible = false;
      this.popupMask = false;
      this.floorMask = false;
      this.advMask = false;
      this.memberMask = false;
      this.goodsSetMask = false;
      this.aggregate = {};
    },
  },
};
</script>

<style scoped lang="less">
.aggregate {
  display: flex;
  p {
    width: 250px;
    height: 30px;
    margin: 0 10px;
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
.operationIcon {
  span {
    display: inline-block;
    padding: 0 10px;
    font-weight: 900;
    font-size: 13px;
  }
}
.goodsList {
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 100%;
  height: 29.5px;
  line-height: 30px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.el-table__expanded-cell {
  padding: 0 0 20px 47px;
}
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
