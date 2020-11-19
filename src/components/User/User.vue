<template>
 <div class="content">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 卡片头部区域 -->
      <el-row :gutter="30">
        <el-col :span="7">
          <div class="box_card">
            <!-- 搜索区 -->
            <div style="margin-top: 0px">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUser">
                <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" round @click="dialogVisible = true">添加用户 </el-button>
        </el-col>
      </el-row>
      <!-- 用户数据区 -->
      <el-table :data="userlist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column> 
        <!-- 具体数据 -->
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="修改角色" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 设置按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="fenpeiUser(scope.row)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  <!-- 添加用户对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <!-- 表单内容区域 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户表单提交/重置 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="changeUserDialogVisible" width="50%" @close="closeDialog">
      <!-- 表单内容区域 -->
      <el-form :model="changeUserFromData" :rules="addFromRules" ref="changeUserFromRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="changeUserFromData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changeUserFromData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="changeUserFromData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户信息的提交/重置 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="changeUserDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="commitChangeUser">确 定</el-button>
    </span>
  </el-dialog>
      <!--分配用户  -->
  <el-dialog title="分配用户" :visible.sync="fenpeiUserDialogVisable" width="50%" @close="closeFenpeiUserDialog">
    <div>
      <p>当前用户：{{fenpeiUserDialogdata.username}}</p>
      <p>当前角色：{{fenpeiUserDialogdata.role_name}}</p>
      <p>分配新角色:
        <el-select v-model="selectRoleID" placeholder="请选择">
          <el-option v-for="item in fenpeiUserData" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </p> 
    </div>
    <div slot="footer">
      <el-button @click="fenpeiUserDialogVisable = false">取 消</el-button>
      <el-button type="primary" @click="fenpeiUserSaveInfo">确 定</el-button>
    </div>
  </el-dialog>
 </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱规则 
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      } cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      } cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数 
        pagesize: 2 // 当前每页显示数据条数
      },
      userlist: [],
      total: 0,
      dialogVisible: false, // 控制对话框的显示与隐藏
      changeUserDialogVisible: false, // 修改用户信息对话的显示与隐藏
      // 添加用户表单数据
      addFrom: { username: '', password: '', email: '', mobile: '' },
      // 添加表单验证规则对象
      addFromRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, 
                   { min: 3, max: 10, message: '3-10字符之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, 
                   { min: 3, max: 10, message: '3-10字符之间', trigger: 'blur' }],
        // validator：XXX 自定义校验规则           
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }], 
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      // 修改用户信息界面中查询到用户信息
      changeUserFromData: {},
      changeUserFromRules: {},
      // 分配用户
      fenpeiUserDialogVisable: false,
      fenpeiUserDialogdata: {},
      fenpeiUserData: [],
      // 已选中的角色id值
      selectRoleID: ''
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    // 获取用户信息
    async getUser() {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo });
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败');
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听 Pagesize 的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUser();
    },
    // 监听 页码值 的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUser();
    },
    // 监听用户状态的改变
    async userStateChange(userInfo) {
       const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
       if (res.meta.status !== 200) {
         userInfo.mg_state = !userInfo.mg_state;
         return this.$message.error('更新失败');
       }
       this.$message.success('更新成功');
    },
    // 添加用户表单的监听事件功能 重置表单界面
    closeDialog() {
      this.$refs.addFromRef.resetFields();
      this.$refs.changeUserFromRef.resetFields();
    },
    // 点击确定按钮 添加用户
    addUser() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post('users', this.addFrom);
        if (res.meta.status !== 201) {
          this.$message.error('添加用户信息失败');
        }
        this.$message.success('添加用户信息成功');
        this.dialogVisible = false;
        this.getUser();
      })
    },
    // 修改用户信息
    async changeUser(id) {
      this.changeUserDialogVisible = !this.changeUserDialogVisible;
      const { data: res } = await this.$axios.get('users/' + id);
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败');
      this.changeUserFromData = res.data;
    },
    // 提交修改用户信息
    commitChangeUser() {
        this.$refs.changeUserFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put('users/' + this.changeUserFromData.id, 
                            { email: this.changeUserFromData.email,
                              mobile: this.changeUserFromData.mobile });
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败');
        this.$message.success('更新用户信息成功');
        this.changeUserDialogVisible = false;
        this.getUser();
      })
    },
    // 删除用户信息
    async deleteUser(id) {
      const ress = await this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 接受确定与取消操作 confirm/ cancel
      if (ress !== 'confirm') {
        return this.$message.info('取消操作')
      };
      const { data: res } = await this.$axios.delete('users/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败');
      }
      this.$message.success('删除成功');
      this.getUser();
    },
    // 分配用户
    async fenpeiUser(row) {
      this.fenpeiUserDialogdata = row;
      const { data: res } = await this.$axios.get('roles');
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
      this.fenpeiUserData = res.data;
      this.fenpeiUserDialogVisable = !this.fenpeiUserDialogVisable;
    },
      // 确定分配角色
      async fenpeiUserSaveInfo() {
        if (this.selectRoleID == null) return this.$message.error('请分配角色');
        const { data: res } = await this.$axios.put('users/' + this.fenpeiUserDialogdata.id + '/role', { rid: this.selectRoleID });
        if (res.meta.status !== 200) return this.$message.error('分配角色失败');
        this.fenpeiUserDialogVisable = false;
        this.getUser();
      },
        // 分配角色结束后重置对话框
        closeFenpeiUserDialog() {
          this.fenpeiUserDialogdata = {};
          this.selectRoleID = '';
        }

  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .el-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card {
    margin-left: 10px;
    margin-right: 10px;
  }
  .el-table {
    margin-top: 20px;
    font-size: 12px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>