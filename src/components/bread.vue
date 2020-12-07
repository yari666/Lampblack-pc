<template>
  <!-- 面包屑导航区域-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ this.$route.meta.firstNode }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ this.$route.meta.secondNode }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
