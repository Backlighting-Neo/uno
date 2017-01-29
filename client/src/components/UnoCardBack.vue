<template>
	<div class="outer">
		<div class="container" :class="color" :style="style">
			<img src="../assets/CardBack.png" class="img">
		</div>
	</div>
</template>

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
	}

	.img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>