var cl = console.log;

const addBtn = document.getElementById("addBtn");
const productform = document.getElementById("productform")
const productcon = document.getElementById("productcon");
const product = document.getElementById("product");
const title = document.getElementById("title");
const image = document.getElementById("image");
const overview = document.getElementById("overview");
const statuscontrol = document.getElementById("status");
const subBtn = document.getElementById("subBtn");
const updBtn = document.getElementById("updBtn");
const loader = document.getElementById("loader");
const backdrop = document.getElementById("backdrop");
//const product = document.getElementById("product");
const closemodal = [...document.querySelectorAll(".closemodal")]

const baseUrl = `https://fetch-74c6d-default-rtdb.asia-southeast1.firebasedatabase.app`;
const postUrl = `${baseUrl}/posts.json`;

const snackBarMsg = (msg, iconName) =>{
    Swal.fire({
        title : msg,
        icon : iconName,
        timer : 2500
    })
}

const objtoarr = (obj) =>{
    let productArr = [];
    for (const key in obj) {
            productArr.push({...obj[key], id:key})
        }
    return productArr
}

const backdropshow = () =>{
    product.classList.add('active');
    backdrop.classList.add('active')
}

const backdrophide = () =>{
    product.classList.remove('active');
    backdrop.classList.remove('active');
    productform.reset();
}

const addcard = (obj) =>{
    let card = document.createElement("div");
    card.id = obj.id;
    card.className = "col-md-4";
    card.innerHTML = `<div class="card">
                        <figure class="productCard" id="${obj.id}">
                            <img src="${obj.image}" alt="${obj.title}" title="${obj.title}">
                            <figcaption>
                                <div class="section">
                                    <div class="row">
                                        <div class="col-8">
                                            <h3 class="productName">${obj.title}</h3>
                                        </div>
                                        <div class="col-4">
                                            <div class="statussec text-center">
                                                ${obj.productstatus === `Available` ? `<p class="bg-success"> ${obj.productstatus} </p>` :
                                                    obj.productstatus === `Order` ? `<p class="bg-warning"> ${obj.productstatus} </p>` : 
                                                    obj.productstatus === 'Delivered' ? `<p class="bg-warning"> ${obj.productstatus} </p>` :
                                                    obj.productstatus === 'Unavailable' ? `<p class="bg-danger"> ${obj.productstatus} </p>` : 
                                                    `<p class="bg-danger"> ${obj.productstatus} </p>`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="overview">
                                    <h4>${obj.title}</h4>
                                    <em>Overview</em>
                                    <p>${obj.overview}</p>
                                    <div class="action">
                                        <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                        <button class="btn btn-outline-warning" onclick="onDelete(this)">Delete</button>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>`;
    productcon.prepend(card);
}

const templating = (arr) =>{
    let result = ``;
    arr.forEach(obj =>{
        result += `<div class="col-md-4">
                        <div class="card">
                            <figure class="productCard" id="${obj.id}">
                                <img src="${obj.image}" alt="${obj.title}" title="${obj.title}">
                                <figcaption>
                                    <div class="section">
                                        <div class="row">
                                            <div class="col-8">
                                                <h3 class="productName">${obj.title}</h3>
                                            </div>
                                            <div class="col-4">
                                                <div class="statussec text-center">
                                                    ${obj.productstatus === 'Available' ? `<p class="bg-success"> ${obj.productstatus} </p>` :
                                                        obj.productstatus === 'Order' ? `<p class="bg-warning"> ${obj.productstatus} </p>`: 
                                                        obj.productstatus === 'Delivered' ? `<p class="bg-warning"> ${obj.productstatus} </p>` :
                                                        obj.productstatus === 'Unavailable' ? `<p class="bg-danger"> ${obj.productstatus} </p>` : 
                                                        `<p class="bg-danger"> ${obj.productstatus} </p>`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="overview">
                                        <h4>${obj.title}</h4>
                                        <em>Overview</em>
                                        <p>${obj.overview}</p>
                                        <div class="action">
                                            <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                            <button class="btn btn-outline-warning" onclick="onDelete(this)">Delete</button>
                                        </div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </div>`
    });
    productcon.innerHTML = result;
}

const onEdit = async (ele) =>{
    let editId = ele.closest(".productCard").id;
    let editUrl = `${baseUrl}/posts/${editId}.json`;
    localStorage.setItem("editId", editId);
    let res = await callAPI(editUrl, "GET");
        title.value = res.title;
        image.value = res.image;
        overview.value = res.overview;
        statuscontrol.value = res.productstatus;
        updBtn.classList.remove("d-none");
        subBtn.classList.add("d-none");
        backdropshow()
}

const onDelete = async (ele) =>{
    let res = await Swal.fire({
                title: "Do you want to Remove the Product?",
                showCancelButton: true,
                confirmButtonText: "Remove",
            });
            if (res.isConfirmed) {
                let deleId = ele.closest(".productCard").id;
                let deleUrl = `${baseUrl}/posts/${deleId}.json`;
                let res = await callAPI(deleUrl, "DELETE")
                    ele.closest(".col-md-4").remove();
                    snackBarMsg("Product Removed Successfully!!!!", "", "success");
            }
}

const callAPI = async (apiUrl, methodName, msgBody = null) =>{
    loader.classList.remove("d-none");
    try {
        msgBody = msgBody ? JSON.stringify(msgBody) : null;
        let res = await fetch(apiUrl,{
            method : methodName,
            body : msgBody,
            headers : {
                "Content-type" : "Application/JSON",
                "AuthToken" : "JWT Token from Local Storage"
            }
        })
        return res.json();
    } catch (err) {
        cl(err)
    } finally {
        loader.classList.add("d-none");
    }
}

const getData = async () =>{
    try {
        let res = await callAPI(postUrl, "GET");
        let productArr = objtoarr(res);
        templating(productArr);
        snackBarMsg(`Products Posted Successfully!!!`, 'success')
    } catch (err) {
        snackBarMsg(`Somthing went wrong`, 'error')
    }
}

getData();

const addproductform = async(e) =>{
    try {
        e.preventDefault();
        let post = {
            title : title.value,
            image : image.value,
            overview : overview.value,
            productstatus : statuscontrol.value
        }
        //cl(post);
        let res = await callAPI(postUrl, "POST", post)
            post.id = res.name;
            addcard(post);
            e.target.reset();
            backdropshow();
            snackBarMsg(`${post.title} Posted Successfully!!!!`, 'success')
    } catch (err) {
        //cl(err)
        snackBarMsg(`Somthing went wrong`, 'error')
    } finally {
        backdrophide();
    }
}

const updateDetails = async () =>{
    try {
        let updId = localStorage.getItem("editId");
        let updUrl = `${baseUrl}/posts/${updId}.json`;
        let updObj = {
            title : title.value,
            image : image.value,
            overview : overview.value,
            productstatus : statuscontrol.value,
            id : updId
        }
        //cl(updObj);
        let res = await callAPI(updUrl, "PATCH", updObj);
            let getCard = document.getElementById(updId);
            getCard.innerHTML = `<figure class="productCard" id="${updObj.id}">
                                    <img src="${updObj.image}" alt="${updObj.title}" title="${updObj.title}">
                                        <figcaption>
                                            <div class="section">
                                                <div class="row">
                                                    <div class="col-8">
                                                        <h3 class="productName">${updObj.title}</h3>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="statussec text-center">
                                                            ${updObj.productstatus === 'Available' ? `<p class="bg-success"> ${updObj.productstatus} </p>` :
                                                            updObj.productstatus === 'Order' ? `<p class="bg-warning"> ${obj.productstatus} </p>` :
                                                            updObj.productstatus === 'Delivered' ? `<p class="bg-warning"> ${updObj.productstatus} </p>` :
                                                            updObj.productstatus === 'Unavailable' ? `<p class="bg-danger"> ${updObj.productstatus} </p>` :
                                                             `<p class="bg-danger"> ${updObj.productstatus} </p>`
                                                            }
                                                </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="overview">
                                                <h4>${updObj.title}</h4>
                                                <em>Overview</em>
                                                <p>${updObj.overview}</p>
                                                <div class="action">
                                                    <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                                    <button class="btn btn-outline-warning" onclick="onDelete(this)">Delete</button>
                                                </div>
                                            </div>
                                        </figcaption>
                                </figure>`
            updBtn.classList.add("d-none");
            subBtn.classList.remove("d-none");
            backdrophide();
            snackBarMsg(`${updId} product updated successfully!!!`, 'success')
    } catch (err) {
        snackBarMsg(`somthing went wrong`, 'success')
    }
}

productform.addEventListener("submit", addproductform)
addBtn.addEventListener("click", backdropshow);
closemodal.forEach(c =>{
    c.addEventListener("click", backdrophide)
});
updBtn.addEventListener("click", updateDetails)