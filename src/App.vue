<script setup lang="ts">

import {onMounted, reactive, Ref, ref, watch} from 'vue';

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
const validStat = ref(0);
const expeditions: Ref<number | null> = ref(null);

const stats = ref(0);
const bonuses = ref(0);
const levelUp = ref(0);

const scoreClass = ref('');
const scoreStyle = reactive({width: '10%'});

const reset = () => {
  traitsInput.value = '';
  statsInput.value = '';
  baseStat.value = 0;
  validStat.value = 0;
  expeditions.value = null;
  stats.value = 0;
  bonuses.value = 0;
  levelUp.value = 0;
  scoreClass.value = 'bg-warning';
};

onMounted(reset);

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
  validStat.value = Math.max(-5, Math.min(14, baseStat.value));
}, {immediate: true});

watch(validStat, (value) => {

  value += 5; // for easy math

  if (value < 5) {
    scoreClass.value = 'bg-danger';
  } else if (value < 10) {
    scoreClass.value = 'bg-warning';
  } else if (value < 15) {
    scoreClass.value = 'bg-info';
  } else {
    scoreClass.value = 'bg-success';
  }

  scoreStyle.width = `${Math.round((value * (100 - 10)) / (14 - (-5))) + 10}%`;
}, {immediate: true});

</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <h1 class="text-center h2">NMS Frigate Calc</h1>

      <div class="col-sm-7 col-md-5 col-lg-4 col-xl-3">

        <div class="mt-3 input-group">
          <div class="form-floating">
            <input type="text" class="form-control" id="stats" v-model.trim="statsInput" inputmode="numeric"/>
            <label for="stats" class="form-label">Stats</label>
          </div>
          <span class="input-group-text" title="Sum of Stats points">{{ stats }}</span>
        </div>

        <div class="mt-3 input-group">
          <div class="form-floating">
            <input type="text" class="form-control" id="traits" v-model.trim="traitsInput" inputmode="numeric"/>
            <label for="traits" class="form-label">Traits</label>
          </div>
          <span class="input-group-text" title="Sum of Bonuses points">{{ bonuses }}</span>
        </div>
        <div class="form-text text-muted text-center">Without fuel and time modifiers</div>

        <div class="mt-3 input-group">
          <div class="form-floating">
            <input type="number" class="form-control" min="0" id="expeditions" v-model="expeditions"/>
            <label for="expeditions" class="form-label">Expeditions:</label>
          </div>
          <span class="input-group-text" title="Number of levels up">{{ levelUp }}</span>
        </div>

        <div class="my-3 text-center fw-bold">
          <div class="progress" style="height: 2rem">
            <div class="progress-bar" role="progressbar" :class="scoreClass" :style="scoreStyle" aria-label="Score" :aria-valuenow="baseStat" aria-valuemin="-5" aria-valuemax="14">{{ validStat }}</div>
          </div>
        </div>

        <div class="mb-3 text-center d-grid">
          <button @click="reset" class="btn btn-warning" data-umami-event="reset">Reset</button>
        </div>

        <div class="alert alert-primary text-center" role="alert">
          Provide
          <mark>stats</mark>
          and
          <mark>traits</mark>
          as positive or negative integers.
          Any other chars will be ignored. eg: <span class="font-monospace">"1,2.3 -4"</span>
        </div>

      </div>
    </div>
    <div class="row">
      <div class="col mt-3 d-flex flex-column align-items-center">
        <div class="lead">Formula sources</div>
        <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=1505175794" target="_blank" data-umami-event="steam">Frigate Buyer's Guide - How to Pick the Best Ships (and avoid "Lemons")</a>
        <a href="https://www.reddit.com/r/NoMansSkyTheGame/comments/knjokc/a_guide_to_evaluating_frigate_stats/" target="_blank" data-umami-event="reddit">A Guide to Evaluating Frigate Stats</a>
      </div>
    </div>
    <div class="row">
      <div class="col text-center mt-5">
        <a href="https://github.com/gander/nms-frigate-calc/issues" target="_blank" class=" d-flex flex-column align-items-center" data-umami-event="github">
          <img src="../assets/github.svg" alt="GitHub" width="24" height="24" class="d-inline-block align-text-top me-1"/>
          Report Bug
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-group-text {
  width: 4rem;
  display: flex;
  justify-content: center;
  cursor: help;
}
</style>
