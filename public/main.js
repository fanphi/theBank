let accountContainer = document.querySelector("#account-section");
let userInput = document.querySelector("#userName");
let passwordInput = document.querySelector("#password");
let totalInput = document.querySelector("#total");
let nameInput = document.querySelector("#name");
let loginForm = document.querySelector("#loginform");
let loginUser = document.querySelector("#login-user");
let loginPassword = document.querySelector("#login-pass");
let logoutForm = document.querySelector("#logout");
let depositForm = document.querySelector("#deposit-form");
let depositInput = document.querySelector("#deposit");
let withdrawForm = document.querySelector("#withdraw-form");
let withdrawInput = document.querySelector("#withdraw");
let deleteForm = document.querySelector("#delete-form");
let registerForm = document.querySelector("#register-form");
let depContainer = document.querySelector("#depwith");
let accountInput = document.querySelector("#account-type");
let registerSection = document.querySelector("#register");
let loginSection = document.querySelector("#login");
let loginContainer = document.querySelector("#login-div");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: loginUser.value,
      password: loginPassword.value,
    }),
  });

  console.log("log in");
  location.reload();
});

let random = Math.floor(Math.random() * 10000);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("/api/account/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userInput.value,
      password: passwordInput.value,
      name: nameInput.value,
      total: parseInt(totalInput.value),
      accountnumber: random,
      accounttype: accountInput.value,
    }),
  });
  const data = res.json();
  alert("The account has been registered!");
  registerForm.reset();
});

const checkLoggedin = async () => {
  const res = await fetch("/api/account/loggedin");
  const data = await res.json();
  console.log(data.user);
  if (data.user) {
    console.log("welcome" + " " + data.user.name);
    depContainer.style.display = "flex";
    accountContainer.style.display = "flex";
    logoutForm.style.display = "flex";
    loginContainer.style.display = "flex";
    registerSection.style.display = "none";
    loginSection.style.display = "none";

    let account = data.user;

    let accountInfo = document.createElement("h2");
    let accountName = document.createElement("h3");
    let accountTotal = document.createElement("p");
    let accountNum = document.createElement("p");
    let accountType = document.createElement("p");
    let accountUser = document.querySelector("h2");

    accountInfo.innerText = "Account Info";
    accountUser.innerText = "Welcome " + account.user;
    accountName.innerText = "Name: " + account.name;
    accountType.innerText = "Account type: " + account.accounttype;
    accountTotal.innerText = "Total: " + account.total;
    accountNum.innerText = "Account number: " + account.accountnumber;

    loginContainer.append(accountUser);
    accountContainer.append(
      accountInfo,
      accountName,
      accountType,
      accountNum,
      accountTotal
    );
  } else {
    console.log("sign in" + data);
  }

  depositForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(`/api/account/update/${data.user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: data.user.user,
        password: data.user.password,
        name: data.user.name,
        total: parseInt(depositInput.value) + parseInt(data.user.total),
        accountnumber: data.user.accountnumber,
        accounttype: data.user.accounttype,
      }),
    });

    depositForm.reset();
    location.reload();
  });

  withdrawForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (data.user.total >= withdrawInput.value) {
      await fetch(`/api/account/update/${data.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: data.user.user,
          password: data.user.password,
          name: data.user.name,
          total: parseInt(data.user.total) - parseInt(withdrawInput.value),
          accountnumber: data.user.accountnumber,
          accounttype: data.user.accounttype,
        }),
      });

      withdrawForm.reset();
      location.reload();
    } else {
      alert(
        "You do not have enough money for the withdrawal. Please try another amount."
      );
      location.reload();
    }
  });

  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(`/api/account/delete/${data.user._id}`, {
      method: "DELETE",
    });

    console.log("deleted" + data.user.name);
    location.reload();
  });
};

logoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/account/logout", { method: "POST" });

  location.reload();
});

checkLoggedin();
