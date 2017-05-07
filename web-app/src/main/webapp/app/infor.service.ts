import { Injectable } from '@angular/core';

@Injectable()
export class InforService {

    private title = 'Village';

    private inforUser;
    private localData;

    getInforUser() {
        if (this.inforUser === undefined) {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                return this.localData;
            } else {
                // redirect to home page??
            }
        } else
            return this.inforUser;
    }

    setInforUser(inforUser) {
        if (inforUser !== null) {
            this.inforUser = inforUser;
            localStorage.setItem('myInfo', JSON.stringify(inforUser));
        } else {
            localStorage.setItem('myInfo', null);
        }
    }

    setPageTitle(title) {
        this.title = title;
    }

    getPageTitle() {
        return this.title;
    }
}