<template>
  <div class="questionType">
    <div v-if="formQuestion.type == 1">
      <div v-for="item in formQuestion.select_options" :key="item.label" class="item">
        <!-- radio -->
        <el-radio
          v-model="formQuestion.single_select_answer"
          :label="item.label"
          @change="changeValue"
        >{{item.label}}</el-radio>
        <!-- input -->
        <el-input v-model="item.text"></el-input>
        <!-- img -->
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-else-if="formQuestion.type == 2">
      <div v-for="item in formQuestion.select_options" :key="item.label" class="item">
        <!-- checkbox  -->
        <el-checkbox
          v-model="formQuestion.multiple_select_answer"
          :label="item.label"
          @change="changeValue"
        >{{item.label}}</el-checkbox>
        <!-- input -->
        <el-input v-model="item.text" style="margin-left:15px"></el-input>
        <!-- img -->
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-else>
      <el-input
        @change="changeValue"
        type="textarea"
        :rows="8"
        placeholder="请输入内容"
        v-model="formQuestion.short_answer"
      ></el-input>
    </div>
  </div>
</template>

<script>
// 导入文件上传组件
import UploadFile from "./upload-file";
export default {
  name: "questionType",
  props: ["formQuestion"],
  components: {
    UploadFile
  },
  methods: {
    changeValue() {
      this.$emit("childChange");
    }
  }
};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>