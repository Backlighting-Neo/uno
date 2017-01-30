<template>
	<div class="outer" @click="emit">
		<div class="container">
			<img src="../assets/CardBack.png" class="img">
			<div class="Uno" v-if="hasUno">UNO</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'UnoCardBack',
  props: ['hasUno'],
  methods: {
  	emit() {
  		this.$emit('click')
  	}
  }
};
</script>

<style lang="css" scoped>
	.container {
		width: 100%;
		height: 100%;
		border-radius: 0.1rem;
		overflow: hidden;
		position: relative;
		background-color: black;
	}

	.outer {
		width: 1rem;
		height: 1.6rem;
		padding: 0.03rem;
		border-radius: 0.1rem;
		border: 0.01px solid black;
		background-color: #fff;
		transition: opacity 0.2s;
	}

	.img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.Uno {
		position: absolute;
		right: 0.15rem;
		bottom: 0.1rem;
		width: 0.7rem;
		height: 0.3rem;
		text-align: center;
		color: white;
		border-radius: 0.15rem; 
		font-size: 0.2rem;
		background-color: #23617a;
	}
</style>