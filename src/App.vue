<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import {/*computed,*/ ref, watch} from 'vue';

const levelUps = new Map([
  [1, 4],
  [2, 8],
  [3, 15],
  [4, 25],
  [5, 30],
  [6, 35],
  [7, 40],
  [8, 45],
  [9, 50],
  [10, 55],
]);
const regex = /\+?\d+|-\d+/g;

// const minFuel = computed(() => support.value ? 2 : 8);
// const maxFuel = computed(() => support.value ? 5 : 12);

const traitsInput = ref('');
const combat = ref(0);
const exploration = ref(0);
const industry = ref(0);
const trade = ref(0);
// const support = ref(false);
// const fuel = ref(minFuel.value);
const baseStat = ref(0);
const expeditions = ref(0);

const stats = ref(0);
const bonuses = ref(0);
const levelUp = ref(0);

const reset = () => {
  traitsInput.value = '';
  combat.value = 0;
  exploration.value = 0;
  industry.value = 0;
  trade.value = 0;
  // support.value = false;
  // fuel.value = minFuel.value;
  baseStat.value = 0;
  expeditions.value = 0;
  stats.value = 0;
  bonuses.value = 0;
  levelUp.value = 0;
};

const extractTraits = (str: string): number[] => {
  let matches: number[] = [];

  let m;
  while ((m = regex.exec(str))) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    matches.push(parseInt(m[0]));
  }

  return matches.filter((value) => value !== 0).slice(0, 5);
};

const calcExpeditions = (expeditions: number): number => {
  let result = 0;

  for (let [lvl, exp] of levelUps.entries()) {
    if (exp > expeditions) {
      break;
    }

    result = lvl;
  }

  return result;
};


// watch(support, () => {
//   if (fuel.value > maxFuel.value) {
//     fuel.value = maxFuel.value;
//   }
//   if (fuel.value < minFuel.value) {
//     fuel.value = minFuel.value;
//   }
// });

watch([traitsInput, combat, exploration, industry, trade, /*support,*/ expeditions], () => {
  stats.value = (combat.value + exploration.value + industry.value + trade.value);
  bonuses.value = extractTraits(traitsInput.value).reduce((sum, cur) => cur + sum, 0);
  levelUp.value = calcExpeditions(expeditions.value);
  baseStat.value = stats.value - bonuses.value - (6 * levelUp.value);
});

</script>

<template>
<!--  <div>-->
<!--    <label for="support">Support</label>-->
<!--    <input type="checkbox" id="support" v-model="support"/>-->
<!--  </div>-->
  <div>
    <label for="expeditions">Expeditions</label>
    <input type="number" min="0" id="expeditions" v-model="expeditions"/>
  </div>
  <div>
    <label for="combat">Combat</label>
    <input type="number" min="0" id="combat" v-model="combat"/>
  </div>
  <div>
    <label for="exploration">Exploration</label>
    <input type="number" min="0" id="exploration" v-model="exploration"/>
  </div>
  <div>
    <label for="industry">Industry</label>
    <input type="number" min="0" id="industry" v-model="industry"/>
  </div>
  <div>
    <label for="trade">Trade</label>
    <input type="number" min="0" id="trade" v-model="trade"/>
  </div>
<!--  <div>-->
<!--    <label for="fuel">Fuel</label>-->
<!--    <input type="number" :min="minFuel" :max="maxFuel" id="trade" v-model="fuel"/>-->
<!--  </div>-->
  <div>
    <label for="traits">Traits</label>
    <input type="text" id="traits" v-model.trim="traitsInput" inputmode="numeric" pattern="[0-9]*"/>
  </div>
  <div>
    <button @click="reset">Reset</button>
  </div>
  <div>
    <div><small>Stats: {{ stats }}</small></div>
    <div><small>Bonuses: {{ bonuses }}</small></div>
    <div><small>Level Up: {{ levelUp }}</small></div>
    <h3>SCORE: {{ baseStat }}</h3>
  </div>
</template>

