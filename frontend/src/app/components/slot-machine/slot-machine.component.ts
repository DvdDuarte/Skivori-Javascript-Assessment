// Import necessary Angular modules and components
import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core'; 
import { isPlatformBrowser, CommonModule } from '@angular/common'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { HttpClient } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-slot-machine',  
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
})
export class SlotMachineComponent implements OnInit {
  // Class properties to store data like balance, available currencies, and slot machine results
  balance: number = 20; // Fallback default balance
  availableCurrencies: string[] = ['USD', 'EUR', 'GBP']; // Available currencies for conversion
  selectedCurrency: string = 'USD'; // Selected currency for conversion
  result: string[] = ['?', '?', '?']; // Store the result of the slot machine spin
  convertedBalance: number | null = null; // Store the converted balance after currency conversion
  isSpinning: boolean = false; // Track whether the slot machine is currently spinning
  isBrowser: boolean = false; // Check if the code is running in the browser or server (for SSR)

  // Map to hold image paths for slot symbols
  symbolImages: { [key: string]: string } = {
    cherry: '/assets/slot/cherry.png',
    lemon: '/assets/slot/lemon.png',
    apple: '/assets/slot/apple.png',
    banana: '/assets/slot/banana.png',
    '?': '/assets/slot/question-mark.png',
  };

  // Constructor for initializing services and platform check
  constructor(
    private snackBar: MatSnackBar, // Service for displaying snack bar notifications
    private http: HttpClient, // HTTP client for making API requests
    @Inject(PLATFORM_ID) private platformId: any, // Inject PLATFORM_ID to determine the platform (browser or SSR)
    private renderer: Renderer2 // Renderer2 to manipulate DOM elements safely
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Check if the app is running in the browser
  }

  // ngOnInit lifecycle hook to fetch the initial balance on browser platforms
  ngOnInit(): void {
    if (this.isBrowser) {
      this.getBalance(); // Fetch the user balance from backend when in the browser
    }
  }

  // Function to fetch the balance from the backend API
  getBalance(): void {
    this.http.get<{ balance: number }>(`https://games-backend-gmcvcgb2hnhph6f2.spaincentral-01.azurewebsites.net/api/slot/balance`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.balance = data.balance; // Update balance from API response
      },
      error: (err) => {
        console.error('Error fetching balance', err);
        this.snackBar.open('Error fetching balance', 'Close', { duration: 3000 }); // Show error message if failed
      },
    });
  }

  // Function to trigger a spin of the slot machine
  spinSlotMachine(): void {
    if (!this.isBrowser) return; // Prevent server-side rendering issues

    console.log('Balance before spin:', this.balance);
    this.isSpinning = true; // Set the spinning flag to true

    // Add a spinning class to each reel for animation
    const reelCards = document.querySelectorAll('.reel-card');
    reelCards.forEach((reel: any) => {
      this.renderer.addClass(reel, 'spinning');
    });

    // Simulate a delay before receiving the result
    setTimeout(() => {
      this.http.get<{ spinResult: string[], coinsWon: number, balance: number }>(`https://games-backend-gmcvcgb2hnhph6f2.spaincentral-01.azurewebsites.net/api/slot/spin`, { withCredentials: true }).subscribe({
        next: (data) => {
          console.log('Balance after spin:', data.balance);
          this.balance = data.balance; // Update balance from API response
          this.result = data.spinResult; // Update the slot result
          this.isSpinning = false; // Set the spinning flag to false

          // Remove spinning class from each reel after animation
          reelCards.forEach((reel: any) => {
            this.renderer.removeClass(reel, 'spinning');
          });

          this.snackBar.open(`You won ${data.coinsWon} coins!`, 'Close', { duration: 3000 }); // Show win message
        },
        error: (err) => {
          console.error('Error spinning the slot machine', err);
          this.snackBar.open('Error spinning the slot machine', 'Close', { duration: 3000 }); // Show error message if failed
          this.isSpinning = false; // Stop spinning if error occurred

          // In case of error, remove spinning class from each reel
          reelCards.forEach((reel: any) => {
            this.renderer.removeClass(reel, 'spinning');
          });
        },
      });
    }, 2000); // Simulate a 2-second delay before receiving the result
  }

  // Function to convert the user's balance into another currency
  convertCurrency(): void {
    if (!this.isBrowser) return; // Prevent SSR issues

    // Make a GET request to the backend to convert the balance
    this.http.get<{ convertedBalance: number }>(`https://games-backend-gmcvcgb2hnhph6f2.spaincentral-01.azurewebsites.net/api/slot/convert?currency=${this.selectedCurrency}`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.convertedBalance = data.convertedBalance; // Store the converted balance
        this.snackBar.open(`Converted Balance: ${this.convertedBalance} ${this.selectedCurrency}`, 'Close', { duration: 2000 }); // Show conversion result
      },
      error: (err) => {
        console.error('Error converting currency', err);
        this.snackBar.open('Error converting currency', 'Close', { duration: 3000 }); // Show error message if failed
      },
    });
  }
}
