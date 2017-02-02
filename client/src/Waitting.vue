<template>
	<div class="container">
		<div class="title">房间号</div>
		<div class="gameID">{{$route.params.game_id}}</div>
		<div class="playerNum">当前 {{player.length}} 人</div>

		<div class="playerList">
			<div class="playerRow" v-for="(playerItem, index) in player">
				<img src="./assets/AvatarEmpty.png" class="avatar">
				<span class="playerName" >{{index===masterPlayerIndex?'[房主] ':''}}{{playerItem.name}}</span>
			</div>
		</div>

		<div class="button" @click="startGame" v-if="playerIndex===masterPlayerIndex">开始</div>
		<div class="waitting" v-else>等待房主开始游戏 ......</div>
	</div>
</template>

<script>
import utils from './utils.js';

export default {

  name: 'Waitting',

  methods: {
  	handleStatus(status) {
  		['player', 'masterPlayerIndex', 'playerIndex'].forEach(key=>{
  			this[key] = status[key];
  		})
  	},

  	startGame() {
  		if(this.player.length<3) {
  			alert('最少3个人才能开始游戏~'); return;
  		}
  		if(this.player.length>8) {
  			alert('最多8个人才能开始游戏~'); return;
  		}

  		utils.ajax('/uno/game/start')
  		.then(res=>{
  			this.$router.push('/game/'+window.localStorage.gameID);
  		})
  	}
  },

  created() {
  	utils.ajax('/uno/game/status')
  	.then(res=>{
  		this.handleStatus(res.status);

  		let gameID = window.localStorage.gameID;
  		let userID = window.localStorage.uno_userToken;
  		window.game_socket = new WebSocket(utils.webscoketServer+`/?gameID=${gameID}&userID=${userID}`);

  		window.game_socket.onmessage = message=>{
  		  message = JSON.parse(message.data);
  		  this.handleStatus(message.status);
  		  if(message.action && message.action.type == 'start') 
  		  	this.$router.push('/game/'+window.localStorage.gameID);
  		};
  	});
  },

  data() {
    return {
			"player": [],
			"masterPlayerIndex": -1,
			"playerIndex": -2,
    };
  }
};
</script>

<style lang="css" scoped>
.container {
	color: white;
	position: relative;
	height: 100%;
}

.gameID {
	text-align: center;
	font-size: 1.5rem;
}

.title {
	font-size: 0.6rem;
	text-align: center;
	margin-top: 0.5rem;
}

.playerNum {
	text-align: center;
	font-size: 0.4rem;
}

.playerList {
	margin: 1rem 0.7rem 0;
}

.playerRow {
	text-align: center;
	margin-bottom: 0.2rem;
	height: 0.8rem;
	width: 3rem;
	float: left;
	line-height: 0.8rem;
	display: flex;
	align-items: center;
}

.avatar {
	width: 0.6rem;
	height: 0.6rem;
}

.playerName {
	font-size: 0.3rem;
	margin-left: 0.2rem;
	width: 2rem;
	overflow : hidden;
  display: -webkit-box;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.button {
	position: absolute;
	bottom: 1.5rem;
	left: 0;
	margin-left: 2.8rem;
	width: 1.5rem;
	height: 0.8rem;
	line-height: 0.8rem;
	padding: 0.1rem 0.2rem;
	text-align: center;
	color: white;
	border-radius: 0.5rem; 
	font-size: 0.4rem;
	background-color: #23617a;
}

.waitting {
	position: absolute;
	bottom: 1.5rem;
	left: 0;
	right: 0;
	text-align: center;
	color: white;
	font-size: 0.3rem;
}
</style>