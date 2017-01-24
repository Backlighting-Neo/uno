<template>
  <div id="app">
    <UnoCard type="normal" color="red" number="4" />
  </div>
</template>

<script>
import UnoCard from './components/UnoCard';

export default {
  name: 'app',
  components: {
    UnoCard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
