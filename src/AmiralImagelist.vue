<template>
	<div class="vue-amiral-imagelist"> 
		<span class="vue-amiral-imagelist-items">
			<draggable v-model="imagesHandle" @change="updateList($event, imagesHandle)" >
				<vue-amiral-imagelist-item v-for="(item,itemIndex) in imagesHandle" :key="itemIndex" :src="item" v-on:removeme="removeImage(itemIndex)" itemtype="image" itemstatus="success"/>  
			</draggable>
		</span>
		<span class="vue-amiral-imagelist-action">
			<vue-amiral-imagelist-item v-for="(item,itemIndex) in uploadQueue" :key="itemIndex" v-show="item.onProgress" itemtype="progress" :itemstatus="item.status" :percent="item.percent"/>  
			<vue-amiral-imagelist-item itemtype="addNew" v-on:clicked="doOpenNewFile()" />
		</span> 
	</div>
</template>

<script> 
	import Item from "./AmiralImagelistItem"
	import draggable from 'vuedraggable'
import { type } from 'os';
	export default {
		name : "vue-amiral-imagelist",
		props:{
			mediagroup : String,	
			images : Array	
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
			default_config : {
				url : {
					uploadTo : "/api/fileupload",
					viewprefix : "/storage"
				},
				accept : "image/*",
				theme : {
					color : {
						border : "#ccc",
						borderHover : "#3f51b5",
						actionBorder : "#ccc",
						actionText : "#ccc",
						actionHoverBorder : "#555",
						actionHoverBackground : "#555",
						actionHoverText : "#fff",
						progress : "#3f51b5",
					},
					size : {
						slot : "100px",
						margin : "5px"
					},
					text : {
						addNew : "Yeni Ekle"
					}
				},
				draggable : true
			},
			uploadQueue : [ ],
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
				fs.setAttribute("accept", "image/*");
				fs.setAttribute("multiple", "");
				fs.value = "";
				fs.click();
				fs.addEventListener(
					"change",
					function(event) {
						for(var i = 0; i < fs.files.length;i++){
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
					process.env.VUE_APP_BASE_URL + "/api/admin/uploadfile/"+self.mediagroup,
					true
				);
				xhr.timeout = 3000000;

				xhr.addEventListener("load", function(event) {});
				xhr.addEventListener("error", function() {
					QueueLine.onProgress = false;
					console.log("An arror while image uploading")
				});
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						try {
							var result = JSON.parse(xhr.responseText); 
							if (result.status == "success") { 
								if(typeof result.image != "undefined"){
									self.images.push(result.image.toString());
								}
								else{
									console.log("An arror while image uploading: Result has not contain 'url' key as an url")
								}
							}
							else{
								console.log("An arror while image uploading: Result has not contain 'status' key as 'success'")
							}
							QueueLine.onProgress = false;
						} catch (e) {
							QueueLine.onProgress = false;
							console.log("An arror while image uploading: Response is not JSON format")
						}
						QueueLine.onProgress = false;
					}
				};
				var onProgressHandler = function(event) {
					var percent = Math.round((event.loaded / event.total) * 100);
					QueueLine.percent = percent;
					if(percent == 100){ 
						QueueLine.status = "waiting";
					}
				};
				xhr.upload.addEventListener("progress", onProgressHandler);
				xhr.addEventListener("progress", onProgressHandler);
				var formdata = new FormData();
				formdata.append("file", QueueLine.file); 
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
		}
	}
</script>


<style lang="less" scoped>
	.vue-amiral-imagelist{
		overflow: hidden;
		margin:0px -5px; 
		.vue-amiral-imagelist-items{
			background:#ccc;  
		}
		.vue-amiral-imagelist-action{ 
			&::after{
				display: block;
				content: '';
				clear: both;
			}
		} 
	}
</style>
