<template>
	<div class="outer win" v-if="winPosition>0">
		<img src="../assets/WinMark_1.png" class="winMark" v-if="winPosition===1">
		<img src="../assets/WinMark_2.png" class="winMark" v-if="winPosition===2">
		<img src="../assets/WinMark_3.png" class="winMark" v-if="winPosition===3">
		<img src="../assets/WinMark.png" class="winMark" v-if="winPosition>3">
	</div>
	<div class="outer" @click="emit" v-else>
		<div class="container">
			<img src="../assets/CardBack.png" class="img">
			<div class="Uno" v-if="hasUno">UNO</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'UnoCardBack',
  props: ['winPosition', 'hasUno'],
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

	.win {
		border: 1px dashed white;
		background-color: transparent;
	}

	.winMark {
		width: 0.9rem;
		height: 0.9rem;
		margin-top: 0.35rem;
		margin-left: 0.05rem;
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
		line-height: 0.3rem;
		text-align: center;
		color: white;
		border-radius: 0.15rem; 
		font-size: 0.2rem;
		background-color: #23617a;
	}
</style>