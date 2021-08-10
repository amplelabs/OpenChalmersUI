<template>
    <div class="slides">
        <div v-bind:style="{width: innerWidth + 'px'}" class="slides-inner" style="display:-webkit-inline-box">
            <div v-for="card in cardData" v-bind:key="card.name">
                <div class="card" >
                    <!-- img v-bind:src="card.image" alt="" -->
                    <img v-bind:src=responseCard.imageUrl>
                    <div class="text"
                      v-if="card.name"
                    >
                        <h3>{{ card.name }}</h3>
                        <p>{{ card.location }}</p>
                        <a v-bind:href="'tel:' + card.href">{{card.href}}</a>
                        <p><b>Meal time:</b> {{card.time}}</p>
                        <p><b>Who it serves:</b> {{card.serves}}</p>
                    </div>
                    <button class="directions"
                      v-if="card.name"
                    >
                        <p class="button"><b><a v-bind:href="responseCard.attachmentLinkUrl" target="_blank">See directions</a></b></p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'carousel',
  props: ['responseCard'],
  data() {
    return {
      innerWidth: 0,
      singleWidth: 0,
      lex: {},
    };
  },
  beforeMount() {
    this.lex = Object.assign({}, this.$store.state.lex);
    this.meal = Object.assign({}, this.$store.state.currMealJson);
    console.log(this.meal);
  },
  computed: {
    cardData() {
      // eslint-disable-next-line
      const regex = /The next free meal closest to you is at (.*?) at (.*?). ##  The meal began at (.*?);/gim;
      // eslint-disable-next-line
      const regex2 = /\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})/gim;
      // eslint-disable-next-line
      const regex3 = /## this agency serves (.*?). Please/gim;
      if (this.meal === null) {
        return [{
          name: null,
          location: null,
          href: null,
          time: null,
          serves: null,
          images: null,
        }];
      }
      return [{
        name: this.meal.organizationName,
        location: this.meal.address,
        href: this.meal.phone_number,
        time: this.meal.meals[0].startTime,
        serves: regex3.exec(this.lex.message)[1],
        image: '',
      }];
    },
  },
  methods: {
    goToPrev() {
      console.log('prev');
    },
    goToNext() {
      console.log('next');
    },
    cardClicked() {
      console.log(this.responseCard);
      const lexMsg = this.$store.state.lex.message;
      console.log(lexMsg);
      console.log('card clicked');
    },
    goToDirections() {
      // eslint-disable-next-line
      return `<p class="button"><b><a href="${this.responseCard.attachmentLinkUrl}" target="_blank">See directions</a></b></p>`;
    },
  },
};
</script>

<style scoped>

img {
    max-width: 100%;
    display: block;
    border-radius: 9px 9px 0 0;
}

.card {
    position: relative;
    margin-bottom: 10px;
    margin-top: 15px;
    box-shadow: 4px 4px 6px grey;
    display: inline-block;
    border-radius: 10px;
    background-color: white;
    width: 295px;
    margin-left: 10px;
}

.card:hover {
    box-shadow: 4px 4px 16px 0 grey;
    cursor: pointer;
}

p {
    margin-bottom: 0px;
}

.text {
    padding: 4px 7px;
    color: black;
}

.button {
    color: red;
}

.directions {
    border-top: 1px solid gray;
    padding: 10px;
    text-align: center;
    width: 100%;
}

.directions:active {
  background-color: #f2f2f2;
  border-radius: 0 0 10px 10px;
}

button:focus {
    outline: 0;
}

</style>
