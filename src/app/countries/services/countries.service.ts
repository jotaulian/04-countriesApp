import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,catchError,of,map, delay, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { Region } from '../interfaces/region.type';
import { CacheStore } from '../interfaces/cache-store.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  // Variables that containg the state of the searchs
  public cacheStore: CacheStore = {
    byCapital: {term: '', countries: []},
    byCountry: {term: '', countries: []},
    byRegion: {region: '', countries: []},
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage()
  }

  private saveToLocalStorage():void{
    localStorage.setItem('cacheStore',JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage():void{
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null>{
    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url).pipe(
      map(countries => countries.length > 0 ? countries[0] : null),
      catchError(() =>of(null))
    );
  }

  private getCountriesRequest(url: string){
    // Devolvemos aray de países, si hay un error devolvemos array vacío:
    return this.http.get<Country[]>(url).pipe(
      catchError(() =>of([]))
    );
  }

  searchCapital(term: string): Observable<Country[]>{
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap(countries => this.cacheStore.byCapital = {term, countries}),
      tap(() =>this.saveToLocalStorage())
    )
  }

  searchCountry(term: string): Observable<Country[]>{
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap(countries => this.cacheStore.byCountry = {term, countries}),
      tap(() =>this.saveToLocalStorage())
    )
  }

  searchRegion(region: Region): Observable<Country[]>{
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url).pipe(
      tap(countries => this.cacheStore.byRegion = {region, countries}),
      tap(() =>this.saveToLocalStorage())
    )
  }

}
