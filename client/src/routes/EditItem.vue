<template>
  <div id="editItem">ITEM {{item.itemNumber}}</div>
</template>

<script>
export default {
  name: "EditItem",
  data() {
    return {
      index: this.$route.params.index,
      lineIndex: this.$route.params.lineIndex
    };
  },
  computed: {
    item() {
      console.log(lineIndex, index);
    }
  }
};
</script>