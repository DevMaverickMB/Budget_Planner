let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Function to hide error messages
const hideErrorMessages = () => {
  errorMessage.classList.add("hide");
  productTitleError.classList.add("hide");
};

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  // Hide error messages
  hideErrorMessages();

  tempAmount = totalAmount.value;
  // Empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
    return; // Added return to exit the function if error occurs
  }

  // Set Budget
  amount.innerHTML = tempAmount;
  // Set Balance
  balanceValue.innerText = tempAmount - expenditureValue.innerText;
  // Clear Input Box
  totalAmount.value = "";
  // Update pie chart
  updatePieChart();
});


// Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
  // Update pie chart
  updatePieChart();
};

// Function To Create List
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
  // Update pie chart
  updatePieChart();
};

// Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  // Empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  productTitleError.classList.add("hide"); // Hide error message if shown
  // Enable buttons
  disableButtons(false);
  // Expense
  let expenditure = parseInt(userAmount.value);
  // Total expense (existing + new)
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  // Total balance (budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  // Create list
  listCreator(productTitle.value, userAmount.value);
  // Empty inputs
  productTitle.value = "";
  userAmount.value = "";
  // Hide error messages
  hideErrorMessages();
});

// Function to update the pie chart data
const updatePieChart = () => {
  const expenseItems = document.querySelectorAll(".sublist-content .product");
  const expenseAmounts = document.querySelectorAll(".sublist-content .amount");
  const remainingBalance = balanceValue.innerText;

  const labels = [];
  const data = [];

  // Extract expense items and amounts
  expenseItems.forEach((item) => {
    labels.push(item.textContent);
  });
  expenseAmounts.forEach((amount) => {
    data.push(amount.textContent);
  });

  // Add remaining balance as an additional label
  labels.push("Remaining Balance");
  data.push(remainingBalance);

  // Update the pie chart with new data
  const ctx = document.getElementById("incomeChart").getContext("2d");
  if (window.myPieChart) {
    window.myPieChart.destroy();
  }
  window.myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(1, 142, 203)',
            'rgb(106, 144, 204)',
            'rgb(1, 142, 203)',
            'rgb(102, 55, 221)',
          ],
        },
      ],
    },
  });
};
