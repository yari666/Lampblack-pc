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
              @click="getCompanyList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addDialogVisible = true"
            >添加企业</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据显示区域-->
      <el-table :data="companyList" border stripe v-loading="isLoad">
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
                  @click.native="removeCompanyById(scope.row.id)"
                  icon="el-icon-delete"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="企业编码" prop="companyCode"></el-table-column>
        <el-table-column label="企业名称" prop="companyName"></el-table-column>
        <el-table-column
          label="企业地址"
          prop="companyAddress"
        ></el-table-column>
        <el-table-column
          label="所属街道"
          prop="subordinateToStreet"
        ></el-table-column>
        <el-table-column label="联系人" prop="contact"></el-table-column>
        <el-table-column
          label="联系人电话"
          prop="contactPhone"
        ></el-table-column>
        <el-table-column label="传真" prop="companyFax"></el-table-column>
        <el-table-column
          label="经营范围"
          prop="businessScope"
        ></el-table-column>
      </el-table>

      <!-- 分页区域-->
      <pagedshow
        :total="total"
        :queryInfo="queryInfo"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></pagedshow>
    </el-card>

    <!-- 添加企业对话框-->
    <el-dialog
      title="添加企业"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="85px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业编码" prop="companyCode">
              <el-input v-model="addForm.companyCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="addForm.companyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业地址" prop="companyAddress">
              <el-input v-model="addForm.companyAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属街道" prop="subordinateToStreet">
              <el-input v-model="addForm.subordinateToStreet"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="addForm.contact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="contactPhone">
              <el-input v-model="addForm.contactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传真" prop="companyFax">
              <el-input v-model="addForm.companyFax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围" prop="businessScope">
              <el-input v-model="addForm.businessScope"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCompany">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改企业对话框-->
    <el-dialog
      title="修改企业"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="85px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业编码" prop="companyCode">
              <el-input v-model="editForm.companyCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="editForm.companyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业地址" prop="companyAddress">
              <el-input v-model="editForm.companyAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属街道" prop="subordinateToStreet">
              <el-input v-model="editForm.subordinateToStreet"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="editForm.contact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="contactPhone">
              <el-input v-model="editForm.contactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传真" prop="companyFax">
              <el-input v-model="editForm.companyFax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围" prop="businessScope">
              <el-input v-model="editForm.businessScope"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCompany,
  getPagedCompanys,
  createCompany,
  updateCompany,
  deleteCompany
} from '@/api/company/company'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 获取企业列表参数
      queryInfo: {
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 所有企业数据
      companyList: [],
      // 企业总数据
      total: 0,
      // 是否显示loading效果
      isLoad: false,
      // 控制添加企业对话框的显示和隐藏
      addDialogVisible: false,
      // 添加企业的表单信息
      addForm: {
        companyCode: '',
        companyName: '',
        companyAddress: '',
        subordinateToStreet: '',
        contact: '',
        contactPhone: '',
        companyFax: '',
        businessScope: ''
      },
      // 添加企业的表单验证信息
      addFormRules: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        companyCode: [
          { required: true, message: '请输入企业编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改企业对话框的显示和隐藏
      editDialogVisible: false,
      // 修改企业的表单信息
      editForm: {},
      // 修改企业的表单验证信息
      editFormRules: {
        companyCode: [
          { required: true, message: '请输入企业编号', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCompanyList()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 得到企业列表数据
    async getCompanyList() {
      this.isLoad = true
      const { data: result } = await getPagedCompanys(
        this.$http,
        this.queryInfo
      )
      console.log(result)
      if (result !== undefined && result.items !== undefined) {
        this.companyList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取企业列表失败')
      }
      this.isLoad = false
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getCompanyList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getCompanyList()
    },
    // 监听添加 企业 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加企业
    addCompany() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await createCompany(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          console.log('added:' + result.id)
          this.$message.success('添加企业成功')
          this.addDialogVisible = false
          this.getCompanyList()
        } else {
          this.$message.success('添加企业失败')
        }
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: result } = await getCompany(this.$http, id)

      if (result !== undefined && result.id !== '') {
        this.editForm = result
        this.editDialogVisible = true
      } else {
        this.$message.error('查询企业信息失败')
      }
    },
    // 监听修改 企业对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改企业信息
    editCompany() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateCompany(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新用户列表
          this.getCompanyList()
          // 提示成功信息
          this.$message.success('更新企业信息成功')
        } else {
          this.$message.error('更新企业信息失败')
        }
      })
    },
    // 删除企业
    async removeCompanyById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该企业, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果企业确认删除，则返回字符串confirm
      // 如果企业取些删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteCompany(this.$http, id)

      if (result === '') {
        this.getCompanyList()
        this.$message.success('企业删除成功')
      } else {
        this.$message.error('企业删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
