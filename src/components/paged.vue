<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.SkipCount"
    :page-sizes="[5, 10, 15, 20, 25]"
    :page-size="queryInfo.MaxResultCount"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>

<script>
export default {
  props: {
    total: Number,
    queryInfo: Object
  },
  methods: {
    // 上下分页 pageIndex
    handleCurrentChange(page) {
      console.log('page:' + page)
      this.$emit('handleCurrentChange', page)
    },
    // 每页多少条切换 pageSize
    handleSizeChange(pagesize) {
      console.log('pagesize:' + pagesize)
      this.$emit('handleSizeChange', pagesize)
    }
  }
}
</script>
