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
const statsInput = ref('');
const baseStat = ref(0);
const expeditions: Ref<number | null> = ref(null);

const stats = ref(0);
const bonuses = ref(0);
const levelUp = ref(0);

const reset = () => {
  traitsInput.value = '';
  statsInput.value = '';
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

watch([traitsInput, statsInput, expeditions], () => {
  stats.value = extractTraits(statsInput.value).reduce((sum, cur) => cur + sum, 0);
  bonuses.value = extractTraits(traitsInput.value).reduce((sum, cur) => cur + sum, 0);
  levelUp.value = calcExpeditions(expeditions.value ?? 0);
  baseStat.value = stats.value - bonuses.value - (6 * levelUp.value);
});

</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-sm-7 col-md-5 col-lg-4 col-xl-3">

        <div class="mb-3 bt-5 text-center fw-bold">
          <h3>SCORE: <span class="badge rounded-pill bg-success m-3">{{ baseStat }}</span></h3>
        </div>

        <div class="mb-3">
          <label for="stats" class="form-label">Stats</label>
          <input type="text" class="form-control" id="stats" v-model.trim="statsInput" inputmode="numeric" pattern="[0-9]*" placeholder="eg. 27 10 7"/>
        </div>

        <div class="mb-3">
          <label for="traits" class="form-label">Traits</label>
          <input type="text" class="form-control" id="traits" v-model.trim="traitsInput" inputmode="numeric" pattern="[0-9]*" placeholder="eg. 15 3 1 -4"/>
          <div class="form-text">Without fuel and time modifiers</div>
        </div>

        <div class="mb-3">
          <label for="expeditions" class="form-label">Expeditions:</label>
          <input type="number" class="form-control" min="0" id="expeditions" v-model="expeditions" placeholder="eg. 19"/>
        </div>

        <div class="mb-3 text-center">
          <button @click="reset" class="btn btn-warning">Reset</button>
        </div>

        <div class="mb-3 text-center">
          <div><small>Stats: {{ stats }}</small></div>
          <div><small>Bonuses: {{ bonuses }}</small></div>
          <div><small>Level Up: {{ levelUp }}</small></div>
        </div>
      </div>
    </div>
  </div>
</template>
