// Import necessary Angular modules and services
import { Component, OnInit, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { GameService, Game } from '../../services/game.service'; 
import { SearchBarComponent } from '../search-bar/search-bar.component'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core'; 

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html', 
  styleUrls: ['./game-list.component.css'], 
  standalone: true,
  imports: [
    CommonModule, 
    SearchBarComponent,
    MatCardModule,
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatOptionModule 
  ]
})
export class GameListComponent implements OnInit {
  // Define properties for the component
  games: Game[] = []; // Array to hold the list of all games
  paginatedGames: Game[] = []; // Array to hold the games that are currently visible based on pagination
  pageSize = 6; // Number of games per page
  pageIndex = 0; // The current page index (starting from 0)
  private cache = new Map<string, Game[]>(); // Client-side cache to avoid repeated API calls
  private lastSearchTerm: string = ''; // Keep track of the last search term to avoid duplicate searches

  // Reference the MatPaginator component in the template to control pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Inject the GameService to fetch games from the backend
  constructor(private gameService: GameService) {}

  // Lifecycle hook to fetch the games when the component is initialized
  ngOnInit(): void {
    this.fetchGames(); // Fetch games when the component initializes
  }

  // Function to fetch games from the GameService or use the cached games
  fetchGames(searchTerm: string = ''): void {
    // Check if the search term's results are already cached
    if (this.cache.has(searchTerm)) {
      console.log("✅ Using client cache:", searchTerm);
      this.games = this.cache.get(searchTerm)!; // Use cached games if available
      this.updatePagination(); // Update the paginated games list
      return; // Skip API call if cache is used
    }

    // If no cached data, fetch games from the GameService
    this.gameService.getGames(searchTerm).subscribe((data) => {
      this.games = data; // Update the games array with fetched data
      this.cache.set(searchTerm, data); // Store the fetched games in the cache for future use
      this.updatePagination(); // Update pagination after fetching the games
    });
  }

  // Function to handle search input from the search bar component
  onSearch(searchTerm: string) {
    // Prevent fetching games if the search term is the same as the last search term
    if (searchTerm === this.lastSearchTerm) return;
    
    this.lastSearchTerm = searchTerm; // Update the last search term
    this.pageIndex = 0; // Reset the page index to the first page for new search results
    this.fetchGames(searchTerm); // Fetch games based on the new search term
  }

  // Function to handle pagination changes (e.g., page number or page size)
  onPageChange(event: PageEvent) {
    // Update the current page index and page size based on user action
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination(); // Recalculate the displayed games for the current page
  }

  // Function to update the paginated games based on the current page index and page size
  updatePagination() {
    const startIndex = this.pageIndex * this.pageSize; // Calculate the starting index for pagination
    const endIndex = startIndex + this.pageSize; // Calculate the ending index for pagination
    this.paginatedGames = this.games.slice(startIndex, endIndex); // Slice the games array to get the correct subset
  }
}
