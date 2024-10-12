import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';
import { Region } from '../../interfaces/region.type';



@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit {
      public isLoading: boolean = false;

      public regions: Region[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
      public countries: Country[] = [];
      public currentRegion?: Region;

  constructor(private countriesService: CountriesService){}
  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byRegion.countries;
    this.currentRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchByRegion(region:Region):void{
    this.currentRegion = region;
    this.isLoading = true;
    this.countriesService.searchRegion(region).subscribe(countries =>{
      this.countries = countries;
      this.isLoading = false;
    });

  }

}
