
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'RemoveUnderscorePipe' })
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: string) {
    return value.split('_').join(' ');
  }
}
