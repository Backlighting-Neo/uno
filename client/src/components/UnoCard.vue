<template>
	<div class="container" :class="color">
		<div class="ellipse"></div>
		<div class="mainNumber">{{number}}</div>
		<div class="subNumber">{{number}}</div>
	</div>
</template>

<script>
export default {

  name: 'UnoCard',

  props: ['type', 'color', 'number', 'fun'],

  data () {
    return {

    };
  }
};
</script>

<style lang="css" scoped>
	.container {
		width: 70px;
		height: 110px;
		border-radius: 5px;
		border: 1px solid black;
		overflow: hidden;
		position: relative;
	}

	.ellipse {
		width: 120%;
		height: 50%;
		position: absolute;
		left: -10%;
		top: 25%;
		background-color: #fff;
		border-radius: 100%/100%;
		transform: rotate(-40deg);
	}

	.mainNumber {
		position: absolute;
		left: 0;
		right: 0;
		top: 33%;
		text-align: center;
		line-height: 100%;
		font-size: 250%;
		font-weight: bold;
		text-shadow: 1.5px 1.5px 0 black;
	}

	.subNumber {
		position: absolute;
		top: 2%;
		left: 4%;
		color: white;
		font-weight: bold;
	}

	.red {
		background-color: #f70302;
		color: #f70302;
	}

	.green {
		background-color: #049933;
		color: #049933;
	}

	.yellow {
		background-color: #fffb0f;
		color: #fffb0f;
	}

	.blue {
		background-color: #0492de;
		color: #0492de;
	}
</style>