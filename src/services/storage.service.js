export default {
  hideCard: function(card) {
    const hidden = this.getHiddenCards();
    if (hidden) {
      const ind = hidden.indexOf(card.id);
      if (ind < 0) {
        hidden.push(card.id);
        localStorage.setItem('hiddenCards', JSON.stringify(hidden));
      }
    } else {
      localStorage.setItem('hiddenCards', `["${card.id}"]`);
    }
  },
  getHiddenCards: function() {
    const hidden = localStorage.getItem('hiddenCards');
    if (hidden) {
      try {
        return JSON.parse(hidden);
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  },
  showCard: function(card) {
    const hidden = this.getHiddenCards();
    if (hidden) {
      const newHidden = [...hidden].filter(i => i !== card.id);
      localStorage.setItem('hiddenCards', JSON.stringify(newHidden));
    }
  },
  clearHidden: function() {
    localStorage.removeItem('hiddenCards');
  }
};
