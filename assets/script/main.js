

function ajaxCallback(file, callback) { 
    $.ajax({ 
        url: "js/" + file, 
        method: "get", 
        dataType: "json", 
        success: (arr) => { 
            callback(arr) 
        }, 
        error: (jqXHR, exception) => { 
            const errorContainer = $('#ajax-error'); 
            let msg = ""; 
            if (jqXHR.status === 0) { 
                msg = 'Not connect.\n Verify Network.'; 
            } else if (jqXHR.status == 404) { 
                msg = `Error 404. Requested page not found. (${file})`; 
            } else if (jqXHR.status == 500) { 
                msg = 'Error 500. Internal Server Error.'; 
            } else if (exception === 'parsererror') { 
                msg = 'Requested JSON parse failed.'; 
            } else if (exception === 'timeout') { 
                msg = 'Time out error.'; 
            } else if (exception === 'abort') { 
                msg = 'Ajax request aborted.'; 
            } else { 
                msg = 'Uncaught Error.\n' + jqXHR.responseText; 
            } 
 
            let result = ` 
                <div class="error-field d-flex align-items-center justify-content-center"> 
                    <p class="text-danger fw-bold fs-5">${msg}</p> 
                </div> 
                ` 
            errorContainer.html(result); 
        } 
    }) 
} 

async function asyncFunctionCalls(){
    
}