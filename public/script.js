let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amt_input');
const infoInput = document.getElementById('info_input');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add-btn');
const expenseTable = document.getElementById('expense-table');
const totalAmountCell = document.getElementById('tot-amt');

addBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const category = categorySelect.value;
    const info = infoInput.value;
    const amt = Number(amountInput.value);
    const date = dateInput.value;

    if (!category) {
        alert('Please select a category');
        return;
    }

    if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!info) {
        alert('Please enter valid information');
        return;
    }

    if (!date) {
        alert('Please select a valid date');
        return;
    }

    const expense = { category, amt, info, date };

    // Send data to the server using fetch
    fetch('/tracker', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);

        expenses.push(expense);

        if (category === 'Income') {
            totalAmount += amt;
        } else if (category === 'Expense') {
            totalAmount -= amt;
        }

        totalAmountCell.textContent = totalAmount;

        const newRow = expenseTable.insertRow();

        const categoryCell = newRow.insertCell();
        const amtCell = newRow.insertCell();
        const infoCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        categoryCell.textContent = expense.category;
        amtCell.textContent = expense.amt;
        infoCell.textContent = expense.info;
        dateCell.textContent = expense.date;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            const index = expenses.indexOf(expense);
            if (index > -1) {
                expenses.splice(index, 1);

                if (expense.category === 'Income') {
                    totalAmount -= expense.amt;
                } else if (expense.category === 'Expense') {
                    totalAmount += expense.amt;
                }

                totalAmountCell.textContent = totalAmount;
                newRow.remove();
            }
        });

        deleteCell.appendChild(deleteBtn);

        categorySelect.value = '';
        amountInput.value = '';
        infoInput.value = '';
        dateInput.value = ''; 
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
