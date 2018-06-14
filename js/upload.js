$(function () {

    var upload = null;

    window.addEventListener("online", function () {
        console.log("i'm online")
        if (upload) {
            upload.start();
        }
    })
    window.addEventListener("offline", function () {
        console.log("i'm offline.")
        if (upload) {
            upload.abort();
        }
    })
    $('input[type=file]').change(function () {
        if (upload) {
            upload.abort();
            upload = null;
        }

        $("#startUpload").data("value", "0")
        $("#startUpload").text("Start");
        $(".progress").addClass("d-none");
        $(".progress-bar").css("width", "0%")
        $(".progress-bar").text("0%")

        var $input = $(this);
        var files = this.files;
        var file = files[0];
        upload = new tus.Upload(file, {
            endpoint: 'http://localhost:1080/files/',
            retryDelays: [0, 5000, 15000, 30000, 60000, 120000, 240000],
            chunkSize: 5 * 1024 * 1024,
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            withCredentials: true,
            removeFingerprintOnSuccess: true,
            onError: function (error) {
                console.log("Error: " + error)
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
                $(".progress-bar").css("width", percentage + "%")
                $(".progress-bar").text(percentage + "%")
                console.log(bytesUploaded, bytesTotal, percentage + "%")
            },
            onSuccess: function () {
                $input.val('');
                $("#message").html('<a>File ' + file.name + ' upload success!</a><br />')
                $("#startUpload").text("Start");
                $('#startUpload').addClass('disabled');
                $("#startUpload").data("value", "0")
                $(".progress").addClass("d-none");
                $(".progress-bar").css("width", "0%")
                $(".progress-bar").text("0%")
                upload = null;
            }
        });


        $('#startUpload').removeClass('disabled');
        $("#startUpload").off("click").on("click",function (e) {
            e.preventDefault()
            var v = $("#startUpload").data("value");
            if (upload && v == "0") {
                $("#cancelUpload").removeClass("d-none");
                $(".progress").removeClass("d-none");
                upload.start()
                $("#startUpload").text("Stop");
                $("#startUpload").data("value", "1")
                return
            }
            if (upload && v == "1") {
                upload.abort()
                $("#startUpload").text("Resume");
                $("#startUpload").data("value", "0")
                return
            }
        });
        $("#cancelUpload").off("click").on('click',function(e){
            if(upload){
                $input.val('');
                upload.abort();
                $("#startUpload").text("Start");
                $('#startUpload').addClass('disabled');
                $("#startUpload").data("value", "0")
                $(".progress").addClass("d-none");
                $(".progress-bar").css("width", "0%")
                $(".progress-bar").text("0%")
                upload = null;
                $("#cancelUpload").addClass("d-none");
            }
        })
    });
});