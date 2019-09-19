import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveUnderscorePipe } from '../pipes/remove-undescore.pipe';
import { SearchComponent } from '../search/search.component';
import { AngularMaterialModule } from '../angular-material';
import { SearchFilterEventsComponent } from '../search-filter-events/search-filter-events.component';
import { SearchFilterDishesComponent } from '../search-filter-dishes/search-filter-dishes.component';
@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [SearchComponent, SearchFilterEventsComponent, SearchFilterDishesComponent, RemoveUnderscorePipe],
  exports: [SearchComponent, SearchFilterEventsComponent, SearchFilterDishesComponent, RemoveUnderscorePipe]
})
export class SharedModule { }
