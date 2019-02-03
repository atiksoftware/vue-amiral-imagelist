import AmiralImagelist from './AmiralImagelist.vue';
import AmiralImagelistItem from './AmiralImagelistItem.vue';
import AmiralImagelistItemIMGBox from './AmiralImagelistItemIMGBox.vue';
import AmiralmagelistItemProgress from './AmiralmagelistItemProgress.vue';
import {defaults,setDefaults} from './config.js';

// module.exports = {
//   install: function (Vue, options) {
//     Vue.component('vue-amiral-imagelist', AmiralImagelist);
//     Vue.component('vue-amiral-imagelist-item', AmiralImagelistItem);
//     Vue.component('vue-amiral-imagelist-item-imgbox', AmiralImagelistItemIMGBox);
// 	Vue.component('vue-amiral-imagelist-item-progress', AmiralmagelistItemProgress);

// 	Vue.directive('vue-amiral-imagelist', AmiralImagelist)
	
// 	window.amiralimagelist = options ? Object.assign({},options) : {} 

// 	global.amiralimagelist = options ? Object.assign({},options) : {} 
//   }
// };
export default {
  install(Vue, options) {
    Vue.component('vue-amiral-imagelist', AmiralImagelist);
    Vue.component('vue-amiral-imagelist-item', AmiralImagelistItem);
    Vue.component('vue-amiral-imagelist-item-imgbox', AmiralImagelistItemIMGBox);
	Vue.component('vue-amiral-imagelist-item-progress', AmiralmagelistItemProgress);

	// Vue.directive('vue-amiral-imagelist', AmiralImagelist)

	Vue.prototype.$AmiralImagelistConfig = options ? setDefaults(options) : {} 

  }
};
