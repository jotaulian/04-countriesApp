import { Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  private debouncerSubs?: Subscription;
  private debouncer = new Subject<string>();

  @Input()
  public placeholder: string = ''
  @Input()
  public initialValue: string = ''

  @Output()
  public onValue = new EventEmitter();
  @Output()
  public onDebounce = new EventEmitter();

  ngOnInit(): void {
    this.debouncerSubs = this.debouncer
      .pipe(debounceTime(300))
      .subscribe(value=>{
        this.onDebounce.emit(value);
      })
  }

  ngOnDestroy(): void {
    this.debouncerSubs?.unsubscribe();
  }

  searchTerm(term: string):void{
    this.onValue.emit(term);
  }

  onKeyPressed(searchTerm: string){
    this.debouncer.next(searchTerm);
  }

}
