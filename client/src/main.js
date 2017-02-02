'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 游戏界面
const page_game = r => require.ensure([], () => r(require('./App')), 'game');
const page_welcome = r => require.ensure([], () => r(require('./Welcome')), 'game');
const page_waitting = r => require.ensure([], () => r(require('./Waitting')), 'game');

const router = new VueRouter({
	routes: [
		{path: '/', component: page_welcome},
		{path: '/waitting/:game_id', component: page_waitting},
		{path: '/game/:game_id', component: page_game},
	]
});

const app = new Vue({
	el: '#app',
  router,
});