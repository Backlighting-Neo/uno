<template>
	<div class="container">
		<UnoCardBack :winPosition="2" />
	</div>
</template>

<script>
import UnoCardBack from './components/UnoCardBack.vue';

export default {
  name: 'Test',

  components: {
  	UnoCardBack
  },

  data () {
    return {
    };
  },

  created() {
  }
};
</script>

<style lang="css" scoped>
	
</style>