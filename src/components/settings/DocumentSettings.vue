<template>
  <div class="group">
    <div class="header">
      <h5>Документ</h5>
    </div>
    <div class="row">
    </div>

    <div class="row">
 
    </div>
    <div class="row">
    </div>
    <div class="row">
    </div>
    <div class="row">
    </div>
  </div>
</template>

<script>
export default {
  name: "DocumentSettings",
  props: { data: Document },
  data () {
    return {
      formats
    };
  }
};
</script>

<style lang="scss" scoped>
.fontFamilies {
  width: 150px;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
