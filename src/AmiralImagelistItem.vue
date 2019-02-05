<template>
	<div class="vue-amiral-imagelist-item" :itemtype="itemtype" @click="onClicked()">
		<div class="vaii-image" v-if="itemtype == 'image'">
			<img :src="getSrc" alt="">
			<div class="vaii-move-overlay">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M12 10c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-3.857 3c-.084-.321-.143-.652-.143-1s.059-.679.143-1h-2.143v-4l-6 5 6 5v-4h2.143zm7.714-2c.084.321.143.652.143 1s-.059.679-.143 1h2.143v4l6-5-6-5v4h-2.143zm-2.857 4.857c-.321.084-.652.143-1 .143s-.679-.059-1-.143v2.143h-4l5 6 5-6h-4v-2.143zm-2-7.714c.321-.084.652-.143 1-.143s.679.059 1 .143v-2.143h4l-5-6-5 6h4v2.143z"/></svg>
			</div>
			<div class="vaii-btn-display" @click="displayme()">
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M14 12c0 1.103-.897 2-2 2s-2-.897-2-2 .897-2 2-2 2 .897 2 2zm10-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-8 .449c0-2.208-1.791-4-4-4-2.208 0-4 1.792-4 4 0 2.209 1.792 4 4 4 2.209 0 4-1.791 4-4z"/></svg>
			</div>
			<div class="vaii-btn-remove" @click="removeme()">
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
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
			if(this.$AmiralImagelistConfig){
				// var cfg = this.$AmiralImagelistConfig;
				// var lessvars = {};
				// Object.keys(cfg).map(function(_key, index) {
				// 	if(_key.startsWith("theme_color_")){
				// 		var key = _key.replace("theme_color_","vail_color_");
				// 		var val = cfg[key];
				// 		lessvars[ key ] = val;
				// 	} 
				// }); 
				// less.modifyVars(lessvars);less.refreshStyles()
			}
			 
		},
		methods : {
			onClicked(){
				if(this.itemtype == 'addNew'){
					this.$emit("clicked");
				}
			},
			removeme(){
				this.$emit("removeme");
			},
			displayme(){
				this.$emit("displayme");
			}
		},
		computed: {
			getAddNewtext(){
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.text_add_new
				}
				return "Add New"
			},
			getSrc(){
				if(this.src.startsWith("http") || this.src.startsWith("//")){
					return this.src;
				}
				if(this.src == "" || this.src == "false" || this.src == false){
					return "";
				}  
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.view_path_prefix + this.src;
				} 
				return this.src;
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
		transition: all .3s; 
		&[itemtype="image"]{
			&:hover{ 
				border:3px solid rgb(63,81,181);
				// box-shadow: 0 0 4px #3f51b5;
				.vaii-move-overlay,
				.vaii-btn-display,
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
			.vaii-move-overlay{
				width:100%;
				height:100%;
				position:absolute;
				left:0px;
				top:0px;
				background: #3f51b5;
				opacity: 0;
				transition: all .3s; 
				svg{
					position: absolute;
					left: 50%;
					top:50%;
					width: 100%;
					transform: translateX(-50%) translateY(-50%);
					path{
						fill: #fff;
					}
				}
			}
			.vaii-btn-display{
				position: absolute;
				left: 0px;
				top: 0px;
				background: #fff; 
				text-align: center;
				opacity: 0;
				transition: all .3s; 
				padding: 2px;
				box-sizing: border-box;  
				svg{
					display:block;
					margin:3px;
					path{
						fill: #3f51b5;
					}
				}
			}
			.vaii-btn-remove{
				position: absolute;
				right: 0px;
				top: 0px;
				background: red; 
				text-align: center;
				opacity: 0;
				transition: all .3s; 
				padding: 2px;
				box-sizing: border-box; 
				&:hover{
					background-color: #ba0606;
				}
				svg{
					display:block;
					margin:3px;
					path{
						fill: #fff;
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

