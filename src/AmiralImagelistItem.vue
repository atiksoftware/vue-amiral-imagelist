<template>
	<div class="vue-amiral-imagelist-item" :itemtype="itemtype" @click="onClicked()">
		<div class="vue-amiral-imagelist-item-image" v-if="itemtype == 'image'">
			<vue-amiral-imagelist-item-imgbox :src="src" /> 
			<div class="vue-amiral-imagelist-item-remove" @click="removeme()">
				<v-icon dark>delete</v-icon>
			</div>
		</div>
		<div class="vue-amiral-imagelist-item-progress" v-if="itemtype == 'progress'">
			<v-progress-circular
				:rotate="-90"
				:size="64"
				:width="4"
				:value="percent"
				color="indigo"
				v-if="itemstatus == 'uploading'"
			> {{percent}} </v-progress-circular>
			<v-progress-circular
				:size="64"
				:width="4"
				color="indigo"
				indeterminate
				v-if="itemstatus == 'waiting'"
			></v-progress-circular> 
		</div>
		<div class="vue-amiral-imagelist-item-addNew" v-if="itemtype == 'addNew'">
			<div class="ntext">
				<v-icon >add</v-icon>
				<div class="text">
					Yeni Resim Ekle
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AmiralImagelistItemIMGBox from "./AmiralImagelistItemIMGBox"
	export default {
		name : "vue-amiral-imagelist-item-imgbox",
		props : {
			src : String,
			itemtype : String,
			itemstatus : String,
			percent : Number,
		},
		components:{
			'vue-amiral-imagelist-item-imgbox' : AmiralImagelistItemIMGBox
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
		}
	}
</script>

<style lang="less" scoped>
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
				.remove{
					opacity: 1;
				}
			}
		}
		&[itemtype="addNew"]{
			&:hover{ 
				border:3px solid #555;
			}
		}
		.vue-amiral-imagelist-item-image{
			width:100%;
			height: 100%;
			position: relative;
			img{ 
				width:100%;
				height: 100%;
				object-fit: cover;
			}
			.vue-amiral-imagelist-item-remove{
				position: absolute;
				right:0px;
				top:0px;
				background: red;
				width: 24px;
				text-align: center;
				opacity: 0;
				transition: all .3s;
				.v-icon{
					font-size:18px;
					line-height: 24px;
					display: block;
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
			&:hover{
				background: #555;
				color:#fff;
			}
			.ntext{
				line-height: normal;
				text-align: center;
				position: absolute;
				left: 50%;
				top:50%;
				width: 100%;
				transform: translateX(-50%) translateY(-50%);
				.v-icon{
					font-size: 50px;
					color: inherit
				}
				.text{
					font-size:11px;
					text-align: center;
				}
			}
		}
	}
</style>

