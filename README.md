# gs-scraper

The idea is to build an app that scrapes data from local Craigslist, various websites, etc for deals on the types of items I'm looking for. Mainly, I'm a retro video game collector so I will be developing this to find deals on retro gaming stuff or even garage sales with listings that mention certain key words that I might like to visit in hopes of finding retro gaming stuff.

Currently it can search Craiglist and OfferUp for listings and Craigslist for garage sales. I had LetGo working purely in the browser if I had CORS turned off and recently hit the site to have a user token, but I removed that and will eventually try to add it back server side with some web scraping instead of spoofing their API. I've also figured out the basics to pull garage sales from estatesales.net but haven't fully wired that in yet.

Also, I'm almost always entirely focused on functionality before style so this won't be the prettiest app until I get it doing everything I want it to do.

### Prerequisites
- mongodb installed and running
- node
- npm

### Project setup

```
npm i
```

### Compiles and hot-reloads for development in electron window

```
npm start
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## Future Plans
- re-implement LetGo
- add eBay search
- add more garage sale search sites
- refactor to be even more modular
- possibly make an electron app (can use indexDB or jsonStorage instead of mongo)?
- make it look good
