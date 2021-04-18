import { AbstractControl } from '@angular/forms';
import  moment  from 'moment';
import { FormControl } from "@angular/forms";

export class DateValidator {
  static dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
      return { 'dateVaidator': true };
    }
    return null;
  }

  static timeVaidator(AC: AbstractControl) {
    if (AC && AC.value && AC.value.match("/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/")) {
      return { 'timeVaidator': true };
    }
    return null;
  }
  //    
}
