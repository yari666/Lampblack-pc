<template>
  <div>
    <!-- 面包屑导航区域-->
    <bread></bread>

    <!-- 卡片列表区域-->
    <el-card>
      <!-- 搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.Keyword"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getMenuList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            >添加菜单</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据显示区域-->
      <el-table :data="menuList" border stripe v-loading="isLoad">
        <el-table-column type="index"></el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-dropdown size="small">
              <el-button type="primary" size="small">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  size="mini"
                  @click.native="showEditDialog(scope.row.id)"
                  icon="el-icon-edit"
                  >修改</el-dropdown-item
                >
                <el-dropdown-item
                  size="mini"
                  @click.native="removeMenuById(scope.row.id)"
                  icon="el-icon-delete"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="菜单编号" prop="menuCode"></el-table-column>
        <el-table-column label="菜单名称" prop="menuName"></el-table-column>
        <el-table-column label="菜单url" prop="menuUrl"></el-table-column>
        <el-table-column label="菜单图标" prop="menuIcon"></el-table-column>
        <el-table-column label="是否激活" prop="isActive">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isActive"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域-->
      <pagedshow
        :total="total"
        :queryInfo="queryInfo"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagedshow>
    </el-card>

    <!-- 添加菜单对话框-->
    <el-dialog
      title="添加菜单"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input v-model="addForm.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="menuUrl">
          <el-select v-model="addForm.menuParentId" placeholder="请选择">
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单url" prop="menuUrl">
          <el-input v-model="addForm.menuUrl"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="addForm.menuIcon"></el-input>
        </el-form-item>
        <el-form-item label="是否激活" prop="isActive">
          <el-switch
            v-model="addForm.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改菜单对话框-->
    <el-dialog
      title="修改菜单"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input v-model="editForm.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="menuUrl">
          <el-select v-model="editForm.menuParentId" placeholder="请选择">
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单url" prop="menuUrl">
          <el-input v-model="editForm.menuUrl"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="editForm.menuIcon"></el-input>
        </el-form-item>
        <el-form-item label="是否激活" prop="isActive">
          <el-switch
            v-model="editForm.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenu,
  getPagedMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuDropdown
} from '@/api/menu/menu'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 获取菜单列表参数
      queryInfo: {
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 父级菜单数据数组
      parentMenuList: [],
      // 所有菜单数据
      menuList: [],
      // 菜单总数据
      total: 0,
      // 是否显示loading效果
      isLoad: false,
      // 控制添加菜单对话框的显示和隐藏
      addDialogVisible: false,
      // 添加菜单的表单信息
      addForm: {
        menuCode: '',
        menuName: '',
        menuUrl: '',
        menuIcon: '',
        isActive: true,
        menuParentId: undefined
      },
      // 添加菜单的表单验证信息
      addFormRules: {
        menuCode: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        menuName: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改菜单对话框的显示和隐藏
      editDialogVisible: false,
      // 修改菜单的表单信息
      editForm: {},
      // 修改菜单的表单验证信息
      editFormRules: {
        menuCode: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        menuName: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getParentMenu()
    this.getMenuList()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 得到所有的父级菜单
    async getParentMenu() {
      const { data: result } = await getMenuDropdown(this.$http)

      console.log(result)

      if (result !== undefined) {
        this.parentMenuList = result
      }
    },
    // 得到菜单列表数据
    async getMenuList() {
      this.isLoad = true
      const { data: result } = await getPagedMenus(this.$http, this.queryInfo)

      console.log(result)

      if (result !== undefined && result.items !== undefined) {
        this.menuList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取菜单列表失败')
      }
      this.isLoad = false
      console.log(result)
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getMenuList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getMenuList()
    },
    // 监听添加 菜单 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加菜单
    addMenu() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await createMenu(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          this.$message.success('添加菜单成功')
          this.addDialogVisible = false
          this.getMenuList()
        } else {
          this.$message.success('添加菜单失败')
        }
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: result } = await getMenu(this.$http, id)

      console.log(result)
      if (result !== undefined && result.id !== '') {
        this.editForm = result
        this.editDialogVisible = true
      } else {
        this.$message.error('查询菜单信息失败')
      }
    },
    // 监听修改 菜单对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改菜单信息
    editMenu() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateMenu(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新菜单列表
          this.getMenuList()
          // 提示成功信息
          this.$message.success('更新菜单信息成功')
        } else {
          this.$message.error('更新菜单信息失败')
        }
      })
    },
    // 删除菜单
    async removeMenuById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该菜单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果菜单确认删除，则返回字符串confirm
      // 如果菜单取些删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteMenu(this.$http, id)

      if (result === '') {
        this.getMenuList()
        this.$message.success('菜单删除成功')
      } else {
        this.$message.error('菜单删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>
