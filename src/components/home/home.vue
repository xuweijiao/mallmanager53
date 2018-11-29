<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
              <img src="../../assets/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="18">
            <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="2">
            <a class="loginout" href="#">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
/* 整体的布局*/
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
/* 头部样式*/
.middle {
    text-align: center;
    line-height: 24px;
    color: #fff;
}
.loginout {
    line-height: 60px;
    text-decoration: none;
}
</style>
