<script setup lang="ts">

import {Ref, ref, watch} from 'vue';

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
const combat: Ref<number | null> = ref(null);
const exploration: Ref<number | null> = ref(null);
const industry: Ref<number | null> = ref(null);
const trade: Ref<number | null> = ref(null);
const baseStat = ref(0);
const expeditions: Ref<number | null> = ref(null);

const stats = ref(0);
const bonuses = ref(0);
const levelUp = ref(0);

const reset = () => {
  traitsInput.value = '';
  combat.value = null;
  exploration.value = null;
  industry.value = null;
  trade.value = null;
  baseStat.value = 0;
  expeditions.value = null;
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
  stats.value = ((combat.value ?? 0) + (exploration.value ?? 0) + (industry.value ?? 0) + (trade.value ?? 0));
  bonuses.value = extractTraits(traitsInput.value).reduce((sum, cur) => cur + sum, 0);
  levelUp.value = calcExpeditions(expeditions.value ?? 0);
  baseStat.value = stats.value - bonuses.value - (6 * levelUp.value);
});

</script>

<template>
  <table>
    <tr>
      <td><label for="combat">Combat:</label></td>
      <td><input type="number" id="combat" v-model="combat"/></td>
    </tr>
    <tr>
      <td><label for="exploration">Exploration:</label></td>
      <td><input type="number" id="exploration" v-model="exploration"/></td>
    </tr>
    <tr>
      <td><label for="industry">Industrial:</label></td>
      <td><input type="number" id="industry" v-model="industry"/></td>
    </tr>
    <tr>
      <td><label for="trade">Trade:</label></td>
      <td><input type="number" id="trade" v-model="trade"/></td>
    </tr>
    <tr style="background-color: silver">
      <td><label for="expeditions">Expeditions:</label></td>
      <td><input type="number" min="0" id="expeditions" v-model="expeditions"/></td>
    </tr>
    <tr style="background-color: gray">
      <td><label for="traits">Traits</label></td>
      <td><input type="text" id="traits" v-model.trim="traitsInput" inputmode="numeric" pattern="[0-9]*"/></td>
    </tr>
    <tr>
      <td colspan="2">
        <button @click="reset" style="background-color: coral">Reset</button>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <h3>SCORE: {{ baseStat }}</h3>
        <div><small>Stats: {{ stats }}</small></div>
        <div><small>Bonuses: {{ bonuses }}</small></div>
        <div><small>Level Up: {{ levelUp }}</small></div>
      </td>
    </tr>
  </table>
</template>

<style>
label {
  margin: 5px;
}
</style>