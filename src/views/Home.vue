<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header class="headertop">
      <div>
        <!-- <img src="../assets/logo.png" alt="logo" /> -->
        <span>油烟检测管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container class="home-container">
      <el-aside :width="isCollpase ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--左侧菜单区域-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollpase"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.menuCode" v-for="item in menulist" :key="item.menuCode">
            <template slot="title">
              <i :class="item.menuIcon"></i>
              <span>{{ item.menuName }}</span>
            </template>

            <el-menu-item
              :index="subItem.menuCode"
              v-for="subItem in item.menuList"
              :key="subItem.menuCode"
            >
              <template slot="title">
                <i :class="subItem.menuIcon"></i>
                <span>{{ subItem.menuName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域-->
      <el-main class="workare">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import getMenuList from '../api/menu/menu'

export default {
    data() {
        return {
            menulist: [],
            activePath: '',
            isCollpase: false,
        }
    },
    created() {
        this.getMenuList()
        // this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        // 得到菜单列表信息
        async getMenuList() {
            console.log(window.sessionStorage.getItem('userId'))
            const { data: result } = await getMenuList(
                this.$http,
                window.sessionStorage.getItem('userId')
            )
            console.log(result)
            this.menulist = result
        },
        toggleCollapse() {
            this.isCollpase = !this.isCollpase
        },
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
    },
}
</script>

<style lang="less" scoped>
.el-main {
    padding: 0px;
}

.home-container {
    height: 100%;
}

.headertop {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 2px;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    text-align: left;
    height: 100%;
    .el-menu {
        border-right: none;
    }
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.workare {
    padding: 10px;
}
</style>
