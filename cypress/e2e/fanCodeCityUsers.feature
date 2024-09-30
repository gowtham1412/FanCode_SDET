Feature: Users with city FanCode

    Scenario: All the users of City `FanCode` should have more than half of their todos task completed.
        When User has the todo tasks
        And User belongs to the city FanCode
        Then User Completed task percentage should be greater than 50%