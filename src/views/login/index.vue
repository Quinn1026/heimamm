<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- form表单部分 -->
      <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="phone">
          <el-input placeholder="请输入手机号" v-model="loginForm.phone" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            prefix-icon="el-icon-search"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="16">
            <el-col :span="16">
              <el-input placeholder="请输入验证码" v-model="loginForm.code" prefix-icon="el-icon-search"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary">用户协议</el-link>和
          <el-link type="primary">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="submitForm('loginForm')">登陆</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
  </div>
</template>

<script>
import { setToken } from "@/utils/token.js";
export default {
  data() {
    return {
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      loginForm: {
        phone: "18511111111",
        password: "12345678",
        code: "",
        isCheck: true
      },
      rules: {
        phone: [
          {
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
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须勾选协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getCode() {
      this.codeURL =
        process.env.VUE_APP_BASEURL + "/captcha?type=login&r=" + Math.random();
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
        // 发送axios请求后台登陆
        this.$axios({
          method: "post",
          url: "/login",
          data: this.loginForm
        }).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message({
              message: "登陆成功",
              type: "success"
            });
            // 保存token
            setToken(res.data.data.token);
            // 跳转到layout
            this.$router.push({
              path: "/layout"
            });
          } else {
            this.$message.error(res.data.message);
            this.getCode();
          }
        });
      });
    }
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>