<template>
    <div class="card">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--添加角色  -->
      <el-row>
        <el-col>
            <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 渲染角色内容 -->
      <el-table :data="rolesList" border stripe>
        <!-- 点击展开权限内容 （el-col共24份 均分el-row）-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, id) in scope.row.children" :key="item.id" :class="['center',id === 0?'':'setLine']">
              <!-- 一级权限渲染 -->
              <el-col :span="5" style="margin-top: 10px">
                <el-tag type="success" closable @close="deleteTag(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限渲染 -->
              <el-col :span="19">
                <el-row v-for="item2 in item.children" :key="item2.id" :class="['center']">
                  <el-col style="margin-top: 10px" :span="6">
                    <el-tag closable @close="deleteTag(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                    <!-- 三级 -->
                     <el-col :span="18">
                       <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" class="el_tag3" 
                        closable @close="deleteTag(scope.row,item3.id)">
                          {{item3.authName}}
                       </el-tag>
                     </el-col>
                </el-row>   
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
            <el-button size="mini" type="warning" @click="changeAuthority(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
   <!-- 分配角色权限 el-tree -->
   <el-dialog title="分配角色权限" :visible.sync="changeAuthorityDialogVisible" width="50%" @close="AuthorityDialogClose">
     <el-tree :data="authorities" :props="authoritiesProps" show-checkbox node-key="id" default-expand-all
     :default-checked-keys="defCKeys" ref="elTreeRef"></el-tree>
     <div slot="footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="AuthorityDialogConfirmChange">确 定</el-button>
     </div>
   </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
      return {
        rolesList: [],
        // 分配角色权限对话框的显示与隐藏
        changeAuthorityDialogVisible: false,
          // 所有权限数据
          authorities: [],
          authoritiesProps: {
            label: 'authName',
            children: 'children'
          },
          // 默认选中角色权限id
          defCKeys: [],
          rowId: ''
      }
    },
    created() {
     this.getRolesList()
    },
    methods: {
      async getRolesList() {
        const { data: res } = await this.$axios.get('roles');
        if (res.meta.status !== 200) return this.$message.error('获取列表失败');
        this.rolesList = res.data;
      },
      // 删除权限
      async deleteTag(role, id2) {
        const ress = await this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        // 接受确定与取消操作 confirm/ cancel
        if (ress !== 'confirm') {
          return this.$message.info('取消操作')
        };
        const { data: res } = await this.$axios.delete('roles/' + role.id + '/rights/' + id2);
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败');
        }
        this.$message.success('删除成功');
        role.children = res.data;
      },
      // 分配角色权限界面
      async changeAuthority(row) {
        this.rowId = row.id;
        const { data: res } = await this.$axios.get('rights/tree');
        if (res.meta.status !== 200) return this.$message.err('获取数据失败');
        this.authorities = res.data;
        // 获取默认角色权限id
        this.getDefCKeys(row, this.defCKeys);
        // 展示权限分配
        this.changeAuthorityDialogVisible = !this.changeAuthorityDialogVisible;
      },
      // 获取并勾选默认角色权限id 
      getDefCKeys(node, arr) {
        if (!node.children) return arr.push(node.id);
        node.children.forEach(item => {
          this.getDefCKeys(item, arr);
        });   
      },
      // 刷新每个权限页面
      AuthorityDialogClose() {
        this.defCKeys = [];
      },
      // 提交修改后权限信息列表
      async AuthorityDialogConfirmChange() {
        const keys = [this.$refs.elTreeRef.getCheckedKeys(), this.$refs.elTreeRef.getHalfCheckedKeys()];
        const idStr = keys.join(',');
        const { data: res } = await this.$axios.post('roles/' + this.rowId + '/rights', { rids: idStr });
        if (res.meta.status !== 200) return this.$message.err('分配权限失败');
        this.$message.success('分配权限成功');
        this.changeAuthorityDialogVisible = false;
        this.getRolesList();
      }
    }
}
</script>
<style lang="less" scoped>
.card {
    width: 100%;
}
.el_tag3  {
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 10px;

}
.center {
  display: flex;
  align-items: center;
}
.setLine {
  border-top: 1px solid #eee;
  margin-bottom: 10px;
}
</style>