# gs-scraper

The point of this little project is to build something where I can search across multiple classifieds and garage/estate sale sites for the thing I am looking to buy all at once (usually retro video games).

THIS REPO HAS BEEN LEFT UP ONLY FOR EDUCATIONAL PURPOSES! This app does not fully work in its current state. The OfferUp library was taken down due to a DMCA notice (wrongfully so I believe, but neither the creator nor myself chose to do anything about it). I was only ever making this app for myself to find deals on retro gaming stuff and I realized that everytime one of these sources changed their API or site up, I was going to have to change how I scraped their data. I decided to abandon this project.

DO NOT EMAIL ME ASKING TO BUY THIS, ASKING ME TO FIX ANYTHING, OR ASKING ME FOR HELP! I'm not interested in doing anything else with this codebase and I have only left it here for other developers to reference (and possibly future me).

If you want to try and get it running, while I'm not sure what else might need to be done at this point because I haven't used this in years, I do know that you'll have to remove the OfferUp library and all references to it.

### Prerequisites

- mongodb installed and running
- node
- npm
- developer knowledge (sorry, I am going to provide help if you email me)

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
