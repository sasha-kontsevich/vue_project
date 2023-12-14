<template>
<MainView/>
</template>

<script>
import MainView from './views/MainView.vue';
export default {
  name: 'AppView',
  components: {
    MainView
  },
  
}
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /*

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  font-family: sans-serif;
  width: 100%;
  min-height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: 0px 1fr;
  grid-template-rows: 0px 1fr;
  grid-template-areas:
    "Sidebar Header"
    "Sidebar Editor";
  & > .document-editor {
    grid-area: Editor;
  }
} */
</style>
