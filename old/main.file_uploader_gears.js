$.uploadg=function(input, opt){
	var ME=this;
	
    var desktop = google.gears.factory.create('beta.desktop');
    var request = google.gears.factory.create('beta.httprequest');
	
	ME.option = {
		gate:'',
		
		
		dragEnterColor:'#ffc',
		dragExitColor:'#fff',
		
		beforeLoad:function() {},
		onProgress:function(event) {},
		onComplete:function(event) {}
	};

	if(typeof(opt)=='string'){
		opt={'gate':opt};
	}
	
	ME.option = $.extend(this.option,opt);
	ME.upload = function upload(event) {

		
		
		
		
		ME.option.beforeLoad();
		//alert(1);
		/*
		if(!ME.can_proceed){
			return false;
		}
		*/		
		
        var data = desktop.getDragData(event, 'application/x-gears-files');                
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var dashdash = '--';
        var crlf     = '\r\n';
        
        /* Build RFC2388 string. */
        var builder = google.gears.factory.create('beta.blobbuilder');
 
        builder.append(dashdash);
        builder.append(boundary);
        builder.append(crlf);
        alert(data.files.length);
        if(data.files.length>0){
	        for (var i in data.files) {
	 
	            var file = data.files[i];
	            
	            /* Generate headers. */
	            builder.append('Content-Disposition: form-data; name="file[]"');
	            
	            if (file.name) {
	              builder.append('; filename="' + file.name + '"');
	            }
	            builder.append(crlf);
	            
	            builder.append('Content-Type: application/octet-stream');
	            builder.append(crlf);
	            builder.append(crlf); 
	            
	            /* Append binary data. */
	            builder.append(file.blob);
	            builder.append(crlf);
	    
	            /* Write boundary. */
	            builder.append(dashdash);
	            builder.append(boundary);
	            builder.append(crlf); 
	        }
	        
	        /* Mark end of the request. */
	        builder.append(dashdash);
	        builder.append(boundary);
	        builder.append(dashdash);
	        builder.append(crlf);        
	        
	        request.upload.onprogress = ME.option.onProgress
	        request.onreadystatechange = function() {
	            switch(request.readyState) {
	                case 4:                   
	        			ME.option.onComplete(event,request.responseText);
	                    break;
	            }
	        };
	        
	        /* Use Gears to submit the data. */
	        request.open("POST",  ME.option.gate);
	        request.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
	        request.send(builder.getAsBlob());
        }
        event.stopPropagation();
        
        /* Fix Safari forgetting the background change after drop. */
        $('#dropzone').css("background-color", "#fff");
    };

   if ($.browser.msie) {
		$(input).get(0).addEventListener('ondrop', ME.upload, false);
	    $(input).get(0).addEventListener('ondragenter',	function(event) { $(input).css("background-color", ME.option.dragEnterColor); }, false);
	    $(input).get(0).addEventListener('ondragleave', function(event) { $(input).css("background-color", ME.option.dragExitColor); }, false);
	    $(input).get(0).addEventListener('ondragover', 	function(event) { event.returnValue = false; },false);  
	}
	else if ($.browser.safari) {
        $(input).get(0).addEventListener('drop', ME.upload, false);        
        $(input).get(0).addEventListener('dragover', function(event) { event.returnValue = false; }, false);
        $(input).get(0).addEventListener('dragenter', function(event) { $(input).css("background-color", ME.option.dragEnterColor); }, false);
        $(input).get(0).addEventListener('dragleave', function(event) { $(input).css("background-color", ME.option.dragExitColor); }, false);   
    }
	else{
		$(input).get(0).addEventListener('drop', ME.upload, false);
	    $(input).get(0).addEventListener('dragenter',	function(event) { $(input).css("background-color", ME.option.dragEnterColor); }, false);
	    $(input).get(0).addEventListener('dragexit', 	function(event) { $(input).css("background-color", ME.option.dragExitColor); },false);
	}

      
	return ME;
	
};

$.fn.uploadg = function uploadg(options){
	this.each(function() {
		var input = this;
		new jQuery.uploadg(input, options);
	});
	
	return this;
};