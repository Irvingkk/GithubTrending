## Github Trending React Native App
Github Explore is a great feature! On the site, there are thousands of developers each day 
to flip through the repositories, and discover the most creative and useful API or projects.
Therefore, the idea of this app is to provide a portable and flexible way to check of Github 
community right on your phone.   
This app allows you to search the repos by programming languages or the technology such as IOS, ReactJS, and browse 
repos on the app's build in browser.  
Besides, you can save the repos you like and check them in a section. We also add filter and subscribe function, which allows you to 
only browse and track your interested types of repos.

## Screenshots
![<img src="screenshots/popularPage.jpg"
width="50" height="50"](screenshots/popularPage.jpg)
![<img src="screenshots/popularPage.jpg" align="left"
width="250"
hspace="10" vspace="10">](screenshots/trendingPage.jpg)
![](screenshots/trendingTimeSpan.jpg)
![](screenshots/browser.jpg)
![](screenshots/favoritePage.jpg)
![](screenshots/myPage.jpg)
![](screenshots/myPageAbout.jpg)

## App features
- users can filter repos based on language or technology and save that filter in the setting page.
- dynamic and scrollable top tabs
- users can save the repos they like and check them in the page called favorite.
- users can share the repos they like to others.

## Get Started
1. run `npm install` or `yarn install` on root repo；
2. switch to ios file and run `pod setup` to pull the newest pod library；
3. run `pod install`to install the ios dependencies；
4. Go back to root repo and run `react-native run-android` or `react-native run-ios` to start app；


## App Components
- Top, bottom and stack navigator combined for page navigation.
- Redux used to manage states among React components.
- DAO layer to fetch or save data of Github repos
- local database AsyncStore used to achieve offline caching

## Library and Dependencies
- @react-native-async-storage/async-storage     -- offline caching
- Redux                                         -- centralize state
- react-native-event-bus                        -- broadcast & receive event
- react-navigation                              -- used for navigation
- react-native-event-bus                        -- broadcast & receive event
- react-native-easy-toast                       -- toast message
- react-native-parallax-scroll-view             -- parallax scroll view
- react-native-vector-icons                     -- vector icons- react-native-webview                          -- browser inside app

