<template>
  <el-dialog :visible.sync="dialogVisible" center width="30%">
    <span slot="title">{{mode == 'add' ? '新增学科':'编辑学科'}}</span>
    <el-form
      :model="subjectForm"
      status-icon
      :rules="rules"
      ref="subjectForm"
      label-width="100px"
      class="subjectForm"
    >
      <el-form-item label="学科编号" prop="rid">
        <el-input v-model="subjectForm.rid"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="subjectForm.name"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" prop="short_name">
        <el-input v-model.number="subjectForm.short_name"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" prop="intro">
        <el-input v-model.number="subjectForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" prop="remark">
        <el-input v-model.number="subjectForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "subjectEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "",
      id: "",
      subjectForm: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      rules: {
        rid: [{ required: true, message: "请输入学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入学科名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入学科简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入学科简介", trigger: "blur" }],
        remark: [{ required: true, message: "请输入学科备注", trigger: "blur" }]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) this.$refs.subjectForm.clearValidate();
    }
  },
  methods: {
    submit() {
      // 先校验表单
      this.$refs.subjectForm.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/subject/add", this.subjectForm);
        } else {
          res = await this.$axios.post("/subject/edit", {
            id: this.id,
            ...this.subjectForm
          });
        }
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: this.mode == "add" ? "添加成功!" : "编辑成功"
          });
          this.$parent.search();
          this.dialogVisible = false;
        }
      });
    }
  }
};
</script>

<style>
</style>