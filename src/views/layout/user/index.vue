<template>
  <div>
    <el-card shadow="always">
      <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model.trim="formSearch.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model.trim="formSearch.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="formSearch.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="教师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button @click="add" type="primary" icon="el-icon-plus">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="userList" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color:red;">禁用</span>
              <span v-if="scope.row.status === 1" style="color:green;">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button
                @click="changeStatus('/user/status',scope.row.id)"
                :type="scope.row.status === 0 ? 'success' : 'info'"
              >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button>
              <!-- <el-button
                @click="changeStatus(scope.row.id)"
                :type="scope.row.status === 0 ? 'success' : 'info'"
              >{{scope.row.status === 0 ? "启用" : "禁用"}}</el-button>-->
              <el-button type="primary" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:15px; text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <user-edit ref="userEdit"></user-edit>
  </div>
</template>

<script>
import UserEdit from "./user-add-update";
// 导入混入公共对象
import commons from "@/mixins/commons";
export default {
  name: "user",
  mixins: [commons], // 合并混入对象
  components: {
    UserEdit
  },
  data() {
    return {
      formSearch: {
        username: "",
        email: "",
        role_id: ""
      },
      page: 1, // 查询时的页码
      limit: 2, // 每页多少条
      userList: [], // 展示的数据
      total: 0 // 总条数
    };
  },
  created() {
    this.getUserListData();
  },
  methods: {
    // async changeStatus(id) {
    //   const res = await this.$axios.post("/user/status", { id });
    //   if (res.data.code == 200) {
    //     this.$message({
    //       message: "更改状态成功~",
    //       type: "success"
    //     });
    //     this.search();
    //   }
    // },
    remove(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/user/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              message: "删除成功~",
              type: "success"
            });
            this.search();
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getUserListData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserListData();
    },
    search() {
      this.page = 1; // 搜索从第一页开始
      this.getUserListData();
    },
    add() {
      this.$refs.userEdit.editForm = {
        username: "",
        email: "",
        phone: "",
        role_id: "",
        status: "",
        remark: ""
      };
      this.$refs.userEdit.dialogVisible = true;
      this.$refs.userEdit.mode = "add";
      this.$nextTick(() => {
        // this.$refs.userEdit.$refs.editForm.resetFields();
        this.$refs.userEdit.$refs.editForm.clearValidate();
      });
    },
    clear() {
      this.$refs.formSearch.resetFields();
      this.search();
    },
    edit(row) {
      this.$refs.userEdit.dialogVisible = true;
      this.$refs.userEdit.mode = "edit";
      this.$refs.userEdit.editForm = JSON.parse(JSON.stringify(row));
      this.$nextTick(() => {
        this.$refs.userEdit.$refs.editForm.clearValidate();
      });
    },
    async getUserListData() {
      const res = await this.$axios.get("/user/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.formSearch
        }
      });
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    }
  }
};
</script>

<style>
</style>