<template>
	<div class="vue-amiral-imagelist-item" :itemtype="itemtype" @click="onClicked()">
		<div class="vaii-image" v-if="itemtype == 'image'">
			<vue-amiral-imagelist-item-imgbox :src="src" /> 
			<div class="vaii-btn-remove" @click="removeme()">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
			</div>
		</div>
		<div class="vue-amiral-imagelist-item-progress" v-if="itemtype == 'progress'">
			<vue-amiral-imagelist-item-progress v-model="percent"></vue-amiral-imagelist-item-progress> 
		</div>
		<div class="vue-amiral-imagelist-item-addNew" v-if="itemtype == 'addNew'">
			<div class="vaii-ntext">
				<div class="vaii-icon">
					<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"/></svg>
				</div>
				<div class="vaii-text">
					{{getAddNewtext}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AmiralImagelistItemIMGBox from "./AmiralImagelistItemIMGBox.vue"
	import AmiralmagelistItemProgress from "./AmiralmagelistItemProgress.vue"
	export default {
		name : "vue-amiral-imagelist-item",
		props : {
			src : String,
			itemtype : String,
			itemstatus : String,
			percent : {
				default : 0
			},
		},
		components:{
			'vue-amiral-imagelist-item-imgbox' : AmiralImagelistItemIMGBox,
			'vue-amiral-imagelist-item-progress' : AmiralmagelistItemProgress
		},
		data: () => ({
			 	
		}),
		mounted(){
			 
		},
		methods : {
			onClicked(){
				if(this.itemtype == 'addNew'){
					this.$emit("clicked");
				}
			},
			removeme(){
				this.$emit("removeme");
			}
		},
		computed: {
			getAddNewtext(){
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.text_add_new
				}
				return "Add New"
			}
		}
	}
</script>

<style lang="less" >
	.vue-amiral-imagelist-item{
		width:100px;
		height:100px;
		border:3px solid #ccc;
		float: left;
		margin:5px;
		cursor: pointer;
		overflow: hidden;
		user-select: none;
		transition: all .3; 
		&[itemtype="image"]{
			&:hover{ 
				border:3px solid rgb(63,81,181);
				box-shadow: 0 0 4px #3f51b5;
				.vaii-btn-remove{
					opacity: 1;
				}
			}
		}
		&[itemtype="addNew"]{
			&:hover{ 
				border:3px solid #555;
			}
		}
		.vaii-image{
			width:100%;
			height: 100%;
			position: relative;
			img{ 
				width:100%;
				height: 100%;
				object-fit: cover;
			}
			.vaii-btn-remove{
				position: absolute;
				right: 3px;
				top: 3px;
				background: white;
				width: 28px;
				text-align: center;
				opacity: 0;
				transition: all .3s;
				height: 28px;
				padding: 2px;
				box-sizing: border-box;
				border-radius: 50%;
				svg{
					path{
						fill: #f00;
					}
				}
			}
		}
	}  
	  
	.vue-amiral-imagelist-item-progress{
		position: relative;
		width:100%;
		height: 100%;
		.v-progress-circular{ 
			position: absolute;
			left: 50%;
			top:50%;
			width: 100%;
			transform: translateX(-50%) translateY(-50%);
		}
	}

	.vue-amiral-imagelist-item-addNew{ 
		position: relative;
		width:100%;
		height: 100%;
		background: #fff;
		color:#888;
		transition: all .3;
		.vaii-ntext{
			line-height: normal;
			text-align: center;
			position: absolute;
			left: 50%;
			top:50%;
			width: 100%;
			transform: translateX(-50%) translateY(-50%);
			.vaii-icon{ 
				color: inherit;
				svg{
					path{
						transition: all .3;
					}
				}
			}
			.vaii-text{
				font-size:11px;
				text-align: center;
			}
		}
		&:hover{
			background: #555;
			color:#fff;
			.vaii-icon{
				svg{
					path{
						fill : #fff;
					}
				}
			}
		}
		
	}
 
</style>

