<template>
  <div>
    <!-- 面包屑导航区域-->
    <bread></bread>

    <!-- 左右分区处理 -->
    <el-row :gutter="5">
      <el-col :span="6">
        <div>
          <!-- 设备树展示 -->
          <el-card>
            <el-tree
              :data="deviceTreeList"
              :props="defaultDeviceProp"
              accordion
              @node-click="handleDeviceTreeNodeClick"
              v-loading="isLoadTree"
              highlight-current
            >
            </el-tree>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18">
        <!-- 节点列表展示区域 -->
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
                  @click="getNodeList"
                ></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="openAddDialog"
              >
                添加节点
              </el-button>
            </el-col>
          </el-row>

          <!-- 数据显示区域-->
          <el-table
            :data="nodeList"
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
                      @click.native="removeNodeById(scope.row.id)"
                      icon="el-icon-delete"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="节点编号" prop="nodeCode">
            </el-table-column>
            <el-table-column label="节点名称" prop="nodeName">
            </el-table-column>
            <el-table-column label="优先级" prop="priority"> </el-table-column>
            <el-table-column label="数据类型" prop="dataType">
            </el-table-column>
            <el-table-column label="节点使能" prop="isNodeEnabled">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isNodeEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="小数位数" prop="decimalDigits">
            </el-table-column>
            <el-table-column label="模拟量2名称" prop="analog2Name">
            </el-table-column>
            <el-table-column label="模拟量2单位" prop="analog2Unit">
            </el-table-column>
            <el-table-column label="模拟量2系数" prop="analog2Coefficient">
            </el-table-column>
            <el-table-column label="模拟量2偏差" prop="analog2Deviation">
            </el-table-column>
            <el-table-column label="模拟量2上限" prop="analog2Ceiling">
            </el-table-column>
            <el-table-column label="模拟量2下限" prop="analog2Floor">
            </el-table-column>
            <el-table-column label="仪表盘2上量程" prop="dashboard2TopRange">
            </el-table-column>
            <el-table-column label="仪表盘2下量程" prop="dashboard2BottomRange">
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

    <!-- 添加节点对话框-->
    <el-dialog
      title="添加节点"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点编码" prop="nodeCode">
              <el-input v-model.number="addForm.nodeCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="nodeName">
              <el-input v-model="addForm.nodeName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input v-model.number="addForm.priority"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型" prop="dataType">
              <el-input v-model="addForm.dataType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点使能" prop="isNodeEnabled">
              <el-switch
                v-model="addForm.isNodeEnabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小数位数" prop="decimalDigits">
              <el-input v-model.number="addForm.decimalDigits"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2名称" prop="analog2Name">
              <el-input v-model="addForm.analog2Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2单位" prop="analog2Unit">
              <el-input v-model="addForm.analog2Unit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2系数" prop="aAnalog2Coefficient">
              <el-input v-model.number="addForm.aAnalog2Coefficient"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2偏差" prop="aAnalog2Deviation">
              <el-input v-model.number="addForm.aAnalog2Deviation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2上限" prop="analog2Ceiling">
              <el-input v-model.number="addForm.analog2Ceiling"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2下限" prop="analog2Floor">
              <el-input v-model.number="addForm.analog2Floor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪表盘2上量程" prop="dashboard2TopRange">
              <el-input v-model.number="addForm.dashboard2TopRange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪表盘2下量程" prop="dashboard2BottomRange">
              <el-input
                v-model.number="addForm.dashboard2BottomRange"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNode">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改节点对话框-->
    <el-dialog
      title="修改节点"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClose"
    >
      <!-- 对话框主体部分-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点编码" prop="nodeCode">
              <el-input v-model.number="editForm.nodeCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="nodeName">
              <el-input v-model="editForm.nodeName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input v-model.number="editForm.priority"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型" prop="dataType">
              <el-input v-model="editForm.dataType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点使能" prop="isNodeEnabled">
              <el-switch
                v-model="editForm.isNodeEnabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小数位数" prop="decimalDigits">
              <el-input v-model.number="editForm.decimalDigits"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2名称" prop="analog2Name">
              <el-input v-model="editForm.analog2Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2单位" prop="analog2Unit">
              <el-input v-model="editForm.analog2Unit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2系数" prop="analog2Coefficient">
              <el-input v-model.number="editForm.analog2Coefficient"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2偏差" prop="analog2Deviation">
              <el-input v-model.number="editForm.analog2Deviation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模拟量2上限" prop="analog2Ceiling">
              <el-input v-model.number="editForm.analog2Ceiling"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模拟量2下限" prop="analog2Floor">
              <el-input v-model.number="editForm.analog2Floor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪表盘2上量程" prop="dashboard2TopRange">
              <el-input v-model.number="editForm.dashboard2TopRange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪表盘2下量程" prop="dashboard2BottomRange">
              <el-input
                v-model.number="editForm.dashboard2BottomRange"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 对话框底部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNode,
  getPagedNodes,
  createNode,
  updateNode,
  deleteNode
} from '@/api/node/node'

import { getAllDevices } from '@/api/device/device'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 设备树的数据集
      deviceTreeList: [],
      // 设备树节点默认属性对象
      defaultDeviceProp: {
        // children: 'id',
        label: 'deviceName'
      },
      // 是否显示设备树数据加载loading效果
      isLoadTree: false,
      // 获取节点列表参数
      queryInfo: {
        DeviceId: undefined,
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      // 节点列表数据
      nodeList: [],
      // 节点列表数据总数
      total: 0,
      // 是否显示loading效果
      isLoad: false,
      // 控制添加节点对话框的显示和隐藏
      addDialogVisible: false,
      // 添加节点的表单信息
      addForm: {
        nodeCode: '',
        nodeName: '',
        deviceId: undefined,
        priority: '',
        dataType: '',
        isNodeEnabled: true,
        decimalDigits: '',
        analog2Name: '',
        analog2Unit: '',
        aAnalog2Coefficient: '',
        aAnalog2Deviation: '',
        analog2Ceiling: '',
        analog2Floor: '',
        dashboard2TopRange: '',
        dashboard2BottomRange: ''
      },
      // 添加节点的表单验证信息
      addFormRules: {
        nodeCode: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          {
            type: 'number',
            message: '节点编码必须为数字值',
            trigger: 'blur'
          }
        ],
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        priority: [
          {
            type: 'number',
            message: '优先级必须为数字值',
            trigger: 'blur'
          }
        ],
        decimalDigits: [
          {
            type: 'number',
            message: '小数位数必须为数字值',
            trigger: 'blur'
          }
        ],
        aAnalog2Coefficient: [
          {
            type: 'number',
            message: '模拟量2系数必须为数字值',
            trigger: 'blur'
          }
        ],
        aAnalog2Deviation: [
          {
            type: 'number',
            message: '模拟量2偏差必须为数字值',
            trigger: 'blur'
          }
        ],
        analog2Ceiling: [
          {
            type: 'number',
            message: '模拟量2上限必须为数字值',
            trigger: 'blur'
          }
        ],
        analog2Floor: [
          {
            type: 'number',
            message: '模拟量2下限必须为数字值',
            trigger: 'blur'
          }
        ],
        dashboard2TopRange: [
          {
            type: 'number',
            message: '仪表盘2上量程必须为数字值',
            trigger: 'blur'
          }
        ],
        dashboard2BottomRange: [
          {
            type: 'number',
            message: '仪表盘2下量程必须为数字值',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改节点对话框的显示和隐藏
      editDialogVisible: false,
      // 修改节点的表单信息
      editForm: {},
      // 修改节点的表单验证信息
      editFormRules: {
        nodeCode: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          {
            type: 'number',
            message: '节点编码必须为数字值',
            trigger: 'blur'
          }
        ],
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        priority: [
          {
            type: 'number',
            message: '优先级必须为数字值'
          }
        ],
        decimalDigits: [
          {
            type: 'number',
            message: '小数位数必须为数字值'
          }
        ],
        aAnalog2Coefficient: [
          {
            type: 'number',
            message: '模拟量2系数必须为数字值'
          }
        ],
        aAnalog2Deviation: [
          {
            type: 'number',
            message: '模拟量2偏差必须为数字值'
          }
        ]
      }
    }
  },
  created() {
    this.getNodeList()
    this.getDeviceTreeData()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 设备树节点点击事件
    handleDeviceTreeNodeClick(node) {
      this.queryInfo.DeviceId = node.id
      this.addForm.deviceId = node.id

      this.getNodeList()
    },
    // 得到设备树的数据
    async getDeviceTreeData() {
      this.isLoadTree = true
      const { data: result } = await getAllDevices(this.$http)

      console.log(result)
      if (result !== undefined) {
        this.deviceTreeList = result
      } else {
        this.$message.error('查询设备信息失败')
      }
      this.isLoadTree = false
    },
    // 得到节点列表数据
    async getNodeList() {
      this.isLoad = true
      const { data: result } = await getPagedNodes(this.$http, this.queryInfo)

      if (result !== undefined && result.items !== undefined) {
        this.nodeList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取节点列表失败')
      }
      this.isLoad = false
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getNodeList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getNodeList()
    },
    // 监听添加 节点 对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 打开添加窗口
    openAddDialog() {
      if (this.addForm.deviceId === undefined) {
        return this.$message.warning('请选择一个设备进行节点添加')
      }

      this.addDialogVisible = true
    },
    // 添加节点
    addNode() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: result } = await createNode(this.$http, this.addForm)

        if (result !== undefined && result.id !== '') {
          this.$message.success('添加节点成功')
          this.addDialogVisible = false
          this.getNodeList()
        } else {
          this.$message.success('添加节点失败')
        }
      })
    },
    // 打开节点编辑对话框
    async showEditDialog(id) {
      const { data: result } = await getNode(this.$http, id)

      console.log(result)
      if (result !== undefined && result.id !== '') {
        this.editForm = result

        this.editDialogVisible = true
      } else {
        this.$message.error('查询节点信息失败')
      }
    },
    // 监听修改 角色对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改节点信息
    editNode() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起数据请求
        const { data: result } = await updateNode(this.$http, this.editForm)

        if (result !== undefined && result.id !== '') {
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新节点列表
          this.getNodeList()
          // 提示成功信息
          this.$message.success('更新节点信息成功')
        } else {
          this.$message.error('更新节点信息失败')
        }
      })
    },
    // 删除节点
    async removeNodeById(id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该节点, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果节点确认删除，则返回字符串confirm
      // 如果节点取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await deleteNode(this.$http, id)

      if (result === '') {
        this.getNodeList()
        this.$message.success('节点删除成功')
      } else {
        this.$message.error('节点删除失败')
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
