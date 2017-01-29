<template>
	<div class="outer">
		<div class="container" :class="color">
			<div class="ellipse" v-if="fun=='wild'">
				<div class="colorRect blue"></div>
				<div class="colorRect green"></div>
				<div class="colorRect red"></div>
				<div class="colorRect yellow"></div>
			</div>
			<div class="ellipse" v-else />
			<div class="mainNumber" v-if="type=='normal'">{{number}}</div>
			<div class="subNumber" v-if="type=='normal'">{{number}}</div>

			<div class="subNumber" v-if="fun=='wild draw four'">+4</div>
			<div class="subNumber" v-if="fun=='draw two'">+2</div>

			<div class="subNumber" v-if="fun=='reverse'">
				<img src="../assets/Reverse_icon.png" class="icon">
			</div>

			<div class="subNumber" v-if="fun=='skip'">
				<img src="../assets/Skip_icon.png" class="icon">
			</div>

			<div class="subNumber" v-if="fun=='wild'">
				<img src="../assets/Wild_icon.png" class="icon">
			</div>

			<div class="funIconContainer" v-if="fun">
				<img class="funIcon" src="../assets/WildDrawFour.png" v-if="fun=='wild draw four'">

				<img class="funIcon" src="../assets/Skip_red.png" v-if="fun=='skip'&&color=='red'">
				<img class="funIcon" src="../assets/Skip_green.png" v-if="fun=='skip'&&color=='green'">
				<img class="funIcon" src="../assets/Skip_blue.png" v-if="fun=='skip'&&color=='blue'">
				<img class="funIcon" src="../assets/Skip_yellow.png" v-if="fun=='skip'&&color=='yellow'">

				<img class="funIcon" src="../assets/Reverse_red.png" v-if="fun=='reverse'&&color=='red'">
				<img class="funIcon" src="../assets/Reverse_green.png" v-if="fun=='reverse'&&color=='green'">
				<img class="funIcon" src="../assets/Reverse_blue.png" v-if="fun=='reverse'&&color=='blue'">
				<img class="funIcon" src="../assets/Reverse_yellow.png" v-if="fun=='reverse'&&color=='yellow'">

				<img class="funIcon" src="../assets/DrawTwo_red.png" v-if="fun=='draw two'&&color=='red'">
				<img class="funIcon" src="../assets/DrawTwo_green.png" v-if="fun=='draw two'&&color=='green'">
				<img class="funIcon" src="../assets/DrawTwo_blue.png" v-if="fun=='draw two'&&color=='blue'">
				<img class="funIcon" src="../assets/DrawTwo_yellow.png" v-if="fun=='draw two'&&color=='yellow'">
			</div>
		</div>
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

	.ellipse {
		width: 135%;
		height: 50%;
		position: absolute;
		left: -17%;
		top: 25%;
		background-color: #fff;
		border-radius: 100%/100%;
		transform: rotate(-65deg);
		overflow: hidden;
	}

	.mainNumber {
		position: absolute;
		left: 0;
		right: 0;
		top: 25%;
		text-align: center;
		line-height: 100%;
		font-size: 0.75rem;
		font-weight: bold;
		text-shadow: 1.5px 1.5px 0 black;
	}

	.subNumber {
		position: absolute;
		top: 2%;
		left: 4%;
		width: 15%;
		height: 15%;
		color: white;
		font-weight: bold;
		font-size: 0.24rem;
	}

	.icon {
		width: 150%;
		height: 150%;
		object-fit: contain;
	}

	.funIconContainer {
		position: absolute;
		height: 50%;
		width: 80%;
		top: 20%;
		left: 5%;
	}

	.funIcon {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.colorRect {
		float: left;
		width: 50%;
		height: 50%;
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