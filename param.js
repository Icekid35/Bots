// const puppeteer = require("puppeteer");
// const puppeteer = require("puppeteer-core");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const EventEmitter2=require('eventemitter2')
const listener=new EventEmitter2()
console.log("we;come to the new life...");
const chromiumPath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const app = require("express")();
const Mailjs=require('@cemalgnlts/mailjs')
const UserAgent=require('user-agents')
let imageURL=new Blob()

// Register Puppeteer-extra Stealth Plugin
puppeteerExtra.use(StealthPlugin());
// let refcode="https://handydatas.com/register/bellohabib682r7dhrv694"
const main = async () => {
  console.log("initializing the browser...");
  const userAgent=new UserAgent({platform:'MacIntel',deviceCategory:'desktop'})
  const userAgentStr=userAgent.toString()
  const anonymizeUserAgentPlugin=require('puppeteer-extra-plugin-anonymize-ua')({
    customFn:()=>userAgentStr,
    stripHeadless:true,
    makeWindows:false,
  })
  puppeteerExtra.use(anonymizeUserAgentPlugin)
  const browser = await puppeteerExtra.launch({
    // executablePath: chromiumPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true, // Set to false to see the browser in action
  });
  try {
    async function Work() {
      console.log("starting...");
      
        return new Promise(async r=>{
          const mailjs = new Mailjs();
          let username = "<empty>";
          
          console.log("[1/4] An account is being created...");
          
          // Create a random account.
          const acc = await mailjs.createOneAccount();
          if(!acc.status) r('bad');
          console.log(acc.data)
          username = acc.data.username;
          
          mailjs.on("arrive", onNewMessage);
      
          
          // It is triggered when a new mail arrives.
         async function onNewMessage(msg) {
            console.log("[3/4]", "A new message has been received:");
            let mess=await mailjs.getMessage(msg.id)
const good=mess.replaceAll('\n',' ').split(' ').filter(t=>t.includes('http'))[2]
console.log(good)
            // Stop listening.
            mailjs.off();
            listener.emit('newmail'+username,good)
          }
          const context = await browser.createIncognitoBrowserContext();
      let page = await context.newPage();
  
      await page.setRequestInterception(true);

      page.on("request", async (request) => {

        if(request.resourceType() === "image" ){
          request.continue()
          return
        }else{
          request.continue()
        }
    
      });

      page.on("dialog", async (dialog) => {
        // Print the message of the dialog
        console.log("Dialog message:", dialog.message());

        // Accept the confirmation dialog
        await dialog.accept();
      });

      console.log("page opened");


      try {
        console.log(username)
        console.log("page loading...");
        await page.evaluate(()=>{
          delete window.navigator.__proto__.webdriver;
          // // delete window.navigator.__proto__.platform;
           window.navigator.__proto__.webdriver=false                                     
          // //  window.navigator.__proto__.platform="iPhone"
          // window.location.reload()
           return                                     
      })
        await page.goto("https://paramgaming.com/?referCode=DE356F8CFA#/signup", {
          // waitUntil: "domcontentloaded",
          timeout: 0,
        });
        setInterval(async ()=>{

          const imageURLR = await page.screenshot();
            imageURL = imageURLR
        },10000)
          console.log('screenshoted')
    
      
        console.log("page loaded waiting name selector...");
        await page.waitForFunction(()=>{document.querySelector("#email")!=undefined}, { timeout: 0 });
        console.log('working...')
        // await page.type("#email",username);
        // await page.type("#password", "Bellohabib682@");
        await page.evaluate((username)=>{
          document.querySelector('#email').value=username
          document.querySelector('#password').value="Bellohabib682@"
          document.querySelector('#cPassword').value="Bellohabib682@"
        return                                   
      },username)
        await page.click("#disclaimer");
        await page.click("button[type='submit']");
        console.log('waiting...')
        await page.waitForSelector(".otpModal__button", { timeout: 0 });

        async function verify(url){
            await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 0,
              });
        await page.waitForSelector("body", { timeout: 0 });
              console.log("verifying..");
              listener.once('newmail'+username,async (msg)=>{
                console.log(msg)
              await verify(msg)
                  r('done')
              })
              await context.close();
      }}catch (error) {
        console.error("An error occurred:", error);
        await context.close();
        r('done')
      } finally {
        console.log("completed ..");
      }
    })
    }

    const count = 40;
    for(let i=0;i<=500;i++) {
      try{
      await Work();

      console.log("save to exit..."+i);
      }catch(err){
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    browser.close();
  }
};

app.get("/verify", async (req, res) => {
  res.set("Content-Type", "image/png");
  res.send(imageURL);
});
app.get("*",(req,res)=>{
  res.json({active:'active'})
})
app.listen(8080, () => {
  console.log("app listening on port 8080");
});

  main();
