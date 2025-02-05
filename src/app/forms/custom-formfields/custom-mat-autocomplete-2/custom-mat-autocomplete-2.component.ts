import { Component, computed, ElementRef, EventEmitter, inject, Input, input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-mat-autocomplete-2',
  templateUrl: 'custom-mat-autocomplete-2.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  styles: [`
    .form-field {
      width: 100%;
    }
  `]  
})
export class CustomMatAutocomplete2Component implements OnInit {

  /* Component die zichzelf registreert als FormControl 
  * Het formulier kan de waarde van deze component lezen en schrijven
  * Het formulier bepaalt wat de naam is van de FormControl
  * Voordeel: 
  * - component hoeft niet te weten hoe de FormControl heet
  * - component kan meerdere keren gebruikt worden in het formulier
  * Nadeel: 
  * - het kan onduidelijk zijn dat er iets is toegevoegd aan het formulier
  * - het is niet duidelijk welke validatie er is toegevoegd aan de FormControl
  * - het formulier kan niet geheel strong-typed zijn, 
  *     er ontbreken properties bij aanmaken van formulier (ook niet duidelijk)
  * - het formulier kan wel geheel strong-typed zijn, 
  *     als je de FormControl overschrijft (ook niet duidelijk)
  */ 

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Input({ required: true }) label!: string;
  @Input() placeholder!: string;
  @Output() formControlReady = new EventEmitter<FormControl>();
  options = input.required<string[]>();
  private readonly fb = inject(FormBuilder);
  private filterValue = signal<string>('');
  autocompleteFormControl = this.fb.control('');
  filteredOptions = computed(() => {
    return this.options()
      .filter(option => 
        option
        .toLowerCase()
        .includes(this.filterValue().toLowerCase())
      );
  });

  ngOnInit(): void {
    this.formControlReady.emit(this.autocompleteFormControl);
  }

  filter(): void {
    this.filterValue.set(this.input.nativeElement.value.toLowerCase());
  } 
}