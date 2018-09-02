<template>
  <div class="result-card card">
    <div class="card-header">
      <div class="card-header--fave">
        <button class="icon-button" v-on:click="toggleFave(cardData)">
          <b-icon icon="heart-outline" v-if="!cardData.favorite" ></b-icon>
          <b-icon icon="heart" v-if="cardData.favorite"></b-icon>
        </button>
      </div>
      <div class="card-header--title">
        {{cardData.title}}
      </div>
      <div class="card-header--price">
        ${{cardData.price}}
      </div>
    </div>
    <div class="card-body">
      <div class="card-body--image card-image" v-if="cardData.image">
        <img :src="cardData.image"/>
      </div>
      <div class="card-body--description">
        {{cardData.description}}
      </div>
      <div class="card-body--source-hide">
        <div class="card-body--source">
          from {{cardData.source}}
        </div>
        <div class="card-body--hide">
          <button class="button is-danger" v-if="!cardData.hide" v-on:click="hideResult(cardData)">
            <b-icon icon="eye-off-outline"></b-icon>
            <span class="hide-text">Hide</span>
          </button>
          <button class="button is-success" v-if="cardData.hide" v-on:click="showResult(cardData)">
            <b-icon icon="eye-outline"></b-icon>
            <span class="hide-text">Unhide</span>
          </button>
        </div>
      </div>
      <div class="card-footer">
        <a target="__blank" :href="cardData.link">Link</a>
        <div class="card-header--date">
          {{cardData.date}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from '../services/storage.service.js';
export default {
  name: 'ResultCard',
  props: {
    cardData: Object,
    description: String
  },
  methods: {
    toggleFave: function(card) {
      const fave = !card.favorite;
      console.log('card', card);
      if (fave) {
        // make call to save favorite to server
        Storage.saveFave(card)
          .then(result => {
            card.favorite = true;
          })
          .catch(err => {
            this.$toast.open({
              type: 'is-danger',
              message: 'ERROR ADDING RESULT TO FAVORITES!'
            });
          });
      } else {
        // make call to remove fave from server
      }
    },
    hideResult: function(card) {
      Storage.hideCard(card)
        .then(result => {
          this.$store.commit('hiddenCards', result.data.payload);
          this.$emit('hideCardAction', card);
        })
        .catch(err => {
          console.warn('hide result error', err);
          this.$toast.open({
            type: 'is-danger',
            message: 'ERROR HIDING RESULT!'
          });
        });
    },
    showResult(card) {
      Storage.showCard(card)
        .then(result => {
          console.log('show result result', result);
          if (result.data.error) {
            // @TODO: notify
          } else {
            this.$store.commit('hiddenCards', result.data.payload);
          }
        })
        .catch(err => {
          console.log('show result err', err);
        });
      card.hide = false;
    }
  },
  created() {
    if (
      this.cardData.hasOwnProperty('title') &&
      this.cardData.title &&
      this.cardData.title.length > 60
    ) {
      const titleShortened = this.cardData.title.substr(0, 56);
      this.cardData.title = titleShortened + '...';
    }
    if (
      this.cardData.hasOwnProperty('description') &&
      this.cardData.description &&
      this.cardData.description.length > 252
    ) {
      // console.warn('GREATER THAN 252');
      const dShortened = this.cardData.description.substr(0, 249);
      this.cardData.description = dShortened + '...';
    }
  }
};
</script>

/*eslint-disable */
<style lang="scss" scoped>
@import '../styles/shadows.scss';
@import '../styles/theme.scss';
@import '../styles/variables.scss';
.result-card {
  @include box_shadow(2);
  padding: $large-gap;
  background-color: #fff;
  width: 100%;
  .card-header,
  .card-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: bold;
  }
  .card-header {
    height: 48px;
    .card-header--fave {
      .icon-button {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
      }
    }
    .card-header--title {
      max-width: 35ch;
    }
  }
  .card-body--description {
    height: 144px;
  }
  .card-body--source-hide {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $standard-gap 0;
    .card-body--source {
      font-style: italic;
      color: $primary;
    }
    .card-body--hide button {
      .hide-text {
        margin-left: $small-gap;
      }
    }
  }
  .card-body--image {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 400px;
      max-height: 300px;
    }
  }
  .card-header--price {
    color: $success;
    font-size: 1.2em;
  }
}
</style>
/*eslint-enable */
