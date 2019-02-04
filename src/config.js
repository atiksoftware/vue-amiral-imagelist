let defaults = {
    /** images will send this url
     *  then, should return JSON data like this :
     *  { "status" : "success", "url" : "/images/products/image.jpg" }
     */
    upload_target_url : "/api/fileupload", 

    /** this value for detect files which list
     * example: you will use mediagroup="product" attribute on component
     * and this value will append to url as path or as query
     * path ex: "/api/fileupload/product"
     * query ex: "/api/fileupload/?upload_group=product"
     * path is recommended for MVC
     */
    upload_group_method : "path",
    /** this value will use as key of query if upload_group_method equal query  
     * example : /api/fileupload?mediagroup=profile
    */
    upload_group_query_key : "mediagroup",

    upload_post_field_name : "file",
    
    upload_accept_filetype : "image/*",

    /** images will view on imagelist with this prefix url
     *  example: your image array list ["/images/products/image1.jpg","/images/products/image2.jpg"]
     * 	but your absolute url is "http://cdn.mysite.com/images/products/image1.jpg"
     *  then, you can use "http://cdn.mysite.com" as PathPrefix
     */
    view_path_prefix : "/storage",


    /** not need explain this keys,
     *  keys already look like understandable
     */
    theme_color_border : "#ccc",
    theme_color_border_hover : "#3f51b5",
    theme_color_action_border : "#ccc",
    theme_color_action_text : "#ccc",
    theme_color_action_hover_border : "#555",
    theme_color_action_hover_background : "#555",
    theme_color_action_hover_text : "#fff",
    theme_color_progress_background : "#ddd",
    theme_color_progress_bar : "#3f51b5",

    theme_size_slot : "100px",
    theme_size_margin : "5px",

    text_add_new : "Yeni Ekle",

    draggable : true
}

export function setDefaults(options) {
    defaults = Object.assign({}, defaults, options);
    return defaults;
}

export default setDefaults;