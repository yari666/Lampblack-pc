<template>
  <div>
    <!-- 面包屑导航区域-->
    <bread></bread>

    <!-- 左右分区处理 -->
    <el-row :gutter="5">
      <el-col :span="6">
        <div>
          <!-- 企业树展示 -->
          <el-card>
            <el-tree
              :data="companyTreeList"
              :props="defaultCompanyProp"
              accordion
              @node-click="handleCompanyTreeNodeClick"
              v-loading="isLoadTree"
              highlight-current
            >
            </el-tree>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18">
        <!-- 设备列表展示区域 -->
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
                  @click="getDeviceList"
                ></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="openAddDialog"
              >
                添加设备
              </el-button>
            </el-col>
          </el-row>

          <!-- 数据显示区域-->
          <el-table
            :data="deviceList"
            border
            stripe
            highlight-current-row
            v-loading="isLoad"
          >
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
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      size="mini"
                      @click.native="removeDeviceById(scope.row.id)"
                      icon="el-icon-delete"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="设备编号" prop="deviceCode">
            </el-table-column>
            <el-table-column label="设备名称" prop="deviceName">
            </el-table-column>
            <el-table-column label="设备型号" prop="deviceModel">
            </el-table-column>
            <el-table-column label="安装时间" prop="installDate">
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.installDate.substr(
                      0,
                      scope.row.installDate.indexOf('T')
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="开启警告" prop="isAlarm">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isAlarm"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="生产厂家" prop="manufacturer">
            </el-table-column>
            <el-table-column label="联系人" prop="manufacturerContact">
            </el-table-column>
            <el-table-column label="联系电话" prop="manufacturerContactPhone">
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
      </el-col>
    </el-row>

    <!-- 添加设备对话框-->
    <el-dialog
      title="添加设备"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="addForm.deviceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="addForm.deviceName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="deviceModel">
              <el-input v-model="addForm.deviceModel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装时间" prop="installDate">
              <el-date-picker
                v-model="addForm.installDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开启警告" prop="isAlarm">
              <el-switch
                v-model="addForm.isAlarm"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="addForm.manufacturer"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="manufacturerContact">
              <el-input v-model="addForm.manufacturerContact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="manufacturerContactPhone">
              <el-input v-model="addForm.manufacturerContactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDevice">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改设备对话框-->
    <el-dialog
      title="修改设备"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="editForm.deviceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="editForm.deviceName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="deviceModel">
              <el-input v-model="editForm.deviceModel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装时间" prop="installDate">
              <el-date-picker
                v-model="editForm.installDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开启警告" prop="isAlarm">
              <el-switch
                v-model="editForm.isAlarm"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="editForm.manufacturer"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="manufacturerContact">
              <el-input v-model="editForm.manufacturerContact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="manufacturerContactPhone">
              <el-input v-model="editForm.manufacturerContactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDevice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDevice,
  getPagedDevices,
  createDevice,
  updateDevice,
  deleteDevice
} from '@/api/device/device'

import { getAllCompanies } from '@/api/company/company'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 企业树的数据集
      companyTreeList: [],
      // 企业树节点默认属性对象
      defaultCompanyProp: {
        // children: 'id',
        label: 'companyName'
      },
      // 是否显示企业树数据加载loading效果
      isLoadTree: false,
      // 获取设备列表参数
      queryInfo: {
        CompanyId: undefined,
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 设备列表数据
      deviceList: [],
      // 设备列表数据总数
      total: 0,
      // 是否显示loading效果
      isLoad: false,
      // 控制添加设备对话框的显示和隐藏
      addDialogVisible: false,
      // 添加设备的表单信息
      addForm: {
        deviceCode: '',
        deviceName: '',
        companyId: undefined,
        deviceModel: '',
        installDate: '',
        isAlarm: true,
        manufacturer: '',
        manufacturerContact: '',
        manufacturerContactPhone: ''
      },
      // 添加设备的表单验证信息
      addFormRules: {
        deviceCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改设备对话框的显示和隐藏
      editDialogVisible: false,
      // 修改设备的表单信息
      editForm: {},
      // 修改设备的表单验证信息
      editFormRules: {
        deviceCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
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
    this.getDeviceList()
    this.getCompanyTreeData()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 企业树节点点击事件
    handleCompanyTreeNodeClick(node) {
      this.queryInfo.CompanyId = node.id
      this.addForm.companyId = node.id

      this.getDeviceList()
    },
    // 得到企业树的数据
    async getCompanyTreeData() {
      this.isLoadTree = true
      const { data: result } = await getAllCompanies(this.$http)

      console.log(result)
      if (result !== undefined) {
        this.companyTreeList = result
      } else {
        this.$message.error('查询企业信息失败')
      }
      this.isLoadTree = false
    },
    // 得到设备列表数据
    async getDeviceList() {
      this.isLoad = true
      const { data: result } = await getPagedDevices(this.$http, this.queryInfo)

      if (result !== undefined && result.items !== undefined) {
        this.deviceList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取设备列表失败')
      }
      this.isLoad = false
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getDeviceList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getDeviceList()
    },
    // 监听添加 设备 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 打开添加窗口
    openAddDialog() {
      if (this.addForm.companyId === undefined) {
        return this.$message.warning('请选择一个企业进行设备添加')
      }

      this.addDialogVisible = true
    },
    // 添加设备
    addDevice() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await createDevice(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          this.$message.success('添加设备成功')
          this.addDialogVisible = false
          this.getDeviceList()
        } else {
          this.$message.success('添加设备失败')
        }
      })
    },
    // 打开设备编辑对话框
    async showEditDialog(id) {
      const { data: result } = await getDevice(this.$http, id)

      console.log(result)
      if (result !== undefined && result.id !== '') {
        this.editForm = result

        this.editDialogVisible = true
      } else {
        this.$message.error('查询设备信息失败')
      }
    },
    // 监听修改 角色对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改设备信息
    editDevice() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateDevice(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新设备列表
          this.getDeviceList()
          // 提示成功信息
          this.$message.success('更设备院信息成功')
        } else {
          this.$message.error('更设备院信息失败')
        }
      })
    },
    // 删除设备
    async removeDeviceById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该设备, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果设备确认删除，则返回字符串confirm
      // 如果设备取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteDevice(this.$http, id)

      if (result === '') {
        this.getDeviceList()
        this.$message.success('设备删除成功')
      } else {
        this.$message.error('设备删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
