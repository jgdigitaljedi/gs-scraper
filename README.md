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

## Notes

- some of the salesServices are really similar. I thought about making 1 method to replace a few of them and calling it with different arguments, but I like the sepration of concerns that exists if any sort of changes were to happen to a particular source so I'm leaving it. Same goes for the backend services.

## Future Plans

- clean it up; lots of loose ends
- add more garage sale search sites
- refactor to be even more modular
- make it look good
- re-implement LetGo
- possibly make an electron app (can use indexDB or jsonStorage instead of mongo) or vuido app (would just stand up DigitalOcean droplet to handle backend)?

I was going to take this a lot further originally, but some of the ideas I came up with seemed better suited for a website/business idea I had which I will be prusuing in a private repo after this is "finished enough".
