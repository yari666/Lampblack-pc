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
              @click="getRoleList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据显示区域-->
      <el-table :data="roleList" border stripe v-loading="isLoad">
        <el-table-column type="index"></el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-dropdown size="small">
              <el-button type="primary" size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
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
                  @click.native="removeRoleById(scope.row.id)"
                  icon="el-icon-delete"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" prop="roleCode"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="是否可用" prop="isActive">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isActive"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
      </el-table>

      <!-- 分页区域-->
      <pagedshow
        :total="total"
        :queryInfo="queryInfo"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagedshow>
    </el-card>

    <!-- 添加角色对话框-->
    <el-dialog
      title="添加角色"
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
        <el-tabs type="border-card">
          <el-tab-pane label="角色">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="addForm.roleCode"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="isActive">
              <el-switch
                v-model="addForm.isActive"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="addForm.remark"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="权限">
            <el-tree
              :data="menuTreeList"
              show-checkbox
              node-key="id"
              :props="defaultMenuProps"
              check-strictly
              ref="tree"
              default-expand-all
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框-->
    <el-dialog
      title="修改角色"
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
        <el-tabs type="border-card">
          <el-tab-pane label="角色">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="editForm.roleCode"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="isActive">
              <el-switch
                v-model="editForm.isActive"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="权限">
            <el-tree
              :data="menuTreeList"
              show-checkbox
              node-key="id"
              :props="defaultMenuProps"
              check-strictly
              ref="tree"
              default-expand-all
              :default-checked-keys="deaultCheck"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRole,
  getPagedRoles,
  createRole,
  updateRole,
  deleteRole
} from '@/api/role/role'

import getMenuList from '@/api/menu/menu'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 获取角色列表参数
      queryInfo: {
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 所有角色数据
      roleList: [],
      // 角色总数据
      total: 0,
      menuTreeList: [],
      defaultMenuProps: {
        children: 'menuList',
        label: 'menuName'
      },
      deaultCheck: [],
      // 是否显示loading效果
      isLoad: false,
      // 控制添加角色对话框的显示和隐藏
      addDialogVisible: false,
      // 添加角色的表单信息
      addForm: {
        roleCode: '',
        roleName: '',
        remark: '',
        isActive: true,
        selectedMenu: []
      },
      // 添加角色的表单验证信息
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改角色对话框的显示和隐藏
      editDialogVisible: false,
      // 修改角色的表单信息
      editForm: {
        id: undefined,
        roleCode: '',
        roleName: '',
        remark: '',
        isActive: true,
        selectedMenu: []
      },
      // 修改角色的表单验证信息
      editFormRules: {
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getMenuTreeList()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 得到菜单列表信息
    async getMenuTreeList() {
      const { data: result } = await getMenuList(this.$http, '0')

      if (result !== undefined) {
        this.menuTreeList = result
        console.log(this.menuTreeList)
      }
    },
    // 得到角色列表数据
    async getRoleList() {
      this.isLoad = true
      const { data: result } = await getPagedRoles(this.$http, this.queryInfo)
      console.log(result)
      if (result !== undefined && result.items !== undefined) {
        this.roleList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取角色列表失败')
      }
      this.isLoad = false
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getRoleList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getRoleList()
    },
    // 监听添加 角色 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        var arrMenu = this.$refs.tree.getCheckedNodes()
        arrMenu.forEach(element => {
          this.addForm.selectedMenu.push(element.id)
        })

        console.log(this.addForm.selectedMenu)
        if (this.addForm.selectedMenu.length <= 0) {
          this.$message.error('请选择权限菜单！')
          return
        }
        if (!valid) {
          return
        }
        const { data: result } = await createRole(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          console.log('added:' + result.id)
          this.$message.success('添加角色成功')
          this.addDialogVisible = false
          this.getRoleList()
        } else {
          this.$message.success('添加角色失败')
        }
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: result } = await getRole(this.$http, id)

      if (result !== undefined && result.id !== '') {
        this.editForm = result
        this.deaultCheck = this.editForm.menuIdList
        this.editDialogVisible = true
      } else {
        this.$message.error('查询角色信息失败')
      }
    },
    // 监听修改 角色对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        var arrMenu = this.$refs.tree.getCheckedNodes()
        this.editForm.selectedMenu = []
        arrMenu.forEach(element => {
          this.editForm.selectedMenu.push(element.id)
        })

        console.log(this.editForm.selectedMenu)
        if (this.editForm.selectedMenu.length <= 0) {
          this.$message.error('请选择权限菜单！')
          return
        }
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateRole(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新用户列表
          this.getRoleList()
          // 提示成功信息
          this.$message.success('更新角色信息成功')
        } else {
          this.$message.error('更新角色信息失败')
        }
      })
    },
    // 删除角色
    async removeRoleById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果角色确认删除，则返回字符串confirm
      // 如果角色取些删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteRole(this.$http, id)

      if (result === '') {
        this.getRoleList()
        this.$message.success('角色删除成功')
      } else {
        this.$message.error('角色删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
