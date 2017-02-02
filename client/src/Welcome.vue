<template>
	<div class="container">
		<UnoCardBack class="logo" :style="{transform: 'scale(2) rotate('+Math.random()*30+'deg)'}" v-for="index in 5" />

		<div class="nameInputArea" v-if="stage===0">
			<div class="nameTitle">昵称</div>
			<input type="text" class="input" placeholder="笨小兔" v-model="inputName" />
			<div class="button" @click="handleClickConfirmButton">确定</div>
		</div>

		<div class="commandArea" v-if="stage===1">
			<div class="button_large" @click="handleClickCreateRoom">开始一个新的Uno游戏</div>
			<div class="button_large" @click="handleJoinRoom">加入朋友们的游戏</div>
			<div class="username">{{inputName}}</div>
		</div>

		<div class="tips">给笨小兔的新年礼物</div>
	</div>
</template>

<script>
import utils from './utils.js';

import UnoCardBack from './components/UnoCardBack.vue';

var confirmLock = false;

export default {

  name: 'Welcome',

  components: {
  	UnoCardBack
  },

  data () {
    return {
    	inputName: '',
    	stage: 0
    };
  },

  methods: {
  	handleClickConfirmButton() {
  		if(confirmLock) return;

  		if(this.inputName === '') {
  			alert('填个昵称呗~');
  			return;
  		}

  		confirmLock = true;

  		utils.ajax('/uno/game/register?player_name='+this.inputName)
  		.then(res=>{
  			confirmLock = false;
  			window.localStorage.uno_username = this.inputName;
  			window.localStorage.uno_userToken = res.token;
  			this.stage = 1;
  		})
  	},

  	handleClickCreateRoom() {
  		utils.ajax('/uno/game/create')
  		.then(res=>{
  			this.$router.push('/waitting/'+res.gameID);
  		})
  	},

  	handleJoinRoom() {
  		var gameID = window.prompt('请输入房间号');
  		if(!/^\d{5}$/.test(gameID)) {
  			alert('房间号好像不对哦……');
  			return;
  		}
  		utils.ajax('/uno/game/exist_room?game_id='+gameID)
  		.then(res=>{
  			if(!res.exist)
  				alert('房间不存在');
  			else
  				this.$router.push('/waitting/'+gameID);
  		})
  	}
  },

  created() {
  	confirmLock = false;
  	if(window.localStorage.uno_username) {
  		this.inputName = window.localStorage.uno_username;

  		utils.ajax('/uno/game/exist_token')
  		.then(res=>{
  			if(res.exist)
  				this.stage = 1;
  			else {
  				this.handleClickConfirmButton();
  			}
  		})
  		
  	}
  }
};
</script>

<style lang="css" scoped>
.container {
	height: 100%;
	position: relative;
}

.logo {
	position: absolute;
	top: 20%;
	left: 50%;
	margin-left: -0.5rem;
}

.nameInputArea, .commandArea {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
}

.nameTitle {
	color: white;
	font-size: 0.4rem;
	text-align: center;
}

.input {
	width: 50%;
	margin-left: 25%;
	background-color: transparent;
	text-align: center;
	font-size: 0.5rem;
	border-top: none;
	border-left: none;
	border-right: none;
	padding: 0.1rem 0 ;
	border-bottom: 1px solid white;
	outline: none;
	color: white;
}

.button {
	margin-left: 2.8rem;
	margin-top: 0.5rem;
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

.button_large {
	margin-left: 1.2rem;
	margin-top: 0.5rem;
	width: 4.9rem;
	height: 0.8rem;
	line-height: 0.8rem;
	padding: 0.1rem 0.2rem;
	text-align: center;
	color: white;
	border-radius: 0.5rem; 
	font-size: 0.4rem;
	background-color: #23617a;
}

.username {
	font-size: 0.3rem;
	text-align: center;
	color: white;
	margin-top: 0.5rem;
}

.tips {
	position: absolute;
	font-size: 0.2rem;
	color: grey;
	bottom: 0.3rem;
	right: 0.3rem;
}

</style>