import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  // Output property to emit the search term to the parent component
  @Output() searchEvent = new EventEmitter<string>();

  // Private subject used to handle the debounced search input
  private searchSubject = new Subject<string>();

  // Constructor to set up the subscription for debouncing search input
  constructor() {
    // Set up a debounce mechanism for the search term, triggering an event after 500ms
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      // Emit the debounced search term when ready
      this.searchEvent.emit(searchTerm);
    });
  }

  // Handler for the search input event
  onSearch(event: Event) {
    // Extract the search term from the input field and trim any extra spaces
    const searchTerm = (event.target as HTMLInputElement).value.trim();

    // Pass the trimmed search term to the subject for debouncing
    this.searchSubject.next(searchTerm); // Debounce applied correctly
  }
}
