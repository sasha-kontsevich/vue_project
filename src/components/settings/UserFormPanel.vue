<template>
  
  <div class="" v-for="(rule, k) in data.rules" :key="k">
    <RuleUserForm
      :data="rule"
    ></RuleUserForm>
  </div>
 
</template>

<script>
import Document from "@/classes/DocumentTemplate";
import RuleUserForm from "../RuleUserForm.vue";
//import Rule from "@/classes/RuleElement";
export default {
  name: "UserFormPanel",
  props: { data: Document },
  components: { RuleUserForm }
};

</script>

<style scoped>
.rule-str-block {
  display: flex;
  flex-direction: column;
}
</style>
