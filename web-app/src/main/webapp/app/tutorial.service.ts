import { Injectable } from '@angular/core';

@Injectable()
export class TutorialService {
    public step: string;

    is(step: string) {
        return step === this.step;
    }

    get() {
        return this.step;
    }

    set(step: string = '') {
        this.step = step;
    }
}