import AmiralImagelist from './AmiralImagelist.vue';
import AmiralImagelistItem from './AmiralImagelistItem.vue';
import AmiralImagelistItemIMGBox from './AmiralImagelistItemIMGBox.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('vue-amiral-imagelist', AmiralImagelist);
    Vue.component('vue-amiral-imagelist-item', AmiralImagelistItem);
    Vue.component('vue-amiral-imagelist-item-imgbox', AmiralImagelistItemIMGBox);
  }
};
