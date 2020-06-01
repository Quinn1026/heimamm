<template>
  <div>
    这是父组件
    <br />
    <br />
    <br />
    <br />
    <my-table :data="list">
      <template slot-scope="scope">
        <span
          :style="{color:scope.row.status == 1 ? 'green':'red'}"
        >{{scope.row.status == 1 ? '启用':'禁用'}}</span>
      </template>
    </my-table>
  </div>
</template>

<script>
import MyTable from "./MyTable";
export default {
  data() {
    return {
      list: [
        { id: 1, name: "腾讯", city: "shenzhen", status: 1 },
        { id: 2, name: "华为", city: "shenzhen", status: 0 },
        { id: 3, name: "大疆", city: "shenzhen", status: 1 }
      ]
    };
  },
  components: {
    MyTable
  }
};
</script>

<style>
</style>