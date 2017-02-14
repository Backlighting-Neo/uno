<template>
  <div id="app">

    <div :class="{directionContainer: true, antiClockwise: direction==1, clockwise: direction==0}">
      <img src="./assets/Direction.png" alt="" class="direction">
    </div>

    <div class="otherPlayerCards">
      <div class="otherPlayerCardContainer" v-for="(player, index) in (playerList.concat(playerList).slice(playerIndex+1, playerIndex+playerList.length))">
        <UnoCardBack
          :hasUno="player.cards_num===1"
          :winPosition="player.win_position"
          :class="{cardDiactive: player.index!==currentIndex}"
        />
        <div class="otherPlayerName">{{player.name}}</div>
      </div>
    </div>

    <div class="cardStack">
      <UnoCardBack :class="{cardInCardStack: true, highlightCardSlow: loading_cardstack}" @click="clickCardStack"/>
      <div class="remainCardNum">剩{{remainCardNum}}张</div>
    </div>

    <div class="discardedCard">
      <UnoCard
        class="card_discard"
        :style="'transform:scale(1.5) '+(index==cardHasDiscarded.length-1?'':('rotate('+card.random*30+'deg)'))"
        :type="card.type"
        :number="card.number"
        :fun="card.fun"
        :color="card.color"
        :changeColor="card.changeColor"
        v-for="(card, index) in cardHasDiscarded"
      />
    </div>

    <div class="toastContainer" v-show="messageList.length>0">
      <div class="toast" v-for="(message, index) in messageList" :key="message" @animationend="toastAnimationend">{{message}}</div>
    </div>

    <div class="myCards" >
      <div class="tips" v-show="tips && tips!==''">{{tips}}</div>
      <div class="myName">{{userName}}</div>
      <div class="chooseColor" v-show="showColorChooseModal">
        <div
          class="colorCircle"
          @click="chooseColor(color)"
          :class="[color, (choosePreReadyColor!==''&&color!==choosePreReadyColor)?'cardDiactive':'']"
          v-for="color in ['red', 'green', 'blue', 'yellow']" 
        />
      </div>
      <UnoCard
        :class="{card: true, cardDiactive: (playerIndex!==currentIndex)||(choosePreReadyCardIndex!==-1&&index!==choosePreReadyCardIndex), highlightCard: false}"
        @click="chooseCard(index)"
        :type="card.type"
        :number="card.number"
        :fun="card.fun"
        :color="card.color"
        v-for="(card, index) in cardInHand"
        :key="JSON.stringify(card)"
      />
    </div>
    
  </div>
</template>

<script>
import utils from './utils.js';

import UnoCard from './components/UnoCard';
import UnoCardBack from './components/UnoCardBack';

const GAME_DIRECTION_NORAML = 0;  // Clockwise
const GAME_DIRECTION_REVERSE = 1;  // AntiClockwise

const Text_Press_Again = '再次点击以确定你的选择';
const Text_Choose_Color = '在上方选择你要换成什么颜色';

export default {
  name: 'UnoGame',
  components: {
    UnoCard,
    UnoCardBack
  },
  methods: {
    chooseCard(index) {  // 选牌
      if(!this.online || this.playerIndex!==this.currentIndex) return;

      let card = this.cardInHand[index];

      if(this.choosePreReadyCardIndex == index) {
        if(card.type == 'special') {
          this.showColorChooseModal = true;
          this.tips = Text_Choose_Color;
        }
        else {
          this.choosePreReadyCardIndex = -1;
          this.requestDiscard(index);
          this.tips = '我出了一张 '+ utils.convertCardToChinese(card);
        }
      }
      else {
        if(!utils.checkCardCanDiscard(card, this.last_card)) {
          this.tips = `${utils.convertCardToChinese(card)} 现在不能出`;
          return;
        }

        this.choosePreReadyColor = '';
        this.showColorChooseModal = false;
        this.tips = Text_Press_Again;
        this.choosePreReadyCardIndex = index;
      }
    },

    chooseColor(color) {  // 选颜色
      if(this.choosePreReadyColor == color) {
        let card = this.cardInHand[this.choosePreReadyCardIndex];
        this.requestDiscard(this.choosePreReadyCardIndex, color);
        this.tips = `我出了一张 ${utils.convertCardToChinese(card)} 并将颜色改成  ${utils.convertColorToChinese(color)}色`;
        this.choosePreReadyColor = '';
        this.showColorChooseModal = false;
        this.choosePreReadyCardIndex = -1;
      }
      else {
        this.tips = Text_Press_Again;
        this.choosePreReadyColor = color;
      }
    },

    clickCardStack() {  // 点牌堆
      if(!this.online || this.loading_cardstack || this.playerIndex!==this.currentIndex) return;

      this.loading_cardstack = true;
      utils.ajax('/uno/game/request_a_card')
      .then(res=>{
        let card = res.cards[0];
        this.tips = `我抓到了一张 ${utils.convertCardToChinese(card)}`;
        this.handleStatus(res.status);
        this.loading_cardstack = false;
      })
    },

    handleStatus(status) {
      this.remainCardNum = status.card_in_stack;
      this.cardInHand = status.card_in_hand;
      this.cardHasDiscarded = status.card_has_been_discarded;
      this.direction = status.direction;
      this.playerIndex = status.playerIndex;
      this.currentIndex = status.index;

      status.player.forEach((player, index)=>{
        if(player.cards_num !== this.playerList[index].cards_num)
          if(player.cards_num === 1)
            this.showToast(`${player.name} UNO!`);
          else if(player.cards_num === 0)
            this.showToast(`${player.name} 第${player.win_position}名`);
      })

      this.playerList = status.player;

      this.last_card = status.last_card;

      if(this.last_card && this.last_card.changeColor)
        this.showToast(`现在颜色变成 ${utils.convertColorToChinese(this.last_card.changeColor)}色`);

      this.userName = status.player[status.playerIndex].name;

      if(this.currentIndex == this.playerIndex) {
        this.showToast('你的回合');
        if(status.card_in_hand.some(card=>utils.checkCardCanDiscard(card, this.last_card)))
          this.tips = '轮到我出牌';
        else
          this.tips = '你没有牌可出，只能摸牌';
      }
    },

    requestDiscard(index, changeColor) {  // 请求出牌
      let card = this.cardInHand[index];
      if(changeColor) card.changeColor = changeColor;

      utils.ajax('/uno/game/discard', {
        method: 'POST',
        body: {
          card
        }
      })
      .then(res=>{
        this.handleStatus(res.status);
      })
    },

    fetchGameStatus() {
      utils.ajax('/uno/game/status')
      .then(res=>{
        this.handleStatus(res.status);
      })
    },

    showToast(text) {
      this.messageList.push(text);
    },

    toastAnimationend(event) {
      this.messageList.splice(this.messageList.indexOf(event.target.innerHTML), 1);
    }
  },
  created() {
    if(this.$route.params.game_id) window.localStorage.gameID = this.$route.params.game_id;
    let gameID = window.localStorage.gameID;

    if(this.$route.query.user) window.localStorage.uno_userToken = this.$route.query.user;
    let userID = window.localStorage.uno_userToken;

    if(!window.game_socket) {
      window.game_socket = new WebSocket(utils.webscoketServer+`/?gameID=${gameID}&userID=${userID}`);
    }
    else {
      this.tips = '游戏开始';
      this.online = true;
    }

    window.game_socket.onopen = ()=>{
      this.tips = '游戏开始';
      this.online = true;
    };
    window.game_socket.onmessage = message=>{
      message = JSON.parse(message.data);
      this.handleStatus(message.status);
    };
    window.game_socket.onclose = ()=>{
      this.tips = '您已断线，重现上线请刷新页面';
      this.online = false;
    }

    this.fetchGameStatus();
  },
  data() {
    return({
      tips: '正在连接服务器……',
      showColorChooseModal: false,
      choosePreReadyCardIndex: -1,
      choosePreReadyColor: '',

      loading_cardstack: false,

      online: false,
      playerList: [],
      direction: GAME_DIRECTION_NORAML,
      remainCardNum: 118,
      cardInHand: [],
      cardHasDiscarded: [],
      playerIndex: -1,
      currentIndex: -1,
      last_card: undefined,
      userName: '',
      messageList: []
    })
  }
}
</script>

<style scoped>
  #app {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .myCards {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    position: absolute;
    left: 0.3rem;
    right: 0.3rem;
    bottom: 0.5rem;
  }

  .otherPlayerCardContainer {
    width: 1rem;
  }

  .otherPlayerName {
    width: 100%;
    margin-top: 0.1rem;
    text-align: center;
    color: white;
    font-size: 0.2rem;
  }

  .otherPlayerCards {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    left: 0.3rem;
    right: 0.3rem;
    top: 0.3rem;
  }

  .discardedCard {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 25%;
    height: 25%;
    margin-top: -30%;
    margin-left: -12.5%;
  }

  .card {
    margin: 0 0.02rem 0.01rem;
  }

  .card_discard {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -35%;
    margin-left: -25%;
  }

  .cardStack {
    position: absolute;
    right: 0.3rem;
    top: 45%;
    margin-top: -0.8rem;
    color: white;
    font-size: 0.2rem;
    text-align: center;
  }

  .cardInCardStack {
    box-shadow: 0.05rem 0.05rem 0.1rem white;
  }

  .remainCardNum {
    margin-top: 0.1rem;
  }

  .directionContainer {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    margin-top: -42.5%;
    opacity: 0.2;
    transition: transform 0.2s;
  }

  .clockwise {
    transform: scaleX(-1);
  }

  .antiClockwise {
    transform: scaleX(1);
  }

  .cardActive {
    opacity: 1;
  }

  .cardDiactive {
    opacity: 0.3;
  }

  .direction {
    display: inline-block;
    width: 5rem;
    height: 5rem;
  }

  .tips {
    position: absolute;
    left: 0;
    top: -0.6rem;
    padding: 0.05rem 0.2rem;
    text-align: center;
    color: white;
    border-radius: 0.3rem; 
    font-size: 0.2rem;
    background-color: #23617a;
  }

  .myName {
    position: absolute;
    right: 0;
    top: -0.6rem;
    padding: 0.05rem 0.2rem;
    text-align: center;
    color: white;
    border-radius: 0.3rem; 
    font-size: 0.3rem;
    background-color: #23617a;
  }

  .chooseColor {
    position: absolute;
    left: 0;
    top: -1.5rem;
    height: 0.7rem;
    width: 4rem;
  }

  .rushButton {
    background-color: #f70302;
    position: absolute;
    left: 0;
    top: -1.5rem;
    height: 0.7rem;
    line-height: 0.7rem;
    width: 0.7rem;
    border-radius: 100%;
    color: white;
    font-size: 0.35rem;
    text-align: center;
    font-weight: bold;
    border: 1px solid black;
    box-shadow: 0.05rem 0.05rem 0.1rem black;
    animation:rushButtonAnimation 0.2s infinite;
    -webkit-animation:rushButtonAnimation 0.2s infinite;
  }

  @keyframes rushButtonAnimation
  {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .highlightCard {
    animation:highlightCard 0.2s infinite;
    -webkit-animation:highlightCard 0.2s infinite;
  }

  @keyframes highlightCard {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  .highlightCardSlow {
    animation:highlightCard 1s infinite;
    -webkit-animation:highlightCard 1s infinite;
  }

  .colorCircle {
    border: 1px solid black;
    width: 0.7rem;
    height: 0.7rem;
    margin-right: 0.1rem;
    border-radius: 100%;
    float: left;
    box-shadow: 0.1rem 0.1rem 0.1rem black;
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

  .toastContainer {
    position: fixed;
    top: 3.5rem;
    left: 0;
    right: 0;
  }

  .toast {
    height: 0.5rem;
    padding: 0 0.5rem;
    line-height: 0.5rem;
    margin: 0 auto 0.5rem;
    opacity: 0;
    background-color: #3591b6;
    color: white;
    border-radius: 0.5rem;
    font-size: 0.25rem;
    text-align: center;
    animation: toast 2.5s;
    overflow: hidden;
    box-shadow: 0 0 20px 8px #23617a;
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
