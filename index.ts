import { Observable, of, from, fromEvent, concat, interval, Subscriber, throwError, Subject, asyncScheduler, asapScheduler, queueScheduler, merge } from 'rxjs'
import { map, filter, tap, mergeMap, catchError, take, takeUntil, flatMap,
        multicast, refCount, publish, share, publishBehavior, publishLast, publishReplay, observeOn } from 'rxjs/operators'
import { ajax, AjaxResponse } from 'rxjs/ajax'
import { allBooks, allReaders } from './data'

//#region Creating Observables

// let allBooksObservable$ = new Observable(subscriber => {

//     if(document.title !== 'RxBookTracker'){
//         subscriber.error('Incorrect page title');
//     }

//     for(let book of allBooks){
//         subscriber.next(book);
//     }

//     setTimeout(() => {
//         subscriber.complete();
//     }, 2000);

//     return () => console.log('Executing teardown code');
// });

// allBooksObservable$.subscribe(book => console.log(book.title) );

// let source1$ = of('hello', 10, true, false, allReaders[0].name);
// // source1$.subscribe(value => console.log(value));

// let source2$ = from(allBooks);
// // source2$.subscribe(value => console.log(value));

// concat(source1$, source2$)
//     .subscribe(value => console.log(value));

// let button = document.getElementById('readersButton');

// fromEvent(button, 'click').subscribe(event => {
//     console.log(event);
//     let readersDiv = document.getElementById('readers');

//     for(let reader of allReaders){
//         readersDiv.innerHTML += reader.name + '<br/>'
//     }
// });

// fromEvent(button, 'click')
//     .subscribe(event => {
//         ajax('/api/readers')
//         .subscribe(ajaxResponse => {
//             console.log(ajaxResponse);

//             let readersDiv = document.getElementById('readers');

//             for(let reader of ajaxResponse.response){
//                 readersDiv.innerHTML += reader.name + '<br/>'
//             }
//         });
// });

//#endregion
//#region Creating Observers

// let book$ = from(allBooks);

// let booksObserver = {
//     next: book => console.log('Title: ' + book.title),
//     error: error => console.log('Error:' + error),
//     complete: () => console.log('All done!')
// }

// // book$.subscribe(booksObserver);

// book$.subscribe( 
//     book => console.log('Title: ' + book.title),
//     error => console.log('Error:' + error),
//     () => console.log('All done!')
// )

// let currentTime$ = new Observable(subscriber => {
//     const timeString = new Date().toLocaleTimeString();
//     subscriber.next(timeString);
//     subscriber.complete();
// });
// currentTime$.subscribe(currentTime => console.log(`Observer1: ${currentTime}`))

// setTimeout(() => {
//     currentTime$.subscribe(currentTime => console.log(`Observer2: ${currentTime}`))
// }, 1000)

// setTimeout(() => {
//     currentTime$.subscribe(currentTime => console.log(`Observer2: ${currentTime}`))
// }, 2000)

// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');

// // let timer$ = interval(1000)

// let timer$ = new Observable(subscriber => {
//     let i = 0;
//     let intervalId = setInterval(() => {
//         subscriber.next(i++);
//     }, 1000);

//     return() =>{
//         console.log('Executing teardown code');
//         clearInterval(intervalId);
//     }
// })

// var timerSubscription = timer$.subscribe(
//     value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br/>`,
//     null,
//     () => console.log('All done!')
// );

// let timerConsoleSubscription = timer$.subscribe(
//     value => console.log(`${new Date().toLocaleTimeString()} (${value}) <br/>`),
// );

// timerSubscription.add(timerConsoleSubscription);

// fromEvent(button, 'click')
// .subscribe(
//     event => timerSubscription.unsubscribe()
// );

//#endregion

//#region Operators

// let source$ = of(1,2,3,4,5,8,9,22,5,53,2,1,6);

// source$.pipe(
//     map(value => value * 3),
//     map(value => value * 5),
//     filter(value => value % 2 == 0)
// )
// .subscribe(finalValue => console.log(finalValue));

// ajax('/api/errors/500')
// .pipe(
//     mergeMap(ajaxResponse => ajaxResponse.response),
//     filter(book => book.publicationYear < 1950),
//     tap(oldBook => console.log(`Title: ${oldBook.title}`)),
//     //catchError(err => of('yabloo, we are in error'))
//     catchError(err => throwError(err.message))
// )
// .subscribe(
//     finalValue => console.log(finalValue),
//     error => console.log(`ERROR: ${error}`)
// );


//  let timesDiv = document.getElementById('times');
//  let button = document.getElementById('timerButton');

//  let timer$ = new Observable(subscriber => {
//      let i = 0;
//     let intervalId = setInterval(() => {
//         subscriber.next(i++);
//     }, 1000);

//     return() =>{
//         console.log('Executing teardown code');
//      clearInterval(intervalId);
//     }
//  })

// let cancelTimer$ = fromEvent(button, 'click');

//   timer$
//   .pipe(
//       takeUntil(cancelTimer$)
//   )
//   .subscribe(
//     value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br/>`,
//     null,
//     () => console.log('All done!')
// );

//#endregion


//#region CustomOperators

// function grabAndLogClassics(year, log){
//     return source$ => {
//         return new Observable(subscriber => {
//             return source$.subscribe(
//                 book => {
//                     if(book.publicationYear < year){
//                         subscriber.next(book);
//                         if(log){
//                             console.log(book)
//                         }
//                     }
//                 }
//             ),
//             error => subscriber.error(error),
//             () => subscriber.complete()      
//         });
//     }
// }

// function grabClassics(year){
//     return filter(book => book.title < year);
// }

// function grabAndLogClassicsWithPipe(year, log){
//     return source$ => source$.pipe(
//         filter(x => x.publicationYear < year),
//         tap(x => log ? console.log(x.title) : null)    
//     );
// }

// ajax('/api/books')
//     .pipe(
//         flatMap(res => res.response),
//         grabAndLogClassicsWithPipe(1930, true)
//     )
//     .subscribe(
//         finalvalue => console.log(`BLOOP ${finalvalue.title}`),
//         error => console.log(`ERROR: ${error}`)
//     );

//#endregion

//#region Subjects and Multicasted Observables

// let subject$ = new Subject();

// subject$.subscribe(
//     value => console.log(`Observer 1: ${value}`)
// )

// subject$.subscribe(
//     value => console.log(`Observer 2: ${value}`)
// )

// subject$.next('Hello');

// let source$ = new Observable(s => {
//     s.next('Greetings!');
// });

// source$ = of(1,2,3,4,5,6,7);

// source$.subscribe(subject$);


// let source$ = interval(1000).pipe(
//     take(4),
//     publishReplay(),
//     refCount()
//     // share()
// )

// // let subject$ = new Subject();
// // source$.subscribe(subject$);

// source$.subscribe(
//     value => console.log(`Observer 1: ${value} `)
// )

// setTimeout(() => {
//     source$.subscribe(
//         value => console.log(`Observer 2: ${value} `)
//     )
// }, 1000)


// setTimeout(() => {
//     source$.subscribe(
//         value => console.log(`Observer 3: ${value} `)
//     )
// }, 2000)

// setTimeout(() => {
//     source$.subscribe(
//         value => console.log(`Observer 4: ${value} `),
//         null,
//         () => console.log('Observer 4 complete')
//     )
// }, 4500)

//source$.connect();
//#endregion

//#region Controlling Execution with Schedulers

// console.log('Start script');

// let queue$ = of('Queue scheduler (synchronous)', queueScheduler);
// let asap$ = of('asap scheduler (async micro)', asapScheduler);
// let async$ = of('Async scheduler (async)', asyncScheduler);

// merge(async$, asap$,  queue$)
// .subscribe(
//     value => console.log(value)
// );


// console.log('End script');

console.log('Start script');

from([1,2,3,4], queueScheduler).pipe(
    tap(value => console.log(`Value: ${value}`)),
    observeOn(asyncScheduler),
    tap(value => console.log(`Doubled: ${value * 2}`))
).subscribe();

// let queue$ = of('Queue scheduler (synchronous)', queueScheduler);
// let asap$ = of('asap scheduler (async micro)', asapScheduler);
// let async$ = of('Async scheduler (async)', asyncScheduler);

// merge(async$, asap$,  queue$)
// .subscribe(
//     value => console.log(value)
// );


console.log('End script');

//#endregion