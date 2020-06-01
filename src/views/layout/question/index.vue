<template>
  <div class="question">
    <el-card shadow="always">
      <el-form :model="questionForm" ref="questionForm" label-width="60px" class="questionForm">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="questionForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.rid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="questionForm.step" placeholder="请选择阶段" style="width:100%">
                <el-option v-for="(val,key) in stepList" :key="key" :label="val" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="questionForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.eid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="题型" prop="type">
              <el-select v-model="questionForm.type" placeholder="请选择题型">
                <el-option v-for="(val, key) in typeList" :key="key" :label="val" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="questionForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(val, key) in difficultyList"
                  :key="key"
                  :label="val"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者" prop="username">
              <el-input v-model="questionForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="questionForm.status" placeholder="请选择状态">
                <el-option
                  v-for="(value, name) in statusList"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="questionForm.create_date"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input v-model="questionForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="add">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="questionData" border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="题目">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column label="学科.阶段" :formatter="formatter"></el-table-column>
          <el-table-column label="题型" :formatter="typeFormatter"></el-table-column>
          <el-table-column prop="enterprise_name" label="企业"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status == 1 ? '#67C23A':'#F56C6C'}"
              >{{scope.row.status == 1 ? '启用':'禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="reads" label="访问量"></el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button
                :type="scope.row.status == 0 ? 'success':'info'"
                size="small"
                @click="changeStatus(scope.row.id)"
              >{{scope.row.status == 0 ? '启用':'禁用'}}</el-button>
              <el-button type="danger" size="small" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="margin-top:20px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 3, 4, 5]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <question-edit
      ref="questionEdit"
      :enterpriseList="enterpriseList"
      :subjectList="subjectList"
      :stepList="stepList"
      :typeList="typeList"
      :difficultyList="difficultyList"
    ></question-edit>
  </div>
</template>

<script>
import QuestionEdit from "./querstion-add-update";
export default {
  name: "question",
  components: {
    QuestionEdit
  },
  data() {
    return {
      questionData: [],
      subjectList: [],
      enterpriseList: [],
      stepList: { 1: "初级", 2: "中级", 3: "高级" },
      typeList: { 1: "单选", 2: "多选", 3: "问答" },
      difficultyList: { 1: "简单", 2: "一般", 3: "困难" },
      statusList: { 1: "启用", 0: "禁用" },
      questionForm: {
        subject: "",
        step: "",
        enterprise: "",
        type: "",
        difficulty: "",
        username: "",
        status: "",
        create_date: "",
        title: ""
      },
      page: 1,
      limit: 2,
      total: 0
      // rules: {
      //   subject: [{ required: true, message: "请选择学科", trigger: "change" }],
      //   step: [{ required: true, message: "请选择阶段", trigger: "change" }],
      //   enterprise: [
      //     { required: true, message: "请选择企业", trigger: "change" }
      //   ],
      //   type: [{ required: true, message: "请选择题型", trigger: "change" }],
      //   difficulty: [
      //     { required: true, message: "请选择难度", trigger: "change" }
      //   ],
      //   username: [{ required: true, message: "请输入作者", trigger: "blur" }],
      //   status: [{ required: true, message: "请选择状态", trigger: "change" }],
      //   create_date: [
      //     {
      //       type: "string",
      //       required: true,
      //       message: "请选择日期",
      //       trigger: "change"
      //     }
      //   ],
      //   title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      // }
    };
  },
  created() {
    this.getSubjectList();
    this.getEnterpriseList();
    this.getQuestionList();
  },
  methods: {
    search() {
      this.page = 1;
      this.getQuestionList();
    },
    clear() {
      this.$refs.questionForm.resetFields();
      this.search();
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/question/status", { id });
      if (res.data.code === 200) {
        // 提示
        this.$message({
          type: "success",
          message: "更改状态成功~"
        });
        // 刷新当前页
        this.getQuestionList();
      }
    },
    remove(id) {
      this.$confirm("确定删除该条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/question/remove", { id });
          if (res.data.code === 200) {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功~"
            });
            // 从第一页数据加载
            this.search();
          }
        })
        .catch(() => {});
    },
    add() {
      this.$refs.questionEdit.dialogVisible = true;
      this.$refs.questionEdit.mode = "add";
      this.$refs.questionEdit.formQuestion = {
        subject: "",
        step: "",
        enterprise: "",
        city: "",
        type: 1,
        difficulty: 1,
        title: "",
        single_select_answer: "", // 单选答案
        multiple_select_answer: [], // 多选答案
        short_answer: "", // 简答答案
        answer_analyze: "", // 答案解析
        remark: "", // 答案备注
        video: "",
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ]
      };
    },
    edit(row) {
      this.$refs.questionEdit.formQuestion = JSON.parse(JSON.stringify(row));
      if (row.city) {
        this.$refs.questionEdit.formQuestion.city = row.city.split(",");
      } else {
        this.$refs.questionEdit.formQuestion.city = [];
      }
      if (row.multiple_select_answer) {
        this.$refs.questionEdit.formQuestion.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      } else {
        this.$refs.questionEdit.formQuestion.multiple_select_answer = [];
      }
      this.$refs.questionEdit.dialogVisible = true;
      this.$refs.questionEdit.mode = "edit";
    },
    formatter(row) {
      return row.subject_name + "." + this.stepList[row.step];
    },
    typeFormatter(row) {
      return this.typeList[row.type];
    },
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    async getEnterpriseList() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    async getQuestionList() {
      const res = await this.$axios.get("/question/list", {
        params: { page: this.page, limit: this.limit, ...this.questionForm }
      });
      if (res.data.code == 200) {
        // console.log(res.data);
        this.questionData = res.data.data.items;
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
      this.getQuestionList();
    }
  }
};
</script>

<style>
</style>