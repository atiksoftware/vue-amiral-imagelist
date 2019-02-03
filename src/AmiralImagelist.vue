<template>
	<div class="vue-amiral-imagelist"> 
		<span class="vue-amiral-imagelist-items">
			<draggable v-model="imagesHandle" @change="updateList($event, imagesHandle)" :options="{disabled:getIsDraggableDisabled}" >
				<vue-amiral-imagelist-item v-for="(item,itemIndex) in imagesHandle" :key="itemIndex" :src="item" v-on:removeme="removeImage(itemIndex)" itemtype="image" itemstatus="success"/>  
			</draggable>
		</span>
		<span class="vue-amiral-imagelist-action">
			<vue-amiral-imagelist-item v-for="(item,itemIndex) in uploadQueue" :key="itemIndex" v-show="item.onProgress" itemtype="progress" :itemstatus="item.status" :percent="item.percent"/>  
			<vue-amiral-imagelist-item itemtype="addNew" v-on:clicked="doOpenNewFile()" v-show="getMaxLimitBalance > 0" />
		</span> 
	</div>
</template>

<script> 
	import Item from "./AmiralImagelistItem.vue"
	import draggable from 'vuedraggable'
	import { type } from 'os';
	export default {
		name : "vue-amiral-imagelist",
		props:{
			mediagroup : {
				type : String,
				default : ""
			},	
			images : Array,
			limit : {
				default : ""
			},
		},
		model: {
			prop: "images",
			event: "input"
		},
		components:{
			'vue-amiral-imagelist-item' : Item ,
			draggable
		},
		data: () => ({  
			uploadQueue : [  ],
			imagesHandle : []
		}),
		watch:{
			images(n){
				this.imagesHandle = n;
			}
		},
		mounted(){
			this.imagesHandle = this.images;
		},
		methods:{
			doOpenNewFile(){ 
				var self = this;
				var fs = document.createElement("input");
				fs.setAttribute("type", "file");
				fs.setAttribute("accept", self.getAcceptFiletype);
				fs.setAttribute("multiple", "");
				fs.value = "";
				fs.click();
				fs.addEventListener(
					"change",
					function(event) {
						var maxAddLimit = self.getMaxLimitBalance
						for(var i = 0; i < fs.files.length && i < maxAddLimit ;i++){
							self.filesSelected(fs.files[i]);
						} 
					},
					false
				);
			},
			filesSelected(file) {
				var self = this; 
				var QueueLine = {
					filename    : file.name,
					filesize    : file.size,
					file        : file,
					percent     : 0,
					onProgress  : true,
					status      : "uploading",
				}
				this.uploadQueue.push(QueueLine) 

				var xhr = new XMLHttpRequest(); 
				xhr.open(
					"POST",
					this.getUploadTargetUrl,
					true
				);
				xhr.timeout = 3000000;

				xhr.addEventListener("load", function(event) { 
				});
				xhr.addEventListener("error", function() {
					QueueLine.onProgress = false;
					console.log("%c An arror while image uploading", 'background: #990014; color: #fff;padding:5px')
				});
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						try {
							var result = JSON.parse(xhr.responseText); 
							if (result.status == "success") { 
								if(typeof result.url != "undefined"){
									self.images.push(result.url.toString());
								}
								else{
									console.log("%c An arror while image uploading: Result has not contain 'url' key as an url", 'background: #990014; color: #fff;padding:5px')
								}
							}
							else{
								console.log("%c An arror while image uploading: Result has not contain 'status' key as 'success'", 'background: #990014; color: #fff;padding:5px')
							}
							QueueLine.onProgress = false;
						} catch (e) {
							QueueLine.onProgress = false;
							console.log("%c An arror while image uploading: Response is not JSON format", 'background: #990014; color: #fff;padding:5px')
						}
						QueueLine.onProgress = false;
					}
				};
				var onProgressHandler = function(event) {
					var percent = Math.round((event.loaded / event.total) * 100);
					QueueLine.percent = percent;
					if(percent == 100){ 
						QueueLine.percent = "waiting";
						QueueLine.status = "waiting";
					}
				};
				xhr.upload.addEventListener("progress", onProgressHandler);
				xhr.addEventListener("progress", onProgressHandler);
				var formdata = new FormData();
				formdata.append(self.getPostFieldName, QueueLine.file); 
				xhr.send(formdata);
			},
			updateList(e,g){ 
				this.$emit('input', g)
			},
			removeImage(i){
				this.imagesHandle.splice(i,1);
				this.$emit('input', this.imagesHandle)
			}
			
		},
		computed:{ 
			getUploadTargetUrl(){
				if(this.$AmiralImagelistConfig){
					var cfg = this.$AmiralImagelistConfig
					var url = cfg.upload_target_url
					if(this.mediagroup && this.mediagroup != ""){
						if(cfg.upload_group_method == "path"){
							url = url.replace(/\/$/g,"");
							url += "/" + this.mediagroup
						}
						if(cfg.upload_group_method == "query"){
							if(url.includes("?")){
								url += "&" + cfg.upload_group_query_key + "=" + this.mediagroup
							}
							else{
								url += "?" + cfg.upload_group_query_key + "=" + this.mediagroup
							}
						}
					}
					return url;
				}
				return "/"
			},
			getAcceptFiletype(){ 
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.upload_accept_filetype
				} 
				return "image/*"
			},
			getMaxLimit(){
				if(this.limit != ""){
					return parseInt(this.limit)
				}
				return 999;
			},
			getMaxLimitBalance(){
				var count = 0;
				count += this.imagesHandle.length;
				for(var i = 0; i < this.uploadQueue.length; ++i){
					if(this.uploadQueue[i].onProgress) count++;
				} 
				return this.getMaxLimit - count;
			},
			getIsDraggableDisabled(){ 
				if(this.$AmiralImagelistConfig){
					return !this.$AmiralImagelistConfig.draggable
				} 
				return false
			},
			getPostFieldName(){
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.upload_post_field_name
				} 
				return "file" 
			}
		}
	}
</script>


<style lang="css" >
	.vue-amiral-imagelist{
		overflow: hidden;
		margin:0px -5px; 
	}
	.vue-amiral-imagelist-items{
		background : #ccc;  
	}
	.vue-amiral-imagelist-action::after{
		display: block;
		content: '';
		clear: both;
	}
</style>
