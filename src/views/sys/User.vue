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
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据显示区域-->
      <el-table :data="userList" border stripe v-loading="isLoad">
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
                  @click.native="removeUserById(scope.row.id)"
                  icon="el-icon-delete"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" prop="userName"></el-table-column>
        <el-table-column label="真实名称" prop="realName"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="电子邮件" prop="email"></el-table-column>
        <el-table-column label="状态" prop="isActive">
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

    <!-- 添加用户对话框-->
    <el-dialog
      title="添加用户"
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="真实名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId">
          <el-select v-model="addForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框-->
    <el-dialog
      title="修改用户"
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="真实名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId">
          <el-select v-model="editForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="isActive">
          <el-switch
            v-model="editForm.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUser,
  getPagedUsers,
  createUser,
  updateUser,
  deleteUser
} from '@/api/user/user'

import { getRoleDropdown } from '@/api/role/role'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    return {
      // 获取用户列表参数
      queryInfo: {
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 角色数据数组
      roleList: [],
      // 所有用户数据
      userList: [],
      // 用户总数据
      total: 0,
      // 是否显示loading效果
      isLoad: false,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单信息
      addForm: {
        userName: '',
        realName: '',
        phone: '',
        password: '',
        isActive: true,
        email: '',
        roleId: ''
      },
      // 添加用户的表单验证信息
      addFormRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
        // email: [
        //   { required: true, message: '请输入邮箱', trigger: 'blur' },
        //   { validator: checkEmail, trigger: 'blur' }
        // ]
      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 修改用户的表单信息
      editForm: {},
      // 修改用户的表单验证信息
      editFormRules: {}
    }
  },
  created() {
    this.getRoles()
    this.getUserList()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 得到所有有效的角色
    async getRoles() {
      const { data: result } = await getRoleDropdown(this.$http)
      if (result !== undefined) {
        this.roleList = result
      }
    },
    // 得到用户列表数据
    async getUserList() {
      this.isLoad = true
      const { data: result } = await getPagedUsers(this.$http, this.queryInfo)

      console.log(result)

      if (result !== undefined && result.items !== undefined) {
        this.userList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取用户列表失败')
      }
      this.isLoad = false
      console.log(result)
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getUserList()
    },
    // 监听添加 用户 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await createUser(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.getUserList()
        } else {
          this.$message.success('添加用户失败')
        }
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: result } = await getUser(this.$http, id)

      console.log(result)
      if (result !== undefined && result.id !== '') {
        this.editForm = result
        this.editDialogVisible = true
      } else {
        this.$message.error('查询用户信息失败')
      }
    },
    // 监听修改 用户对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateUser(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新用户列表
          this.getUserList()
          // 提示成功信息
          this.$message.success('更新用户信息成功')
        } else {
          this.$message.error('更新用户信息失败')
        }
      })
    },
    // 删除用户
    async removeUserById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取些删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteUser(this.$http, id)

      if (result === '') {
        this.getUserList()
        this.$message.success('用户删除成功')
      } else {
        this.$message.error('用户删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .el-select{
    width: 100%;
  }
</style>
