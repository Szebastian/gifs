import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';


@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apikey: string = 'D7WPcQnmKvNBeXBNAJDj7ibBNUC7JvoC';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    // LocalStorage
    // this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }
  // local Storage

  // private loadLocalStorage(): void {
  //   if (!localStorage.getItem('history')) return;

  //   this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

  //   if (this._tagsHistory.length > 0) return;
  //   this.searchTag(this._tagsHistory[0]);

  // }

  searchTag(tag: string): void {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(resp => {

        this.gifList = resp.data;

      });
    // console.log(this.tagsHistory);

    //('https://api.giphy.com/v1/gifs/search?api_key=D7WPcQnmKvNBeXBNAJDj7ibBNUC7JvoC&q=techno&limit=1');

  }


}
