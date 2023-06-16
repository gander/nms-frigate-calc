import {defineStore} from 'pinia';

export const levelUps = new Map([
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

export const useStore = defineStore('main', {
    state: () => ({
        traitsInput: '',
        statsInput: '',
        expeditions: null as number | null,
    }),
    getters: {
        stats(state): number {
            return extractTraits(state.statsInput).reduce((sum, cur) => cur + sum, 0);
        },

        bonuses(state): number {
            return extractTraits(state.traitsInput).reduce((sum, cur) => cur + sum, 0);
        },

        levelUp(state): number {
            return calcExpeditions(state.expeditions || 0);
        },

        baseStat(): number {
            return this.stats - this.bonuses - (6 * this.levelUp);
        },

        validStat(): number {
            return Math.max(-5, Math.min(14, this.baseStat));
        },

        scoreClass(): 'bg-danger' | 'bg-warning' | 'bg-info' | 'bg-success' {
            const value = this.validStat + 5; // for easy math

            if (value < 5) {
                return 'bg-danger';
            }

            if (value < 10) {
                return 'bg-warning';
            }

            if (value < 15) {
                return 'bg-info';
            }

            return 'bg-success';
        },

        scoreStyle(): {width: string} {
            return ({width: `${Math.round(((this.validStat + 5) * (100 - 10)) / (14 - (-5))) + 10}%`})
        },

    },
});


// onMounted(reset);

export const extractTraits = (str: string): number[] => {
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

export const calcExpeditions = (expeditions: number): number => {
    let result = 0;

    for (let [lvl, exp] of levelUps.entries()) {
        if (exp > expeditions) {
            break;
        }

        result = lvl;
    }

    return result;
};

