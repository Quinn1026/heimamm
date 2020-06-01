<template>
  <el-dialog :visible.sync="dialogVisible" center width="600px">
    <div slot="title" class="dialog-header">{{mode == "add" ? "新增用户" : "编辑用户"}}</div>
    <el-form
      class="register-form"
      label-width="100px"
      :model="editForm"
      :rules="rules"
      ref="editForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input placeholder="请输入电话" v-model="editForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="editForm.role_id" placeholder="请选择角色">
          <el-option label="超级管理员" :value="1"></el-option>
          <el-option label="管理员" :value="2"></el-option>
          <el-option label="教师" :value="3"></el-option>
          <el-option label="学生" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="editForm.status" placeholder="请选择状态">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="remark">
        <el-input v-model="editForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "userEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "", // 是新增add还是编辑edit
      editForm: {
        username: "",
        email: "",
        phone: "",
        role_id: "",
        status: "",
        remark: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("邮箱不能为空"));
              }
              const reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
              if (!reg.test(value)) {
                return callback(new Error("邮箱不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }
              const reg = /^1[35789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("请输入正确的手机号"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        role_id: [{ required: true, message: "请选择角色", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      // 先做校验
      this.$refs.editForm.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          // 新增用户
          res = await this.$axios.post("/user/add", this.editForm);
        } else {
          // 编辑用户
          res = await this.$axios.post("/user/edit", this.editForm);
        }
        if (res.data.code == 200) {
          // 提示
          this.$message({
            message: this.mode === "add" ? "新增成功~" : "编辑成功~",
            type: "success"
          });
          // 重置表单
          this.$refs.editForm.resetFields();
          // 关闭dialog 并刷新数据
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