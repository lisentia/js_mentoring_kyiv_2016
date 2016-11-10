import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../user.model';

@Injectable()
export class UserArrayService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private userLocalUrls = {
    getAll: '/user/getAll',
    add: '/user/register',
    update: '/user/update/'
  };
  originUrl: String = '';

  constructor(private http: Http) {
    let url = new URL(document.URL);
    this.originUrl = url.origin;
  }

  getUsers(): Promise<User[]> {
    return this.http
        .get(this.originUrl + this.userLocalUrls.getAll)
        .toPromise()
        .then(response => {
          return response.json() as User[]
        })
        .catch(this.handleError);
  }

  getUser(id: number): Promise<User> {
    return this.getUsers()
      .then(users => users.find(user => user._id === id));
  }

  addUser(user: User): Promise<User> {
    return this.http
        .post(this.originUrl + this.userLocalUrls.add, JSON.stringify(user), {headers: this.headers})
        .toPromise()
        .then(() => user)
        .catch(this.handleError);
  }

  updateUser(user: User): Promise<User> {
    return this.http
        .put(this.originUrl + this.userLocalUrls.update + user._id, JSON.stringify(user), {headers: this.headers})
        .toPromise()
        .then(() => user)
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
