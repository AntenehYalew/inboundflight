var adminDelete = document.querySelectorAll(".admin-delete-icon")
var adminDeleteUser = document.querySelectorAll(".user-name")

adminDelete.forEach((e,index)=>{
    e.addEventListener("mouseenter",()=>{
        e.classList.add("fas")
        adminDeleteUser[index].style.textDecoration = "line-through wavy red"
    })
    e.addEventListener("mouseleave",()=>{
        e.classList.remove("fas")
        adminDeleteUser[index].style.textDecoration = "none"
    })
})
setTimeout(function(){document.querySelector(".flashmessage").remove() ; }, 3000);

var flightEdit = document.querySelectorAll(".flight-edit")
var flightDelete = document.querySelectorAll(".flight-delete")
var flightRow = document.querySelectorAll(".flightRow")

flightRow.forEach((e,index)=>{
    e.addEventListener("mouseenter",()=>{
        flightEdit[index].style.visibility = "visible"
        flightDelete[index].style.visibility = "visible"
    })
    e.addEventListener("mouseleave",()=>{
        flightEdit[index].style.visibility = "hidden"
        flightDelete[index].style.visibility = "hidden"
    })
})