<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input @clear="loadUserList()"
        placeholder="请输入内容" clearable v-model="query" class="inputSearch">
          <el-button @click="searchUser()"
          slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" ></el-table-column>
      <el-table-column prop="username" label="姓名" ></el-table-column>
      <el-table-column prop="email" label="邮箱" ></el-table-column>
      <el-table-column prop="mobile" label="电话" ></el-table-column>

      <!-- 过滤器处理时间格式 -->
      <el-table-column label="创建时间" width="140">
        <template slot-scope="userlist">{{userlist.row.create_time | fmtdate}}</template>
      </el-table-column>

      <!-- 状态开关 -->
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <!-- 操作按钮 -->
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <!-- 
        数据24条
        pagenum=3
        pagesize=2
        1,2/3,4/5,6
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      query: "",
      // 分页相关数据
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 表格绑定的数据
      userlist: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //   搜索用户功能
    searchUser() {
        // 按照input输入框绑定的值query发送请求
        this.getUserList()
    },
    // 清空搜索框重新获取全部数据
    loadUserList() {
        this.getUserList()
    },
    //   分页相关的方法
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.pagenum = 1
        this.getUserList()
      },
      handleCurrentChange(val) {
          this.pagenum = val
          this.getUserList()
        console.log(`当前页: ${val}`)
      },
    //   获取用户列表的请求
    async getUserList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users;
        // 2.给total赋值
        this.total = total;
        // 3.提示获取数据成功
        this.$message.success(msg);
      } else {
        // 4.提示获取数据失败
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 400px;
}
.searchRow {
  margin-top: 30px;
}
</style>
