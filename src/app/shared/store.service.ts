import { Injectable, WritableSignal, signal } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { Child, ChildResponse } from './interfaces/Child';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  public kindergardens: WritableSignal<Kindergarden[]> = signal([]);
  public children: WritableSignal<ChildResponse[]> = signal([]);
  public childrenTotalCount: WritableSignal<number> = signal(0);


}
