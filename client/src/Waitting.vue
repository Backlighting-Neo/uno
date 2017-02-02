<template>
	<div class="container">
		<div class="title">房间号</div>
		<div class="gameID">{{$route.params.game_id}}</div>
		<div class="playerNum">当前 6 人</div>
	</div>
</template>

<script>
export default {

  name: 'Waitting',

  data () {
    return {

    };
  }
};
</script>

<style lang="css" scoped>
.gameID {
	text-align: center;
	color: white;
	font-size: 1.5rem;
}

.title {
	color: white;
	font-size: 0.6rem;
	text-align: center;
	margin-top: 0.5rem;
}
</style>