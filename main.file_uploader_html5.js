if(!$.browser.mozilla){
    XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
            var ui8a = new Uint8Array(datastr.length);
            for (var i = 0; i < datastr.length; i++) {
                    ui8a[i] = (datastr.charCodeAt(i) & 0xff);
            }
            this.send(ui8a.buffer);
    }
}

$.upload5=function(input, opt){
	var ME=this;
	ME.option = {
		gate:'',
		can_proceed:true,
		
		dragEnterColor:'#ffc',
		dragExitColor:'#fff',
		
		beforeLoad:function() {},
		onProgress:function(event) {},
		onComplete:function(event) {
        }
	};

	if(typeof(opt)=='string'){
		opt={'gate':opt};
	}
	
	ME.option = $.extend(this.option,opt);

	
	ME.upload = function (event) {
		
		event.stopPropagation();
		event.preventDefault();
        
		ME.option.beforeLoad();
		
		if(!ME.option.can_proceed){
			return false;
		}
		
		var data = event.dataTransfer;
		
        /*
        for (var i = 0; i < data.files.length; i++) {
            $('#image_list').prepend($('<img src="img/spinner.gif" width="16" height="16" />').css("padding", "33px"));
        }
        */
        


        //if($.browser.mozilla)
        {
        	var formData = new FormData();

            for (var i = 0; i < data.files.length; i++) {
                var xhr = new XMLHttpRequest();
                //xhr.setRequestHeader("Content-Length", file.size);

                xhr.onload = function(event){
                	ME.option.onComplete(event,xhr.responseText);
                };

                xhr.upload.addEventListener("progress", ME.option.onProgress, false);
                xhr.open("POST", ME.option.gate, true);

                var file = data.files[i];
                xhr.setRequestHeader('Content-Disposition', 'form-data; name="file[]"; filename="'+file.name+'"');
                formData.append("file", file);
                xhr.send(formData);
            }
            //xhr.setRequestHeader('Content-Type', 'application/octet-stream');

        }

/*
        if($.browser.mozilla){
            //                        xhr.setRequestHeader('Size', file.size);
                                    //xhr.setRequestHeader('filename', file.name);
                                    xhr.setRequestHeader('Content-Disposition', 'form-data; name="file[]"; filename="'+file.name+'"');
                                    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                                    //xhr.send(fileEvent.target.result);




                                    xhr.sendAsBinary(fileEvent.target.result);
        }
        {



            for (var i = 0; i < data.files.length; i++) {
                var file = data.files[i];

                var reader = new FileReader();
                reader.onload = function(fileEvent) {
                    console.log(file);
                    console.log(fileEvent);
                    if (fileEvent.target.readyState == FileReader.DONE)
                    {
                        var xhr = new XMLHttpRequest();
                        //xhr.setRequestHeader("Content-Length", file.size);

                        xhr.onload = function(event){
                        	ME.option.onComplete(event,xhr.responseText);
                        };

                        xhr.upload.addEventListener("progress", ME.option.onProgress, false);
                        xhr.open("POST", ME.option.gate, true);


                        var boundary = '------multipartformboundary' + (new Date).getTime();
                        var dashdash = '--';
                        var crlf     = '\r\n';

                        var builder = '';

                        builder += dashdash;
                        builder += boundary;
                        builder += crlf;

                        builder += 'Content-Disposition: form-data; name="file[]"';
                        if (file.fileName) {
                          builder += '; filename="' + file.fileName + '"';
                        }
                        builder += crlf;

                        builder += 'Content-Type: application/octet-stream';
                        builder += crlf;
                        builder += crlf;

                        builder += fileEvent.target.result;
                        builder += crlf;

                        builder += dashdash;
                        builder += boundary;
                        builder += crlf;

                        //------------
                            builder += dashdash;
                            builder += boundary;
                            builder += dashdash;
                            builder += crlf;

                        xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
                        xhr.sendAsBinary(builder);

                    }
                    else{
                        ME.option.onMemoryRead(fileEvent);
                    }

                 };

                reader.readAsBinaryString(file);// || file.getAsBinary();

		    }
        }
        */

    }
			
	$(input).get(0).addEventListener('drop', ME.upload, false);
	
    $(input).get(0).addEventListener('dragenter',	function(event) { 
    	$(input).css("background-color", ME.option.dragEnterColor); 
    	event.stopPropagation();
    	event.preventDefault();
    	
    	if($.browser.webkit) event.dataTransfer.dropEffect = 'copy';
    }, false);
    
    $(input).get(0).addEventListener('dragover',	function(event) { 
    	event.stopPropagation();
    	event.preventDefault();
    	
		if(!event.dataTransfer) return;

		//FF
		if(event.dataTransfer.types.contains && !event.dataTransfer.types.contains("Files")) return;

		//Chrome
		if(event.dataTransfer.types.indexOf && event.dataTransfer.types.indexOf("Files")==-1) return;
		
		
    	$(input).css("background-color", ME.option.dragEnterColor); 

    }, false);
    
    $(input).get(0).addEventListener('dragexit', 	function(event) {
        $(input).css("background-color", ME.option.dragExitColor);
    }, false);
      
	return ME;
}

$.fn.upload5 = function upload5(options){
	this.each(function() {
		var input = this;
		new jQuery.upload5(input, options);
	});
	
	return this;
};
