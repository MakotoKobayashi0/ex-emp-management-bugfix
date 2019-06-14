// $(function () {
//     alert("hello")
//     $.ajax({
//         url: "http:/localhost:8080/employee/employee-names",
//         type: "GET",
//         dataType: "json"
//     }).done(function (json) {
//         alert(json.names)
//         alert(json["names"])
//     })
// });
$(function () {
    $('#employee-search').autocomplete({
        source: data,
        autoFocus: true,
        delay: 500,
        minLength: 2
    });
});

// $(function() {
//     $('#button').click(
//       function() {
//           $.ajax({
//               url: 'sample2.html',
//             dataType: 'html'
//         }).done(function(data) {
//             // alert("ok");
//             $('#text').html(data);
//         }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
//             alert("error");
//         })
//       }
//     );
// });