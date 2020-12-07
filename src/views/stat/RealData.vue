<template>
  <div>
    <!-- 面包屑导航区域-->
    <bread></bread>

    <!-- 卡片列表区域-->
    <el-card>
      <!-- 搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-date-picker
            v-model="queryInfo.DateRange"
            ref="DateRange"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getRealDataList"
            >查询</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据显示区域-->
      <el-table :data="realDataList" border stripe v-loading="isLoad">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="设备编号" prop="deviceCode"></el-table-column>
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column label="企业名称" prop="companyName"></el-table-column>
        <el-table-column label="设备状态" prop="deviceStatus"></el-table-column>

        <el-table-column label="接收时间" prop="recievedTime"></el-table-column>
        <el-table-column label="浓度值" prop="density"></el-table-column>
        <el-table-column label="风机状态" prop="stateOfFan"></el-table-column>
        <el-table-column label="风机电流" prop="fanCurrent"></el-table-column>
        <el-table-column
          label="净化器状态"
          prop="purifierStatus"
        ></el-table-column>
        <el-table-column
          label="净化器电流"
          prop="purifierCurrent"
        ></el-table-column>
        <el-table-column
          label="非甲烷总烃"
          prop="totalNonMethaneHydrocarbon"
        ></el-table-column>
        <el-table-column
          label="颗粒物浓度"
          prop="particulateConcentration"
        ></el-table-column>
        <el-table-column label="温度" prop="temperature"></el-table-column>
        <el-table-column label="湿度" prop="humidity"></el-table-column>
        <el-table-column label="洁净等级" prop="cleanLevel"></el-table-column>
        <el-table-column
          label="探头传感器状态"
          prop="probeSensorStatus"
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
  </div>
</template>

<script>
import {
  getRealData,
  getPagedRealDatas,
  createRealData,
  updateRealData,
  deleteRealData
} from '@/api/realData/realdata'

import bread from '@/components/bread'
import pagedshow from '@/components/paged'
import { maxResultCount } from '@/config/env'

export default {
  data() {
    return {
      // 获取实时数据列表参数
      queryInfo: {
        DateRange: '',
        Keyword: '',
        SkipCount: 0,
        MaxResultCount: maxResultCount
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      // 所有实时数据数据
      realDataList: [],
      // 实时数据总数据
      total: 0,

      // 是否显示loading效果
      isLoad: false
    }
  },
  created() {
    // this.getRealDataList()
  },
  components: {
    bread,
    pagedshow
  },
  methods: {
    // 得到实时数据列表数据
    async getRealDataList() {
      console.log(this.queryInfo.DateRange)
      this.isLoad = true
      const { data: result } = await getPagedRealDatas(
        this.$http,
        this.queryInfo
      )
      console.log(result)
      if (result !== undefined && result.items !== undefined) {
        this.realDataList = result.items
        this.total = result.totalCount
      } else {
        this.$message.error('获取实时数据列表失败')
      }
      this.isLoad = false
    },
    // 监听 pageSize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.MaxResultCount = newSize
      this.getRealDataList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.SkipCount = (newPage - 1) * this.queryInfo.MaxResultCount
      this.getRealDataList()
    }
  }
}
</script>

<style lang="less" scoped></style>
