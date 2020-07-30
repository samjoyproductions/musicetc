import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { find, take } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReviewsortService } from '../reviewsort.service';

export interface Item {
  album_artist: string;
  album_name: string;
  recd_by: number;
  review_text: string;
  reviewed_by: number;
  score: number;
  week: number | string;
  name_recd_by?: string;
  name_revd_by?: string;
}

export interface User {
  discord_id: number;
  discord_name: string;
  username: string;
}

@Component({
  selector: 'app-album-exchange',
  templateUrl: './album-exchange.component.html',
  styleUrls: ['./album-exchange.component.scss'],
  providers: [ReviewsortService]
})

export class AlbumExchangeComponent implements OnInit {
  // declarations
  reviewsCollection: AngularFirestoreCollection<Item>;
  reviews: Observable<Item[]>;
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  }

  // import data
  constructor(afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
    // this.reviewsCollection = afs.collection<Item>('reviews');
    this.reviewsCollection = afs.collection<Item>('reviews');
    this.reviews = this.reviewsCollection.valueChanges();
  }

  ngOnInit(): void {

  }
  // makes collections accessible in page
  addItem(item: Item) {
    this.reviewsCollection.add(item);
  }
  addUser(user: User) {
    this.usersCollection.add(user);
  }

  // initialized values for chart and for DOM elements
  public barChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public header = '';
  public week = '';
  public rec = '';
  public rev = '';
  public data_unscored = [];
  public data_unreviewed = [];
  public data_avg = [];
  public barChartData: ChartDataSets[] = [
    { data: [], label: ``, backgroundColor: '#f46A07', borderColor: 'white' }
  ];
  public tableContent = [];

  handleSelectorWeek(event: any) {
    // initialize and declare values
    this.header = 'week';
    let weekReviews;
    let dataset = [];
    let unreviewed = [];
    let unscored = [];
    let average = [];
    let tableReviews = [];

    // select dataset from DOM
    const weekSelected = event.target.textContent;
    this.week = weekSelected;

    // count and sort data
    this.reviews.pipe(take(1)).subscribe({
      next(x) {
        // initialize values
        let unrev = 0;
        let unsc = 0;

        // filter all reviews for only selected week
        weekReviews = x.filter(y => y.week == weekSelected);

        // push reviews to table
        weekReviews.forEach(element => tableReviews.push(element));

        // counts unreviewed and unscored albums
        weekReviews.forEach(element => {
          if (element.score === '' && !element.review_text) {
            unrev++;
          } else if (element.score === 0) {
            unsc++;
          }
        });
        unreviewed.push(unrev);
        unscored.push(unsc);

        // counts scored albums
        for (let i = 1; i <= 10; i++) {
          let score = 0;
          weekReviews.forEach(element => {
            if (Math.floor(element.score) === i) {
              score++;
            }
          });
          dataset.push(score);
        }

        // calculate average of scores
        let scoreSum = 0
        let tally = 0;
        weekReviews.forEach(element => {
          if (!element.score) {
            return;
          } else {
            tally++;
            scoreSum = scoreSum + element.score;
          }
        });
        let avg = scoreSum / tally;
        average.push(avg.toFixed(2));
      },
      error(err) {
        console.error('did not work');
      },
      complete() { console.log('done') }
    });

    // push sorted data into chart and DOM
    this.barChartData[0].data = dataset;
    this.barChartData[0].label = `Week ${weekSelected} Reviews`;
    this.data_unreviewed = unreviewed;
    this.data_unscored = unscored;
    this.data_avg = average;
    this.tableContent = tableReviews;
  }

  handleRevdBy(event: any) {
    // initialize values
    this.header = 'rev';
    let idSelected;
    let reviewsSelected;
    let dataset = [];
    let unreviewed = [];
    let unscored = [];
    let average = [];
    let tableReviews = [];

    // select dataset from DOM
    const nameSelected = event.target.textContent;
    this.rev = nameSelected;

    // get user ID from users collection
    this.users.pipe(take(1)).subscribe({
      next(x) {
        idSelected = x.find(y => y.discord_name == nameSelected).discord_id;
      },
      error(err) {
        console.error('did not work');
      }
    });

    // count and sort data
    this.reviews.pipe(take(1)).subscribe({
      next(x) {
        reviewsSelected = x.filter(y => y.recd_by == idSelected).map(review => {
          if (typeof review.week === 'number'){
            return review;
          }
          return {
            week: parseInt(review.week, 10),
            ...review
          };
        });

        reviewsSelected.sort((a, b) => {
          if (a.week < b.week){
            return -1;
          }
          if (a.week > b.week){
            return 1;
          } 
          return 0;
        });

        reviewsSelected.forEach(element => tableReviews.push(element));

        // counts unreviewed and unscored albums
        let unrev = 0;
        let unsc = 0;

        reviewsSelected.forEach(element => {
          if (element.score === '' && !element.review_text) {
            unrev++;
          } else if (element.score === 0) {
            unsc++;
          }
        });
        unreviewed.push(unrev);
        unscored.push(unsc);

        // counts scored albums
        for (let i = 1; i <= 10; i++) {
          let score = 0;
          reviewsSelected.forEach(element => {
            if (Math.floor(element.score) === i) {
              score++;
            }
          });
          dataset.push(score);
        }
        // calculate average of scores
        let scoreSum = 0
        let tally = 0;
        reviewsSelected.forEach(element => {
          if (!element.score) {
            return;
          } else {
            tally++;
            scoreSum = scoreSum + element.score;
          }
        });
        let avg = scoreSum / tally;
        average.push(avg.toFixed(2));
        return dataset;
      }
    });

    // push data to DOM
    this.barChartData[0].data = dataset;
    this.barChartData[0].label = `${nameSelected} - Scores Given`;
    this.data_unreviewed = unreviewed;
    this.data_unscored = unscored;
    this.data_avg = average;
    this.tableContent = tableReviews;
  }

  // event listeners on filter buttons to call data filter handler
  handleRecdBy(event: any) {
    this.header = 'rec';
    let idSelected;
    let reviewsSelected;
    let dataset = [];
    let unreviewed = [];
    let unscored = [];
    let average = [];
    let tableReviews = [];

    // select dataset from DOM
    const nameSelected = event.target.textContent;
    this.rec = nameSelected;

    // get user ID from users collection
    this.users.pipe(take(1)).subscribe({
      next(x) {
        idSelected = x.find(y => y.discord_name === nameSelected).discord_id;
      },
      error(err) {
        console.error('did not work');
      }
    });

    // count and sort data
    this.reviews.pipe(take(1)).subscribe({
      next(x) {
        reviewsSelected = x.filter(y => y.recd_by == idSelected).map(review => {
          if (typeof review.week === 'number'){
            return review;
          }
          return {
            week: parseInt(review.week, 10),
            ...review
          };
        });

        reviewsSelected.sort((a, b) => {
          if (a.week < b.week){
            return -1;
          }
          if (a.week > b.week){
            return 1;
          } 
          return 0;
        });

        reviewsSelected.forEach(element => tableReviews.push(element));

        // counts unreviewed and unscored albums
        let unrev = 0;
        let unsc = 0;
        reviewsSelected.forEach(element => {
          if (element.score === '' && !element.review_text) {
            unrev++;
          } else if (element.score === 0) {
            unsc++;
          }
        });
        unreviewed.push(unrev);
        unscored.push(unsc);

        // counts scored albums
        for (let i = 1; i <= 10; i++) {
          let score = 0;
          reviewsSelected.forEach(element => {
            if (Math.floor(element.score) === i) {
              score++;
            }
          });
          dataset.push(score);
        }

        // calculate average of scores
        let scoreSum = 0
        let tally = 0;
        reviewsSelected.forEach(element => {
          if (!element.score) {
            return;
          } else {
            tally++;
            scoreSum = scoreSum + element.score;
          }
        });
        let avg = scoreSum / tally;
        average.push(avg.toFixed(2));

        return dataset;
      }
    });
    // push data to DOM
    this.barChartData[0].data = dataset;
    this.barChartData[0].label = `${nameSelected} - Scores Received`;
    this.data_unreviewed = unreviewed;
    this.data_unscored = unscored;
    this.data_avg = average;
    this.tableContent = tableReviews;
  }
}
