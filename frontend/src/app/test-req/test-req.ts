import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-test-req',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './test-req.html',
    styleUrls: ['./test-req.scss']
})
export class TestReq implements OnInit, OnDestroy{
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    text = 'Lviv';
    responseText = '';

    initSubscription$?: Subscription;
    safeSubscription$?: Subscription;
    unsafeSubscription$?: Subscription;

    ngOnInit() {
        this.initSubscription$ = this.http.get<any[]>('city/get-list').subscribe({
            next: (res) => {
                this.text = `test'); DELETE FROM city WHERE id = ${res[res.length - 1].id}; --`
            },
        });
    }

    ngOnDestroy(): void {
        this.initSubscription$?.unsubscribe();
        this.safeSubscription$?.unsubscribe();
        this.unsafeSubscription$?.unsubscribe();
    }

    request() {
        this.safeSubscription$ = this.http.post('test/safe', { name: this.text }, { responseType: 'text' }).subscribe({
            next: (res) => {
                this.responseText = res;
            },
        });
    }

    requestUnsafe() {
        this.unsafeSubscription$ = this.http.post('test/unsafe', { name: this.text }, { responseType: 'text' }).subscribe({
            next: (res) => {
                this.responseText = res;
            },
        });
    }

    goToMainPage() {
        this.router.navigate(['']);
    }
}
