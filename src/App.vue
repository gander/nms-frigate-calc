<script setup lang="ts">

import {ref, watch} from 'vue';

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

const traitsInput = ref('');
const combat = ref(0);
const exploration = ref(0);
const industry = ref(0);
const trade = ref(0);
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

watch([traitsInput, combat, exploration, industry, trade, /*support,*/ expeditions], () => {
  stats.value = (combat.value + exploration.value + industry.value + trade.value);
  bonuses.value = extractTraits(traitsInput.value).reduce((sum, cur) => cur + sum, 0);
  levelUp.value = calcExpeditions(expeditions.value);
  baseStat.value = stats.value - bonuses.value - (6 * levelUp.value);
});

</script>

<template>
  <div>
    <label for="expeditions">Expeditions</label>
    <input type="number" min="0" id="expeditions" v-model="expeditions"/>
  </div>
  <div>
    <label for="combat">Combat</label>
    <input type="number" id="combat" v-model="combat"/>
  </div>
  <div>
    <label for="exploration">Exploration</label>
    <input type="number" id="exploration" v-model="exploration"/>
  </div>
  <div>
    <label for="industry">Industry</label>
    <input type="number" id="industry" v-model="industry"/>
  </div>
  <div>
    <label for="trade">Trade</label>
    <input type="number" id="trade" v-model="trade"/>
  </div>
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
