<template>
  <div class="subject">
    <el-card shadow="always">
      <el-form :inline="true" :model="formSubject" class="formSubject" ref="formSubject">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="formSubject.rid" placeholder="学科编号"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="formSubject.name" placeholder="学科名称"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="formSubject.username" placeholder="创建者"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formSubject.status" placeholder="请选择状态">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="remove">清除</el-button>
          <el-button type="primary" @click="add">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="subjectList" style="width: 100%">
          <el-table-column label="序号" width="80" type="index"></el-table-column>
          <el-table-column prop="rid" label="学科编号"></el-table-column>
          <el-table-column prop="name" label="学科名称"></el-table-column>
          <el-table-column prop="short_name" label="简称"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column prop="create_time" label="创建日期"></el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status === 0 ? '#F56C6C':'#67C23A'}"
              >{{scope.row.status === 0 ? '禁用':'启用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit(scope.row)">编 辑</el-button>
              <el-button
                size="mini"
                @click="changeStatus(scope.row.id)"
                :type="scope.row.status === 1 ? 'info':'success'"
              >{{scope.row.status === 1 ? '禁用':'启用'}}</el-button>
              <el-button size="mini" type="danger">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[2, 3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <subject-edit ref="SubjectEdit"></subject-edit>
  </div>
</template>
    </el-card>
  </div>
</template>

<script>
import SubjectEdit from "./subject-add-updata";
export default {
  name: "subject",
  components: {
    SubjectEdit
  },
  data() {
    return {
      formSubject: {
        rid: "",
        name: "",
        username: "",
        status: ""
      },
      page: 1,
      limit: 2,
      subjectList: [],
      total: 0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    search() {
      this.page = 1;
      this.getData();
    },
    remove() {
      this.$refs.formSubject.resetFields();
      this.search();
    },
    add() {
      this.$refs.SubjectEdit.dialogVisible = true;
      this.$refs.SubjectEdit.subjectForm = {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      };
      this.$refs.SubjectEdit.mode = "add";
    },
    edit(row) {
      this.$refs.SubjectEdit.dialogVisible = true;
      this.$refs.SubjectEdit.mode = "edit";
      // this.$refs.SubjectEdit.subjectForm = JSON.parse(JSON.stringify(row));
      let { rid, name, short_name, intro, remark } = row;
      this.$refs.SubjectEdit.subjectForm = {
        rid,
        name,
        short_name,
        intro,
        remark
      };
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/subject/status", { id });
      // console.log(res);
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getData();
      }
    },
    async getData() {
      const res = await this.$axios.get("/subject/list", {
        params: { limit: this.limit, page: this.page, ...this.formSubject }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
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
    }
  }
};
</script>

<style lang="less">
.subject {
  .formSubject {
    input {
      width: 160px;
    }
  }
}
</style>