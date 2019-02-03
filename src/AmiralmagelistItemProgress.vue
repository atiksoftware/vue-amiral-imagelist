<template>
	<div class="vue-amiral-imagelist-item-progress" :value="isInfinite ? 'infinite' : getWidth">
		<div class="vue-amiral-imagelist-item-progress-content">
			<div class="vue-amiral-imagelist-item-progress-content-value">{{isInfinite ? percent : getWidth}}</div>
			<div class="vue-amiral-imagelist-item-progress-content-bar">
				<div class="vue-amiral-imagelist-item-progress-content-bar-over" v-if="isInfinite"></div>
				<div class="vue-amiral-imagelist-item-progress-content-bar-over" v-else :style="{'width' : getWidth}"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name : "vue-amiral-imagelist-item-progress",
	props : {
		percent : {
			default : 0
		}
	},
	model:{
		prop:"percent",
		event: "input"
	},
	computed:{
		getWidth(){
			return parseInt(this.percent) + "%"
		},
		isInfinite(){
			return isNaN(this.percent);
		}
	}
}
</script>


<style lang="less">
	@keyframes vueamiralimagelistprogessinfiniteanimation {
		0% {
			left:-30%;
			width:30%;
		}
		50% {
			left:100%;
			width:30%;
		}
		100% {
			left:-30%;
			width:30%;
		}
	}
	.vue-amiral-imagelist-item-progress{
		width:100%;
		height:100%;
		.vue-amiral-imagelist-item-progress-content{
			position: absolute;
			left: 50%;
			top:50%;
			transform: translateX(-50%) translateY(-50%);
			width:calc(~"100% - 10px");
			.vue-amiral-imagelist-item-progress-content-value{
				text-align:center;
				font-size: 11px;
				margin-bottom:5px;
			}
			.vue-amiral-imagelist-item-progress-content-bar{
				height:3px;
				width:100%;
				background: #aaa;
				position: relative;
				overflow: hidden;
				.vue-amiral-imagelist-item-progress-content-bar-over{
					position: absolute;
					left:0px;
					height: 100%;
					width:50%;
					background: rgb(26, 56, 228); 
					transition: all .3s;  
				}
			}
		} 
		&[value="infinite"]{
			.vue-amiral-imagelist-item-progress-content-value{
				opacity:0
			}
			.vue-amiral-imagelist-item-progress-content-bar-over{
				animation: vueamiralimagelistprogessinfiniteanimation 1.5s infinite;
  				animation-timing-function: linear;  
			}
		}
	}
</style>
