
function myfunc(element) {
    const response = document.getElementById(`response_${element.value}`);
    console.log(response.value)
    console.log(response)
    $.ajax({
        type: "POST",
        url: `/api/survey/add_response/${element.value}`,
        data: { response: response.value },
        success: alert('Response Send Successfully!'),
    });
}

$(".btn-outline-danger").click(function (event) {
    if (!confirm("Are you sure?")) {
        event.preventDefault();
        window.history.back();
    }

});