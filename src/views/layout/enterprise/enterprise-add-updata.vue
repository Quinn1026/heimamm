<template>
  <el-dialog :visible.sync="dialogVisible" width="600px" center>
    <span slot="title" class="dialog-header">{{mode == 'add'? '新增企业': '编辑企业'}}</span>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model="ruleForm.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short_name">
        <el-input v-model="ruleForm.short_name"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model="ruleForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
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
  name: "enterpriseEdit",
  watch: {
    dialogVisible: function(newValue, oldValue) {
      this.$nextTick(() => {
        if (newValue) this.$refs.ruleForm.clearValidate();
      });
    }
  },
  data() {
    return {
      dialogVisible: false,
      mode: "",
      ruleForm: {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      id: "",
      rules: {
        eid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }],
        remark: [{ required: true, message: "请输入企业备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      // 先做表单校验
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/enterprise/add", this.ruleForm);
        } else {
          res = await this.$axios.post("/enterprise/edit", {
            id: this.id,
            ...this.ruleForm
          });
        }
        console.log(res.data);
        if (res.data.code == 200) {
          // 提示
          this.$message({
            message: this.mode === "add" ? "新增成功~" : "编辑成功~",
            type: "success"
          });
          // 重置表单
          this.$refs.ruleForm.resetFields();
          // 关闭对话框 并刷新数据
          this.dialogVisible = false;
          this.$parent.search();
        }
      });
    }
  }
};
</script>

<style>
</style>