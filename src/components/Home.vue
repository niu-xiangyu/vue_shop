<template>
<el-container class="home_container">
  <!-- 头部 -->
  <el-header>
    <div>
      <img src="../assets/logo.png" alt="">
      <span>管理系统</span>
    </div>
    <el-button type="info" @click="exit">返回</el-button>
  </el-header>
  
  <!-- 主体 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- unique-opened 只能打开一个折叠菜单 collapse 隐藏折叠菜单栏-->
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b"
       :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
       :router="true" :default-active="activePath"> 
        <!-- 折叠菜单 -->
        <!-- <div class="tab" @click="collapseStatus"></div>-->
      <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menu" :key="item.id" > 
          <template slot="title">
            <!-- 菜单图标 -->
            <i :class="icon_menu[item.id]"></i>
            <!-- 菜单文字 -->
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
            <el-menu-item :index="children.path" v-for="children in item.children" :key="children.id"
            @click="getFocus(children.path)">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 内容区域 -->
    <router-view> </router-view>
  </el-container>

</el-container>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
      // 分别设置一级菜单图标
      icon_menu: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-shop',
        145: 'el-icon-s-order'
      },
      // 是否折叠菜单栏
      isCollapse: false,
      activePath: ''
    } 
  },
  created() {
    // 拉取左侧菜单栏
    this.getMenu()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 返回主页
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单栏
    async getMenu() {
       const { data: res } = await this.$axios.get('menus')
       if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
       this.menu = res.data
    },
    // 折叠菜单栏
    collapseStatus() {
      this.isCollapse = !this.isCollapse
    },
    // 保存点击选项状态
    getFocus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container{
  height: 100%;
  .tab {
    width: 100%;
    height: 15px;
    background-color: #fff;
  }
  .el-header {
  background-color: #373d41;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    span {
      margin-left: 20px;
    }
  }
  
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
}

</style>
