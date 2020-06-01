<template>
  <div class="enterprise">
    <el-card shadow="always">
      <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model.trim="formSearch.eid" placeholder></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model.trim="formSearch.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model.trim="formSearch.username" placeholder></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formSearch.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button @click="add" type="primary" icon="el-icon-plus">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <template>
        <el-table :data="enterpriseList" stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="eid" label="企业编号"></el-table-column>
          <el-table-column prop="name" label="企业名称"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column prop="create_time" label="创建日期"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status === 0 ? 'red' : 'green'}"
              >{{scope.row.status === 0 ? '禁用' : '启用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="changeStatus(scope.row.id)"
              >{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>
              <el-button type="text" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:20px; text-align:center">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <enterprise-edit ref="EnterpriseEdit"></enterprise-edit>
  </div>
</template>

<script>
import EnterpriseEdit from "./enterprise-add-updata";
export default {
  name: "enterprise",
  components: {
    EnterpriseEdit
  },
  data() {
    return {
      formSearch: {
        eid: "",
        name: "",
        username: "",
        status: ""
      },
      page: 1, // 查询时的页码
      limit: 2, // 每页多少条
      enterpriseList: [], // 企业列表数据
      total: 0 // 总数
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.get("/enterprise/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.formSearch
        }
      });
      console.log(res.data);
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getData();
    },
    search() {
      this.page = 1; // 搜索从第一页开始
      this.getData();
    },
    add() {
      this.$refs.EnterpriseEdit.dialogVisible = true;
      this.$refs.EnterpriseEdit.mode = "add";
      this.$refs.EnterpriseEdit.ruleForm = {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      };
    },
    clear() {
      this.$refs.formSearch.resetFields();
      this.search();
    },
    edit(data) {
      this.$refs.EnterpriseEdit.dialogVisible = true;
      this.$refs.EnterpriseEdit.mode = "edit";
      this.$refs.EnterpriseEdit.id = data.id;
      this.$refs.EnterpriseEdit.ruleForm = JSON.parse(JSON.stringify(data));
    },
    remove(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/enterprise/remove", { id });
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
    async changeStatus(id) {
      const res = await this.$axios.post("/enterprise/status", { id });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功~",
          type: "success"
        });
        this.getData();
      }
    }
  }
};
</script>

<style lang="less">
.enterprise {
  .demo-form-inline {
    input {
      width: 160px;
    }
  }
}
</style>