// 登陆页面
<template>
  <div class="login_a">
    <div class="box">
      <img src="../assets/logo.png" alt="" class="logo">
     <!-- 登录组件 -->
      <el-form  label-width="0px" class="login_b" :model="loginData" :rules="loginRules" ref="loginref">
       <!-- 用户名 -->
        <el-form-item  prop="username">
        <el-input v-model="loginData.username" ></el-input>
        </el-form-item>
      <!-- 密码 -->
        <el-form-item  prop="password">
        <el-input v-model="loginData.password" type="password"></el-input>
        </el-form-item>
      <!-- 按钮 -->
      <el-row class="btn">
        <el-button type="primary" round icon="el-icon-check" @click="check">确定</el-button>
        <el-button type="primary" round icon="el-icon-close" @click="reset">重置</el-button>
      </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginData: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        password: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    reset () {
      this.$refs.loginref.resetFields()
    },
    // 表单预验证
    check () {
      this.$refs.loginref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('login', this.loginData)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token) // 保存token进sessionStorage
        this.$router.push('/home') // 登陆成功后执行路由跳转
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_a{
  height: 100%;
  background-color: #cefaed;

  .box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .logo {
      width: 150px;
      height: 150px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .login_b{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .btn {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
    .el-icon-delete {
      display: inline-block;
    }
  }
}

</style>
