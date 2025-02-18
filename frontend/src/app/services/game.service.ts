import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the structure of the Game object interface
export interface Game {
  id: string; // Unique identifier for the game
  slug: string; // Slug for URL-friendly game identifier
  title: string; // Title of the game
  providerName: string; // Name of the provider offering the game
  thumb: { url: string }; // Thumbnail URL for the game's image
}

@Injectable({
  providedIn: 'root' // This service will be provided globally throughout the application
})
export class GameService {
  // API base URL for the game-related endpoints
  private apiUrl = 'https://games-backend-gmcvcgb2hnhph6f2.spaincentral-01.azurewebsites.net/api/';

  // Constructor that injects HttpClient to make HTTP requests
  constructor(private http: HttpClient) {}

  /**
   * Fetches a list of games from the backend API.
   * 
   * @param searchTerm - The optional search term used to filter games (empty string if no filter)
   * @returns An Observable array of Game objects
   */
  getGames(searchTerm: string = ''): Observable<Game[]> {
    // Construct the API URL based on whether a search term is provided
    const url = searchTerm ? `${this.apiUrl}games?search=${searchTerm}` : `${this.apiUrl}games/`;
    // Return the HTTP GET request for the list of games
    return this.http.get<Game[]>(url);
  }

  // Below are commented-out methods for other slot-related operations, including balance fetching, spinning the slot machine, and converting currency.

  /**
  getBalance(): Observable<{ balance: number }> {
    // Log a message to the console indicating that the balance is being fetched
    console.log('Fetching balance...');
    // Make an HTTP GET request to fetch the current slot balance and log the response
    return this.http.get<{ balance: number }>(`${this.apiUrl}slot/balance`).pipe(
      tap((response: { balance: number }) => console.log('Balance response:', response)) // Log the balance response
    );
  }

  /**
   * Spins the slot machine by making a GET request to the backend API.
   * 
   * @returns An Observable with the spin result, reward, and updated balance
   *//**
  spinSlotMachine(): Observable<{ result: string[], reward: number, balance: number }> {
    // HTTP GET request to spin the slot machine and return relevant details
    return this.http.get<{ result: string[], reward: number, balance: number }>(`${this.apiUrl}slot/spin`);
  }*/

  /**
   * Converts the user's currency to another currency and fetches the converted balance.
   * 
   * @param currency - The currency to convert to
   * @returns An Observable with the converted balance and the selected currency
   */
  /**
  convertCurrency(currency: string): Observable<{ convertedBalance: number; currency: string }> {
    // HTTP GET request to convert the currency and return the converted balance
    return this.http.get<{ convertedBalance: number; currency: string }>(`${this.apiUrl}slot/convert?currency=${currency}`);
  }*/

}
