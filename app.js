const accounting = require('./accounting/accounting')

const moment = require('moment')

// let date = moment('2021-09-18').format('YYYY-MM-DD')
// console.log(date)

let user = {
    budgets: [{
        name: 'personal',
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        fixed_costs: [{
            amount: 300,
            currency: 'USD',
            due_day: 16,
            frequency: 'monthly',
            to: 'Rent',
            from: 'Bank',
            notes: 'rent',
        },{
            amount: 15,
            currency: 'USD',
            due_day: 1,
            frequency: 'monthly',
            to: 'others',
            from: 'Bank',
            notes: 'others',
        },{
            amount: 300,
            currency: 'USD',
            due_day: 26,
            frequency: 'monthly',
            to: 'others',
            from: 'Bank',
            notes: 'others',
        },{
            amount: 10,
            currency: 'USD',
            due_day: 29,
            frequency: 'monthly',
            to: 'others',
            from: 'Bank',
            notes: 'others',
        },{
            amount: 7.99,
            currency: 'USD',
            due_day: 9,
            frequency: 'monthly',
            to: 'others',
            from: 'Bank',
            notes: 'others',
        },{
            amount: 9.99,
            currency: 'USD',
            due_day: 7,
            frequency: 'monthly',
            to: 'others',
            from: 'Bank',
            notes: 'others',
        }],
        variable_costs: [{
            amount: 40,
            currency: 'USD',
            date: moment('2021-09-21').format('YYYY-MM-DD'),
            to: 'oooo',
            label: 'ssss',
            from: 'cccc',
            notes: 'aaaa'
        },{
            amount: 70,
            currency: 'USD',
            date: moment('2021-09-19').format('YYYY-MM-DD'),
            to: 'oooo',
            label: 'ssss',
            from: 'cccc',
            notes: 'aaaa'
        }],
        future_costs: [{
            amount: 80,
            currency: 'USD',
            date: moment('2021-09-28').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        },{
            amount: 60,
            currency: 'USD',
            date: moment('2021-10-02').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        },{
            amount: 40,
            currency: 'USD',
            date: moment('2021-10-02').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        },{
            amount: 40,
            currency: 'USD',
            date: moment('2021-10-01').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        },{
            amount: 60,
            currency: 'USD',
            date: moment('2021-10-06').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        },{
            amount: 60,
            currency: 'USD',
            date: moment('2021-10-10').format('YYYY-MM-DD'),
            to: 'aaaa',
            label: 'aaa',
            from: 'aaa',
            notes: 'aaa',
        }],
        incomes: [{
            date: moment('2021-09-23').format('YYYY-MM-DD'),
            amount: 50,
            currency: 'USD',
            from: 'aaa',
            to: 'aaa',
            shift: {
                hours: 3,
                minutes: 0
            },
            notes: 'aaa',
        }],
        bank_accounts: [{
            amount: 400,
            currency: 'USD',
            date: moment('2021-09-23').format('YYYY-MM-DD'),
            bank_name: 'aaa',
            notes: 'aaa',
        }]
    }]
}
async function init() {
    let new_budget = await accounting(user.budgets[0])
    
    // console.log(new_budget)
}
init()