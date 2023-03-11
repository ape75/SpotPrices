# `SpotPrices - View prices of electricity in the Nordic Countries`
## &copy; 2022 Ari-Jussi Ahonen
**SpotPrice** is a mobile application that displays the daily and hour-to-hour spot prices of electricity

This application is developed using the **React Native Framework**.<br/>
The prices are fetched from the **ENTSO-E transparency platform API**

With this application the user can:
- **view daily spot prices** of electricity in a selected country
- **view hour-to-hour spot prices** of electricity in a selected country
- countries currently available in the application: Finland, Sweden, Denmark, Norway, Estonia and Poland

## Register and make a request for the API-key
In order for you to use this you need to complete the following additional steps:
```
1. Register on the ENTSO-E transparency platform https://transparency.entsoe.eu/dashboard/show
2. Request an API key by sending an email to transparency@entsoe.eu with “Restful API access” in the subject line. 
   In the email body state your registered email address. You will receive an email when you have been provided
   with the API key. The key is then visible in your ENTSO-E account under “Web API Security Token”.
```

## After you have received your Api-key, copy it as the value of myToken -variable in the App.js

## After cloning the repository you must install all the needed libraries with the command:
```
npm install
```

## **SCREENSHOTS**

## Select the desired date and country to see the spot prices
![Screenshot_1](https://user-images.githubusercontent.com/102353086/224493392-8e24dc16-a058-40d0-93e0-96b22bb0d271.png)

## Prices are shown in a hour-to-hour graphic diagram with also the cheapest and most expensive hourly prices and average spot price per day
![Screenshot_2](https://user-images.githubusercontent.com/102353086/224493404-b41cf23c-bbd0-4072-9896-a3271d755c88.png)

