<template>
  <div style="margin: 10px">
    <div style="margin-top: 10px">
      <el-button
        v-permission="'PageSetupMenusAdd'"
        style="margin-right: 20px"
        type="primary"
        @click="
          primaryTitle = '添加';
          isPrimaryMenu = true;
          primaryMenu = true;
        "
      >新增页面</el-button>
      <TableMove
        v-permission="'PageSetupMenusTopping'"
        style="display: inline-block"
        :query-url="queryUrl"
        :query-form="queryForm"
        :table-data="pageDataList"
        :row="currentRow"
        :total="total"
        @handleTopping="handleTopping"
        @handleSetTheBottom="handleSetTheBottom"
        @handleMoveUp="handleMoveUp"
        @handleMoveDown="handleMoveDown"
      />
    </div>
    <div>
      <Tabel
        ref="singleTable"
        :columns="columns"
        :table-data="pageData"
        :loading="loading"
        :default-expand="true"
        :page-index="queryForm"
        :tree-props="{ children: 'homeMenuVoList', hasChildren: 'hasChildren' }"
        @handleCurrent="handleCurrent"
      >
        <el-table-column slot="picture" label="图片" prop="hmPic">
          <template v-if="scope.row.parentId === null" slot-scope="scope">
            <el-image
              v-if="!scope.row.imgMessage"
              style="width: 35px; height: 35px"
              :src="scope.row.factoryImage"
              @click.prevent="openMask(scope.$index)"
            />
            <span v-else>{{ scope.row.imgMessage }}</span>
            <!-- <img v-else :alt="scope.row.imgMessage"> -->
          </template>
        </el-table-column>
        <el-table-column
          slot="handleState"
          label="状态"
          width="190"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-switch
              v-model.trim="scope.row.isUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ON"
              inactive-value="OFF"
              @change="handleSwith(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          slot="handleColumn"
          label="操作"
          width="320px"
          fixed="right"
        >
          <template v-if="CONST_IDS.ZHUAN_ID_KUAI !== scope.row.id" slot-scope="scope">
            <el-button
              v-if="scope.row.parentId === null"
              size="mini"
              type="primary"
              @click="openSecondaryPage(scope.row)"
            >添加二级</el-button>
            <el-button
              size="mini"
              type="primary"
              @click.stop="openEditMenu(scope.row)"
            >修改菜单</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.stop="handleDel(scope.row)"
            >删除页面</el-button>
          </template>
        </el-table-column>
      </Tabel>
      <Pagination
        :total="total"
        @pagination="pagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <el-dialog
      :visible.sync="primaryMenu"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise" style="padding: 0 20px; font-size: 22px">
          <span>{{ primaryTitle }}一级菜单</span>
        </div>
      </template>
      <el-form
        ref="primaryMenuForm"
        :rules="rules"
        :model="form"
        label-width="150px"
      >
        <el-form-item label="菜单名称" prop="hmName" style="width:400px">
          <el-input v-model.trim="form.hmName" />
        </el-form-item>
        <el-form-item label="选择页面">
          <el-select v-model.trim="form.hmZoneId" placeholder="请选择">
            <el-option label="无" :value="0" />
            <el-option
              v-for="item in webPageList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提示图标">
          <el-radio-group v-model.trim="form.hintIcon">
            <el-radio label="WITHOUT">无</el-radio>
            <el-radio label="HOT">热门</el-radio>
            <el-radio label="NEW_RELEASES">最新上架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="小程序图片上传" prop="areaName">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            style="margin-right: 15px"
            :http-request="uploadImage"
          >
            <FsImg v-if="form.hmPic" :src="form.hmPic" class="avatar" />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
              "
            />
          </el-upload>
          <span class="chicun"> 建议尺寸：88*88px </span>
        </el-form-item>

        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="isPrimaryMenu"
          type="primary"
          @click="handlePrimaryMenu('primaryMenuForm')"
        >提交</el-button>
        <el-button
          v-else
          type="primary"
          @click="handlePrimaryMenu('primaryMenuForm')"
        >提交</el-button>
        <el-button @click="close('primaryMenuForm')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="secondaryMenuMask"
      width="400px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise" style="padding: 0 20px; font-size: 22px">
          <span>{{ secondaryTitle }}二级菜单</span>
        </div>
      </template>
      <el-form
        ref="secondaryForm"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="一级菜单" prop="parentId">
          <!-- <el-input v-model.trim="form.homeName" disabled /> -->
          <el-select v-model.trim="form.parentId" placeholder="请选择一级菜单">
            <el-option
              v-for="(item, index) of pageData"
              :key="index"
              :label="item.hmName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="hmName">
          <el-input v-model.trim="form.hmName" />
        </el-form-item>
        <el-form-item label="选择页面" prop="hmZoneId">
          <el-select v-model.trim="form.hmZoneId" placeholder="请选择">
            <el-option
              v-for="item in webPageList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提示图标">
          <el-radio-group v-model.trim="form.hintIcon">
            <el-radio label="WITHOUT">无</el-radio>
            <el-radio label="HOT">热门</el-radio>
            <el-radio label="NEW_RELEASES">最新上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handlePrimaryMenu('secondaryForm')"
        >提交</el-button>
        <el-button @click="close('secondaryForm')">取消</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      :visible.sync="imageMask"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-image :src="factoryImage" />
    </el-dialog>
  </div>
</template>

<script>
const TableMove = () => import('@/components/TableMove');
import Tabel from '@/components/Table';
const Pagination = () => import('@/components/Pagination');
const FsImg = () => import('@/components/FsImg');
import { imgHost, CONST_IDS } from '@/config';
import { upload } from '@/fs';
export default {
  components: {
    TableMove,
    Pagination,
    Tabel,
    FsImg,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      form: {
        hintIcon: 'WITHOUT',
      },
      queryUrl: '',
      pageData: [],
      pageDataList: [],
      currentRow: {},
      total: 0,
      columns: [
        {
          prop: 'hmName',
          label: '菜单名称',
        },
        {
          prop: 'webPageName',
          label: '页面',
        },
        {
          prop: 'createTime',
          label: '修改时间',
        },
        {
          prop: 'remark',
          label: '备注',
        },
      ],
      loading: false,
      primaryMenu: false,
      secondaryMenuMask: false,
      secondaryForm: {},
      webPageList: [],
      rules: {
        hmName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        hmZoneId: [
          { required: true, message: '请选择页面', trigger: 'change' },
        ],
        parentId: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
      },
      isPrimaryMenu: true, // 控制新增编辑按钮
      secondaryTitle: '添加',
      primaryTitle: '添加',
      homeMenuIndex: null,
      isHome: true, // 判断是否有二级专区
      factoryImage: '',
      imageMask: false,
      CONST_IDS
    };
  },
  created() {
    this.getWebPage();
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get('webPage/getHomeMenuList', { params: { ...this.queryForm }})
        .then((res) => {
          this.total = res.total;
          this.pageData = res.records.map((item) => {
            // 将图片json格式转为对象
            if (item.hmPic != null) {
              item.factoryImage = imgHost + item.hmPic + `?${new Date()}`;
              item.imageMask = false;
            } else {
              item.hmPic = null;
              item.imgMessage = '无图片';
            }
            if (item.hmPic == null) {
              item.imgMessage = '无图片';
            }
            return item;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取页面
    getWebPage() {
      this.$http
        .get('webPage/getWebPageList', { params: { size: 100, current: 1 }})
        .then((res) => {
          this.webPageList = res.records;
        });
    },
    // 新增一级菜单
    handlePrimaryMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isPrimaryMenu) {
            this.addPrimaryMenu();
          } else {
            this.editPrimaryMenu();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 添加一级页面
    addPrimaryMenu() {
      if (this.form.homeMenu) {
        this.form.hmName = this.form.homeMenu;
      }
      delete this.form.createTime;
      this.$http.post('webPage/addHomeMenu', { ...this.form }).then((res) => {
        this.$message.success('添加成功');
        this.query();
        this.primaryMenu = false;
        this.secondaryMenuMask = false;
      });
    },
    // 编辑菜单
    editPrimaryMenu() {
      delete this.form.createTime;
      this.$http
        .post('webPage/updateHomeMenu', { ...this.form })
        .then((res) => {
          this.$message.success('编辑成功');
          this.query();
          this.primaryMenu = false;
          this.secondaryMenuMask = false;
        });
    },
    // 启用状态更改
    handleSwith(row) {
      this.$http
        .get('webPage/homeMenuIsUse', {
          params: { id: row.id, isUse: row.isUse },
        })
        .then((res) => {
          if (row.isUse === 'OFF') {
            this.$message.success('关闭成功');
          } else {
            this.$message.success('开启成功');
          }
        });
    },
    // 编辑二级菜单
    handleSecondary(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.get('', { params: {}}).then((res) => {
            console.log(res);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleDel(row) {
      this.$http
        .get('webPage/deleteHomeMenu', { params: { id: row.id }})
        .then(() => {
          this.$message.success('删除成功');
          this.query();
        });
    },
    // 打开二级菜单编辑
    openSecondaryPage(row) {
      this.secondaryMenuMask = true;
      this.isPrimaryMenu = true;
      this.form = {
        hmName: '',
        hintIcon: 'WITHOUT',
        parentId: row.id,
      };
      this.secondaryTitle = '添加';
    },
    // 打开修改菜单
    openEditMenu(row) {
      if (!row.parentId) {
        this.primaryMenu = true;
        this.form = { ...row };
        this.isPrimaryMenu = false;
        this.primaryTitle = '编辑';
      } else {
        this.isPrimaryMenu = false;
        this.secondaryMenuMask = true;
        this.form = {
          ...row,
        };
        this.secondaryTitle = '编辑';
      }
    },
    close(formName) {
      this.form = {
        hintIcon: 'WITHOUT',
      };
      this.secondaryForm = {};
      this.primaryMenu = false;
      this.secondaryMenuMask = false;
      this.$refs[formName].resetFields();
    },
    // 置顶
    handleTopping(val) {
      this.$http
        .get('webPage/updateHomeMenuSort', { params: { ...val }})
        .then((res) => {
          this.query();
        });
    },
    handleClose() {},
    // 置底
    handleSetTheBottom(val) {
      this.$http
        .get('webPage/updateHomeMenuSort', { params: { ...val }})
        .then((res) => {
          this.query();
        });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: homeMenuIdNext, prevId: homeMenuIdPrev } = val;
      const index = this.rowIndex;
      // if (index - 1 === 0) {
      //   this.$message({
      //     message: '无法移入首页位置',
      //     type: 'warning'
      //   });
      //   return;
      // }
      this.$http
        .get('webPage/homeMenuSort', {
          params: { homeMenuIdNext, homeMenuIdPrev },
        })
        .then((_) => {
          if (boolean) {
            this.query();
          } else {
            const arrList = this.currentRow;
            if (this.isHome) {
              // 一级专区移动
              this.$set(this.pageData, index, this.pageData[index - 1]);
              this.$set(this.pageData, index - 1, arrList);
              this.$refs['singleTable'].$refs.singleTable.setCurrentRow(
                this.pageData[index - 1]
              );
              this.handleCurrent(this.pageData[index - 1]);
            } else {
              // 二级专区移动
              this.$set(
                this.pageData[index].homeMenuVoList,
                this.homeMenuIndex,
                this.pageData[index].homeMenuVoList[this.homeMenuIndex - 1]
              );
              this.$set(
                this.pageData[index].homeMenuVoList,
                this.homeMenuIndex - 1,
                arrList
              );
              this.$refs['singleTable'].$refs.singleTable.setCurrentRow(
                this.pageData[index].homeMenuVoList[this.homeMenuIndex - 1]
              );
              this.handleCurrent(this.pageData[index].homeMenuVoList[this.homeMenuIndex - 1]);
            }
            // 更新选中行事件
          }
        });
    },
    // 下移
    handleMoveDown(val) {
      const { nextId: homeMenuIdNext, prevId: homeMenuIdPrev } = val;
      const index = this.rowIndex;
      this.$http
        .get('webPage/homeMenuSort', {
          params: { homeMenuIdNext, homeMenuIdPrev },
        })
        .then((_) => {
          const arrList = this.currentRow;
          if (this.isHome) {
            // 一级专区移动
            this.$set(this.pageData, index, this.pageData[index + 1]);
            this.$set(this.pageData, index + 1, arrList);
            this.$refs['singleTable'].$refs.singleTable.setCurrentRow(
              this.pageData[index + 1]
            );
            this.handleCurrent(this.pageData[index + 1]);
          } else {
            // 二级专区移动
            this.$set(
              this.pageData[index].homeMenuVoList,
              this.homeMenuIndex,
              this.pageData[index].homeMenuVoList[this.homeMenuIndex + 1]
            );
            this.$set(
              this.pageData[index].homeMenuVoList,
              this.homeMenuIndex + 1,
              arrList
            );
            this.$refs['singleTable'].$refs.singleTable.setCurrentRow(
              this.pageData[index].homeMenuVoList[this.homeMenuIndex + 1]
            );
            this.handleCurrent(this.pageData[index].homeMenuVoList[this.homeMenuIndex + 1]);
          }
          // 更新选中行事件
        });
    },
    // 选中行事件
    handleCurrent(val) {
      this.pageData.forEach((item, index) => {
        if (item.id === val.id) {
          // 一级专区选中
          this.pageDataList = this.pageData;
          this.isHome = true;
          this.rowIndex = index;
          return;
        } else {
          // 二级专区选中
          if (item.homeMenuVoList !== null) {
            item.homeMenuVoList.forEach((data, i) => {
              if (data.id === val.id) {
                this.pageDataList = JSON.parse(
                  JSON.stringify(item.homeMenuVoList)
                );
                this.rowIndex = index;
                this.homeMenuIndex = i;
                this.isHome = false;
                return;
              }
            });
          }
        }
      });
      // 获取下标
      this.currentRow = { ...val };
    },
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },

    uploadImage(e) {
      return upload(e.file).then((data) => {
        this.form.hmPic = data.code;
        console.log(data.code);
      });
    },

    // 开启图片预览
    openMask(e) {
      // this.giveRiseList[e].imageMask = true;
      this.factoryImage = this.pageData[e].factoryImage;
      this.imageMask = true;
    },
  },
};
</script>

<style scoped lang="less">
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>
