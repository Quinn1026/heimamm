<template>
  <el-dialog :visible.sync="dialogVisible" fullscreen>
    <div slot="title" class="dialogHeader">{{mode == 'add' ? '新增试题':'编辑试题'}}</div>
    <div class="dialogBody">
      <el-form
        :model="formQuestion"
        ref="formQuestionRef"
        class="formQuestion"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="学科" prop="subject">
          <el-select v-model="formQuestion.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="formQuestion.step" placeholder="请选择阶段">
            <el-option v-for="(value,name) in stepList" :key="name" :label="value" :value="+name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="formQuestion.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :props="{ value: 'label' }"
            :options="options"
            v-model="formQuestion.city"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="formQuestion.type">
            <el-radio :label="+name" v-for="(value,name) in typeList" :key="name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="formQuestion.difficulty">
            <el-radio :label="+name" v-for="(value,name) in difficultyList" :key="name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr style="margin-bottom:15px" />
        <el-form-item label="标题" prop="title" class="setMargin">
          <quill-editor
            v-model="formQuestion.title"
            :options="editorOption"
            @change="onEditorChange('title')"
          ></quill-editor>
        </el-form-item>
        <hr style="margin-bottom:15px" />
        <el-form-item
          :label="typeList[formQuestion.type]"
          :prop="questionTypeValidate[formQuestion.type]"
        >
          <question-type :formQuestion="formQuestion" @childChange="childValidate"></question-type>
        </el-form-item>
        <el-form-item label="视频解析">
          <upload-file type="video" v-model="formQuestion.video"></upload-file>
        </el-form-item>
        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <quill-editor
            v-model="formQuestion.answer_analyze"
            :options="editorOption"
            @change="onEditorChange('answer_analyze')"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="formQuestion.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { regionData } from "element-china-area-data";
// 导入富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
// 导入问题类型组件
import questionType from "./question-type";
// 导入文件上传组件
import UploadFile from "./upload-file";

export default {
  name: "questionEdit",
  components: {
    quillEditor,
    questionType,
    UploadFile
  },
  props: {
    subjectList: Array,
    enterpriseList: Array,
    stepList: Object,
    typeList: Object,
    difficultyList: Object
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.formQuestionRef.clearValidate();
      }
    },
    "formQuestion.type"(newValue) {
      this.$nextTick(() => {
        this.childValidate();
      });
    }
  },
  methods: {
    onEditorChange(value) {
      this.$refs.formQuestionRef.validateField(value);
    },
    childValidate() {
      // console.log("-----------------");
      this.$refs.formQuestionRef.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    },
    submit() {
      this.$refs.formQuestionRef.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/question/add", this.formQuestion);
        } else {
          this.formQuestion.city = this.formQuestion.city.join(",");
          res = await this.$axios.post("/question/edit", this.formQuestion);
        }
        // console.log(res);
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: this.mode === "add" ? "新增成功~" : "编辑成功~"
          });
          // 关闭当前对话框
          this.dialogVisible = false;
          this.$parent.search();
        }
      });
    }
  },
  data() {
    return {
      mode: "",
      dialogVisible: false,
      options: regionData,
      editorOption: {
        placeholder: "请在这里输入..."
      },
      questionTypeValidate: {
        1: "single_select_answer",
        2: "multiple_select_answer",
        3: "short_answer"
      },
      formQuestion: {
        subject: "",
        step: "",
        enterprise: "",
        city: "",
        type: "1",
        difficulty: "1",
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
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "change" }
        ],
        remark: [
          { required: true, message: "答案备注不能为空", trigger: "blur" }
        ],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "change" }
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "change" }
        ],
        short_answer: [
          { required: true, message: "简答答案不能为空", trigger: "change" }
        ]
      }
    };
  }
};
</script>

<style lang="less">
.dialogBody {
  width: 830px;
  margin: 0 auto;
  // .quill-editor {
  //   width: 100%;
  // }

  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
      line-height: normal;
    }
  }
  .ql-container {
    height: 150px;
  }
}
</style>