<template>
	<div class="container" v-show="messageList.length>1">
		<div class="toast" v-for="(message, index) in messageList" :key="message" @animationend="animationend">{{message}}</div>
	</div>
</template>

<script>
export default {
  name: 'Test',

  data () {
    return {
    	messageList: []
    };
  },

  methods: {
  	showToast(text) {
  		this.messageList.push(text);
  	},

  	animationend(event) {
  		this.messageList.splice(this.messageList.indexOf(event.target.innerHTML), 1);
  	}
  },

  created() {
  	this.showToast('测试');
  	setTimeout(()=>{
	  	this.showToast('测试2')
  	}, 1000)
  }
};
</script>

<style lang="css" scoped>
	.container {
		position: fixed;
		top: 2rem;
		left: 0;
		right: 0;
	}

	.toast {
		height: 0.5rem;
		padding: 0 0.5rem;
		line-height: 0.5rem;
		margin: 0 auto 0.5rem;
		opacity: 0;
		background-color: #23617a;
		color: white;
		border-radius: 0.5rem;
		font-size: 0.25rem;
		text-align: center;
		animation: toast 2.5s;
		overflow: hidden;
		box-shadow: 0 0 5px 5px #23617a;
	}

	@keyframes toast {
		0%, 100% {
			width: 0;
			color: #23617a;
		}

		10%, 90% {
			opacity: 0.9;
			color: white;
			width: 3rem;
			height: 0.5rem;
		}

		20%, 80% {
			transform: scale(1.2);
		}
	}
</style>