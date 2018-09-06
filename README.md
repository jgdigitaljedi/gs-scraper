# gs-scraper

The point of this little project is to build something where I can search across multiple classifieds and garage/estate sale sites for the thing I am looking to buy all at once (usually retro video games). 

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
- form validation on search form (need to have it disable search button if fields are blank)
- look into using VarageSale and Oodle
- add more garage sale search sites
- refactor to be even more modular
- make it look good
- re-implement LetGo
- add eBay search
- possibly make an electron app (can use indexDB or jsonStorage instead of mongo) or vuido app (would just stand up DigitalOcean droplet to handle backend)?

## Crazy ideas
- rename to be Retro Collector Toolbox and add a whole collection manager (like my repo [HERE](https://github.com/jgdigitaljedi/vg-collection-manager))
