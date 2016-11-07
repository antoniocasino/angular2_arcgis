import { Injectable }      from '@angular/core';
import { Http, Response, RequestOptions,Jsonp,Headers}  from '@angular/http';
import { Donor }           from './donor';
import { Observable }      from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DonorService {
  
  private donorsUrl = 'https://antonio-node.herokuapp.com/api/donors';  // URL to web API
  constructor (private jsonp:Jsonp, private http:Http) {}
  
  getDonors (): Observable<Donor[]> {
    return this.http.get(this.donorsUrl).map(res => res.json()).catch(this.handleError);
  }
  
  addDonor (donor: Donor): Observable<Hero> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('Access-Control-Allow-Origin', '*');
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.donorsUrl, JSON.stringify(donor), options)
                    .subscribe(this.extractData,this.handleError);
  }
  
  
  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
