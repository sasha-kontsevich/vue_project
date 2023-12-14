export default {
  methods: {
    setCssVar (variable, value) {
      const root = document.querySelector(":root");
      root.style.setProperty(variable, value);
    },
    sleep (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }
};
