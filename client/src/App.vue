<template>
  <div id="app">

    <div class="otherPlayerCards">
      <UnoCardBack class="card"/>
    </div>

    <div class="myCards">
      <UnoCard type="normal" color="red" number="4" class="card"/>
      <UnoCard type="special" fun="wild" class="card"/>
      <UnoCard type="special" fun="wild draw four" class="card"/>
      <UnoCard type="special" fun="wild draw four" class="card"/>
      <UnoCard type="special" fun="wild draw four" class="card"/>
      <UnoCard type="special" fun="wild draw four" class="card"/>
      <UnoCard type="special" fun="reverse" color="red" class="card"/>
      <UnoCard type="special" fun="skip" color="blue" class="card"/>
      <UnoCard type="special" fun="draw two" color="green" class="card"/>
    </div>
    
  </div>
</template>

<script>
import UnoCard from './components/UnoCard';
import UnoCardBack from './components/UnoCardBack';

export default {
  name: 'app',
  components: {
    UnoCard,
    UnoCardBack
  }
}
</script>

<style>
  #app {
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: radial-gradient(50% 50% at center center, #23617a,#052a3d);
    background-image: -webkit-radial-gradient(50% 50% at center center, #23617a,#052a3d);
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

  .otherPlayerCards {
    position: absolute;
    left: 0.3rem;
    right: 0.3rem;
    top: 0.5rem;
  }

  .card {
    margin: 0 0.03rem 0.01rem;
  }
</style>
