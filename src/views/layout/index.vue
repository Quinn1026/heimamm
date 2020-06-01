<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i class="el-icon-s-fold" style="font-size:24px" @click="isCollapse = !isCollapse"></i>
        <img src="@/assets/layout_icon.png" alt class="marginlr" />
        <div class="title">黑马面面</div>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <b class="name">{{$store.getters.getUserInfo.username}},你好</b>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
        >
          <el-menu-item
            v-for="item in $router.options.routes[2].children"
            :key="item.path"
            v-show="item.meta.roles.includes($store.getters.getUserInfo.role)"
            :index="item.meta.fullPath"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
          <!-- <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>-->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token.js";
export default {
  data() {
    return {
      avatar: "",
      username: "",
      isCollapse: false,
      defaultActive: "/layout/user"
    };
  },
  methods: {
    async getInfo() {
      const res = await this.$axios({
        method: "get",
        url: "/info"
      });
      if (res.data.code == 200) {
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
        this.username = res.data.data.username;
        this.$store.commit("setUserInfo", res.data.data);
      }
    },
    logout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "get",
            url: "/logout"
          });
          if (res.data.code == 200) {
            // 删除token 并跳转到登录页
            removeToken();
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  },
  created() {
    this.defaultActive = this.$route.fullPath;
    this.getInfo();
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border: 0;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>