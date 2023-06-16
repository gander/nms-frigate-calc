<script setup lang="ts">

import {useStore} from './store.ts';
import {storeToRefs} from 'pinia';

const store = useStore();

const {statsInput, stats, traitsInput, bonuses, expeditions, levelUp, scoreStyle, scoreClass, baseStat, validStat} = storeToRefs(store);

</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <h1 class="text-center h2">NMS Frigate Calc</h1>

      <div class="col-sm-7 col-md-5 col-lg-4 col-xl-3">

        <div class="alert alert-primary text-center" role="alert">
          Provide
          <mark>stats</mark>
          and
          <mark>traits</mark>
          as positive or negative integers.
          Any other chars will be ignored. eg: <span class="font-monospace">"1,2.3 -4"</span>
        </div>

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
          <button @click="store.$reset" class="btn btn-warning">Reset</button>
        </div>

      </div>
    </div>
    <div class="row">
      <div class="col mt-3 d-flex flex-column align-items-center">
        <div class="lead">Formula sources</div>
        <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=1505175794" target="_blank">Frigate Buyer's Guide - How to Pick the Best Ships (and avoid "Lemons")</a>
        <a href="https://www.reddit.com/r/NoMansSkyTheGame/comments/knjokc/a_guide_to_evaluating_frigate_stats/" target="_blank">A Guide to Evaluating Frigate Stats</a>
      </div>
    </div>
    <div class="row">
      <div class="col text-center mt-5">
        <a href="https://github.com/gander/nms-frigate-calc/issues" target="_blank" class=" d-flex flex-column align-items-center">
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
