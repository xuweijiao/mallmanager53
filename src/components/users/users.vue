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
        <el-input
          @clear="loadUserList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table height="300px" :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

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
          <el-button 
          size="mini" 
          plain type="primary" 
          icon="el-icon-edit" 
          circle
          @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button 
          size="mini" 
          plain 
          type="danger" 
          icon="el-icon-delete" 
          circle
          @click="showDeleUserMsgBox(scope.row.id)"></el-button>
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
      :total="total"
    ></el-pagination>
    <!-- 弹出层-对话框  -->
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item class="dia-form" label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dia-form" label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dia-form" label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dia-form" label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <i class="el-icon-circle-close-outline"></i>
        <el-form-item class="dia-form" label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dia-form" label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="dia-form" label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
      </div>
    </el-dialog>
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
      userlist: [],
      //   添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getUserList();
  },
  
  methods: {
    // 编辑用户---显示消息盒子
    showEditUserDia(user) {
      console.log(user)
      this.form = user
      // 获取用户数据
      this.dialogFormVisibleEdit = true
    },
    // 删除用户--弹出框（打开消息盒子）
    showDeleUserMsgBox(userId) {
       this.$confirm('删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          // 发送删除请求---id指的是用户id
          // 1.data中找id
          // 2.调用方法时把userId以参数的形式传递过来
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res)
          if (res.status === 200) {
            this.pagenum = 1
            // 更新视图
            this.getUserList()
            // 提示删除成功
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //   添加用户-发送请求
    async addUser() {
        this.dialogFormVisibleAdd = false
        const res = await this.$http.post(`users`,this.form)
        console.log(res)
        const {meta:{status,msg},data} = res.data
        if (status === 201) {
            // 1、提示添加成功
            this.$message.success(msg)
            // 2、关闭对话框，写在外面也可以
            // 3、更新视图
            this.getUserList()
            // 4、清空文本框,赋值空对象和遍历都可以
            // [1]
            this.form = {}
            // [2]
            // for (const key in this.form) {
            //     if (this.form.hasOwnProperty(key)) {
            //         this.form[key] = ""
            //     }
            // }
            // [3]
            //  for (const key in this.form) {
            //     this.form[key] = ""
            // }
        } else {
            this.$message.warning(msg)
        }
    },
    //   点击添加用户按钮显示添加用户对话框
    showAddUserDia() {
        this.dialogFormVisibleAdd = true
    },
    //   搜索用户功能
    searchUser() {
      // 按照input输入框绑定的值query发送请求
      this.getUserList();
    },
    // 清空搜索框重新获取全部数据
    loadUserList() {
      this.getUserList();
    },
    //   分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
      console.log(`当前页: ${val}`);
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
        // this.$message.success(msg);
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
.dia-form {
    margin-right: 50px;
}
.el-icon-circle-close-outline {
  color: red;
  font-size: 10px;
  position: absolute;
  left: 50px;
  top: 97px;
}
</style>
