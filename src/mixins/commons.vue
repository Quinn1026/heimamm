<script>
export default {
  methods: {
    async changeStatus(url, id) {
      const res = await this.$axios.post(url, { id });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功~",
          type: "success"
        });
        this.search();
      }
    }
  }
};
</script>