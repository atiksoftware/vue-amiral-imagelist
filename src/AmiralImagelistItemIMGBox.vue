<template>
	<img :src="getSrc" alt="">
</template>
<script>
export default {
	name:"vue-amiral-imagelist-item-imgbox",
	props:{
		src : String
	}, 
	computed:{
		getSrc(){
			if(this.src.startsWith("http") || this.src.startsWith("//")){
				return this.src;
			}
			if(this.src == "" || this.src == "false" || this.src == false){
				return "";
			} 
			return this.src+this.src;
		}
	}
}
</script>
