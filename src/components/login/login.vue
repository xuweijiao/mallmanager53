<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    //登录请求
    async handleLogin() {
      const res = await this.$http.post('login', this.formdata)
        console.log(res)
        const {
          data,
          meta: {msg,status}
        } = res.data
          if (status === 200) {
          // 登录成功
          // 0.保存token值
          localStorage.setItem('token',data.token)
          // 1.跳转到首页home
          this.$router.push({name:'home'})
          // 2.提示成功  
            this.$message.success(msg)
          } else {
          // 登录失败
          //1.提示信息 
            this.$message.warning(msg)
          }
     
      // this.$http.post('login', this.formdata).then(res => {
      //   console.log(res)
      //   const {
      //     data,
      //     meta: {msg,status}
      //   } = res.data
      //     if (status === 200) {
      //     // 登录成功
      //     // 1.跳转到首页home
      //     this.$router.push({name:'home'})
      //     // 2.提示成功  
      //       this.$message.success(msg)
      //     } else {
      //     // 登录失败
      //     //1.提示信息 
      //       this.$message.warning(msg)
      //     }
      // })
    }
  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性盒布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>
