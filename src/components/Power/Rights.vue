<template>
    <div class="card">
    <!-- 导航栏 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
      <el-card>
        <el-table :data="userList" style="width: 100%" stripe border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="名称"></el-table-column>
            <el-table-column prop="level" label="等级">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 权限列表
            userList: []
        }
    },
    created() {
       this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$axios.get('rights/list');
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
            this.userList = res.data;
        }
    }
}
</script>
<style lang="less" scoped>
 .card {
    width: 100%;   
 }
</style>