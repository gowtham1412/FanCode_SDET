import {When, Then, And} from "cypress-cucumber-preprocessor/steps"


let todosApiResponse;
When('User has the todo tasks',()=>{
    cy.request({
        url: `${Cypress.env('baseUrl')}/todos`,
        method: 'GET'
    }).then((response)=>{
        //store todo ap response 
        todosApiResponse = response.body;
        cy.log(todosApiResponse)
    })
})

let userApiResponse;
let usersFromFanCodeCity;
And('User belongs to the city FanCode',()=>{
    cy.request({
        url: `${Cypress.env('baseUrl')}/users`,
        method: 'GET'
    }).then((response)=>{
        //store user api response
        userApiResponse = response.body;
        cy.log(userApiResponse)
        //getting user ids whose geo location matches the condition: lat between ( -40 to 5) and long between ( 5 to 100)
        usersFromFanCodeCity = userApiResponse.filter(user => {
            const lat = parseFloat(user.address.geo.lat);
            const lng = parseFloat(user.address.geo.lng);
            return lat >= -40 && lat <= 5 && lng >= 5 && lng <= 100;
          }).map(user => user.id);
    })
})

const usersWithtasksCount={};
Then('User Completed task percentage should be greater than {int}%',(minPercentageForUser)=>{

    //loop through todosApiResponse to get count of completed and not completed tasks for each user
    for (let i = 0; i < todosApiResponse.length; i++) {
        const item = todosApiResponse[i];
      
        //add user to usersWithtasksCount if not present already in the object
        if (!usersWithtasksCount[item.userId]) {
          usersWithtasksCount[item.userId] = { completedTrue: 0, completedFalse: 0 };
        }

        if (item.completed) {
            //increment completedTrue if task is completed(completed == true)
            usersWithtasksCount[item.userId].completedTrue++;
        } else {
            //increment completedFalse if task is not completed(completed == false)
            usersWithtasksCount[item.userId].completedFalse++;
        }
    }

    cy.log(usersWithtasksCount)

    const usersWhoCompletedTasksMoreThan50Percent = Object.keys(usersWithtasksCount).filter(userId => {
        const userStats = usersWithtasksCount[userId];
        const totalTasks = userStats.completedTrue + userStats.completedFalse;
        
        return (userStats.completedTrue / totalTasks) > 0.5;
    });

    //validate if all users from FANCODE city has completed tasks more than 50%
    //validate if all users from FANCODE city is included in the usersWhoCompletedTasksMoreThan50Percent list

    expect(usersWhoCompletedTasksMoreThan50Percent.map(Number)).to.include(usersFromFanCodeCity)

})