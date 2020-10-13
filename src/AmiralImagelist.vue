<template>
	<div class="vue-amiral-imagelist"> 
		<span class="vue-amiral-imagelist-items">
			<draggable v-model="imagesHandle" @change="updateList($event, imagesHandle)" :options="{disabled:getIsDraggableDisabled}" >
				<vue-amiral-imagelist-item v-for="(item,itemIndex) in imagesHandle" :key="itemIndex" :src="item" v-on:removeme="removeImage(itemIndex)" v-on:displayme="displayme(itemIndex)" itemtype="image" itemstatus="success"/>  
			</draggable>
		</span>
		<span class="vue-amiral-imagelist-action">
			<vue-amiral-imagelist-item v-for="(item,itemIndex) in uploadQueue" :key="itemIndex" v-show="item.onProgress" itemtype="progress" :itemstatus="item.status" :percent="item.percent"/>  
			<vue-amiral-imagelist-item itemtype="addNew" v-on:clicked="doOpenNewFile()" v-show="getMaxLimitBalance > 0" :maxlimit="getMaxLimit" :maxlimitalready="getMaxLimitAlready"/>
		</span> 
		<div class="vue-amiral-imagelist-display" v-if="display.show" @click="displayme(-1)">
			<div class="vue-amiral-imagelist-display-close">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
			</div>
			<div class="vue-amiral-imagelist-display-content">
				<img :src="getDisplaySrc" alt="">
			</div>
		</div>
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
			headers: {
        			type: Object,
       				default: null
			},
			images : Array,
			limit : {
				default : ""
			},
			sizetype : {
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
			imagesHandle : [],
			display: {
				show : false,
				src : ""
			}
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
			dataURLToBlob(dataURL,filename) {
				var BASE64_MARKER = ';base64,';
				if (dataURL.indexOf(BASE64_MARKER) == -1) {
					var parts = dataURL.split(',');
					var contentType = parts[0].split(':')[1];
					var raw = parts[1];

					return new Blob([raw], {type: contentType},filename);
				}

				var parts = dataURL.split(BASE64_MARKER);
				var contentType = parts[0].split(':')[1];
				var raw = window.atob(parts[1]);
				var rawLength = raw.length;

				var uInt8Array = new Uint8Array(rawLength);

				for (var i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}

				return new Blob([uInt8Array], {type: contentType},filename);
			},
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
				var fr = new FileReader; 
				fr.onload = function() { 
					var img = new Image; 
					img.onload = function() {
						var o = img.width / img.height
						var t = "s";
						if(o > 1.35){ t = "h"}; 
						if(o < 0.85){t = "v"};  
						if(!self.getSizetypes.includes(t)){
							return ;
						} 
						var ex = file.name.split('.').pop().toLowerCase();
						if( ex == "jpg" || ex == "jpeg"){
							var canvas = document.createElement('canvas'),
								max_size = 5000, 
								width = img.width,
								height = img.height; 
							if(self.$AmiralImagelistConfig){ 
								max_size = self.$AmiralImagelistConfig.upload_accept_maxsize
							}
							if (width > height) {
								if (width > max_size) {
									height *= max_size / width;
									width = max_size;
								}
							} else {
								if (height > max_size) {
									width *= max_size / height;
									height = max_size;
								}
							}
							canvas.width = width;
							canvas.height = height;
							canvas.getContext('2d').drawImage(img, 0, 0, width, height);
							var dataUrl = canvas.toDataURL('image/jpeg');
							var resizedImage = self.dataURLToBlob(dataUrl,file.name);

							self.filesSelectedUpload(resizedImage,file.name,resizedImage.size); 
						}
						else{
							self.filesSelectedUpload(file,file.name,file.size); 
						}

					}; 
					img.src = fr.result; 
				}; 
				fr.readAsDataURL(file);
			},
			filesSelectedUpload(file,filename,filesize) { 
				var self = this; 
				var QueueLine = {
					filename    : filename,
					filesize    : filesize,
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
				
				const headers = Object.assign({}, this.$AmiralImagelistConfig.headers, this.headers)

				if(Object.keys(headers).length >0 ){
				  Object.keys(headers).forEach(key=>{
				    xhr.setRequestHeader(key, headers[key])
				  })
				}
				
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
				formdata.append(self.getPostFieldName, QueueLine.file,QueueLine.filename); 
				xhr.send(formdata);
			},
			updateList(e,g){ 
				this.$emit('input', g)
			},
			removeImage(i){
				this.imagesHandle.splice(i,1);
				this.$emit('input', this.imagesHandle)
			},
			displayme(i){
				if(i >= 0){
					this.display.src = this.imagesHandle[i]
					this.display.show = true
				}
				else{
					this.display.show = false
				}
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
			getMaxLimitAlready(){
				var count = 0;
				count += this.imagesHandle.length;
				for(var i = 0; i < this.uploadQueue.length; ++i){
					if(this.uploadQueue[i].onProgress) count++;
				} 
				return count;
			},
			getMaxLimitBalance(){
				var count = 0;
				count += this.imagesHandle.length;
				for(var i = 0; i < this.uploadQueue.length; ++i){
					if(this.uploadQueue[i].onProgress) count++;
				} 
				return this.getMaxLimit - this.getMaxLimitAlready;
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
			},
			getSizetypes(){
				if(this.sizetype != ""){
					return this.sizetype.split("")
				}
				return ["h","v","s"]
			},
			getDisplaySrc(){
				if(this.display.src.startsWith("http") || this.display.src.startsWith("//")){
					return this.src;
				}
				if(this.display.src == "" || this.display.src == "false" || this.display.src == false){
					return "";
				}  
				if(this.$AmiralImagelistConfig){
					return this.$AmiralImagelistConfig.view_path_prefix + this.display.src;
				} 
				return this.display.src;
			}
		}
	}
</script>


<style lang="less" >
	@vail_color_border : "#ccc";
	
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
	.vue-amiral-imagelist-display{
		position: fixed;
		left:0px;
		top:0px;
		right:0px;
		bottom:0px;
		background-color: rgba(0,0,0,.8);
		z-index: 100;
		cursor: pointer;
		.vue-amiral-imagelist-display-close{
			position:absolute;
			right:5px;
			top:5px;
			height:40px;
			width:40px;
			background : #000;
			z-index: 3;
			svg{
				display:block;
				margin:8px;
				path{
					fill:#fff
				}
			}
		}
		.vue-amiral-imagelist-display-content{ 
			position: relative;
			height:calc(~"100% - 100px") !important;
			max-width:calc(~"100% - 100px") !important;
			margin:50px auto;
			img{
				max-width:100%;
				max-height:100%;
				object-fit: contain; 
				position: absolute;
				left:50%;
				top:50%;
				transform: translateX(-50%) translateY(-50%);
			}
		}
	}
</style>
