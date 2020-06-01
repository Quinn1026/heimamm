<template>
  <table style="width:50%;border:1px">
    <tr>
      <th>id</th>
      <th>name</th>
      <th>city</th>
      <th>status</th>
    </tr>
    <tr v-for="(item, index) in data" :key="index">
      <td>{{item.id}}</td>
      <td>{{item.name}}</td>
      <td>{{item.city}}</td>
      <td>
        <slot :row="item" />
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ["data"]
};
</script>

<style>
</style>