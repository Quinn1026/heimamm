<template>
  <el-dialog :visible.sync="dialogVisible">
    <div slot="title" class="dialog-header">注册</div>
    <el-form
      class="register-form"
      label-width="100px"
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
    >
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadAction"
          name="image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input placeholder="请输入昵称" v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input placeholder="请输入手机号" v-model="registerForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" show-password v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item label="图形码" prop="code">
        <el-row>
          <el-col :span="17">
            <el-input placeholder="请输入验证码" v-model="registerForm.code"></el-input>
          </el-col>
          <el-col :span="6" style="height:40px">
            <img class="captcha" @click="changeCodeURL" :src="codeURL" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="rcode">
        <el-row>
          <el-col :span="17">
            <el-input v-model="registerForm.rcode"></el-input>
          </el-col>
          <el-col :span="6" style="margin-left:15px">
            <el-button @click="getRcode">获取用户验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button @click="dialogVisible = false" style="width:100%">取 消</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="submit" style="width:100%">注 册</el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads",
      imageUrl: "",
      dialogVisible: false,
      registerForm: {
        avatar: "",
        username: "",
        email: "",
        phone: "18511111121",
        password: "",
        code: "",
        rcode: ""
      },
      rules: {
        avatar: [{ required: true, message: "请添加头像", trigger: "change" }],
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
        password: [
          { required: true, message: "必须输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "必须输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "长度必须是4位",
            trigger: "blur"
          }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("验证码不能为空"));
              }
              if (!Number.isInteger(value)) {
                return callback(new Error("验证码为数字"));
              }
              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getRcode() {
      let res = await this.$axios({
        method: "post",
        url: "/sendsms",
        data: {
          code: this.registerForm.code,
          phone: this.registerForm.phone
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        let code = res.data.data.captcha;
        this.$message("验证码: " + code);
        this.registerForm.rcode = code;
      } else {
        this.changeCodeURL();
        this.$message.error(res.data.message);
      }
    },
    changeCodeURL() {
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&r=" +
        Math.random();
    },
    handleAvatarSuccess(res, file) {
      // console.log(res);
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerForm.avatar = res.data.file_path; //用于提交给后台的头像地址
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submit() {
      //提交数据 最后对整个表单校验
      this.$refs.registerForm.validate(async valid => {
        if (!valid) return;
        const res = await this.$axios({
          method: "post",
          url: "/register",
          data: this.registerForm
        });
        if (res.data.code == 200) {
          this.$message({
            message: "注册成功",
            type: "success"
          });
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.register-form {
  .avatar-uploader {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .captcha {
    margin-left: 15px;
    height: 40px;
  }
}
</style>