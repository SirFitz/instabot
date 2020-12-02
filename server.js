const fs = require('fs');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const USERNAME = process.env['USERNAME'];
const PASSWORD = process.env['PASSWORD'];
const PORT = 3006;

let browser, page;

async function writeCookies(page, cookiesPath) {
  const client = await page.target().createCDPSession();
  // This gets all cookies from all URLs, not just the current URL
  const cookies = (await client.send("Network.getAllCookies"))["cookies"];

  console.log("Saving", cookies.length, "cookies");
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
  // await fs.writeJSON(cookiesPath, cookies);
}
async function restoreCookies(page, cookiesPath) {
  try {
    // const cookies = await fs.readJSON(cookiesPath);
    let buf = fs.readFileSync(cookiesPath);
    let cookies = JSON.parse(buf);
    console.log("Loading", cookies.length, "cookies into browser");
    await page.setCookie(...cookies);
  } catch (err) {
    console.log("restore cookie error", err);
  }
}

const setup = async () => {
    let launchOptions = { headless: true, userDataDir: "./puppeteer_data",  args: ['--no-sandbox','--start-maximized', '--disable-dev-shm-usage']};
    browser = await puppeteer.launch(launchOptions);
    console.log('Browser Started')
    browser.on('disconnected', setup);
};

setup();
/*
app.get('/start-browser', async function (req, res) {
    let browsing = await setup();
    res.end('Browser started');
});
*/
const login = async(page) => {
        console.log('Logging In:', page.url());
        await page.goto('https://www.instagram.com/accounts/login/');
        await page.waitFor('input[name="username"]');
        await page.focus('input[name="username"]');
        await page.keyboard.type(`${USERNAME}`);
        await page.focus('input[name="password"]');
        await page.keyboard.type(`${PASSWORD}`);
        await page.click('button[type="submit"]');
        await new Promise(r => setTimeout(r, 2500));
}

app.get('/fetch', async function (req, res) {
    let handle = req.query.handle;

    page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    restoreCookies(page, './cookies.json');

    console.log('CRAWLING PROFILE', handle);
    await page.goto(`https://instagram.com/${handle}/?__a=1`);

    if (page.url() != `https://www.instagram.com/${handle}/?__a=1`) {
        login(page);
    }

    if (page.url() != `https://www.instagram.com/${handle}/?__a=1`) {
        console.log('NAVIGATIN TO HANDLE PAGE')
      await page.goto(`https://www.instagram.com/${handle}/?__a=1`);
    }

    writeCookies(page, './cookies.json');

    console.log('PAGE', page.url());

    let data = await page.evaluate(() =>  {
          return JSON.parse(document.querySelector("body").innerText);
    });

    res.json(data); // You could also return results here
});

app.get('/follow', async function (req, res) {
     let handle = req.query.handle;

     page = await browser.newPage();
     await page.setViewport({width: 1366, height: 768});
     await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    console.log('FOLLOWING PROFILE', handle);
    restoreCookies(page, './cookies.json');
     await page.goto(`https://instagram.com/${handle}/`);

     if (page.url() != `https://www.instagram.com/${handle}/`) {
         login(page);
     }

     if (page.url() != `https://www.instagram.com/${handle}/`) {
        await page.goto(`https://www.instagram.com/${handle}/`);
     }

     await page.click('span > button');
     await new Promise(r => setTimeout(r, 500));

     res.json({state: 'ok', followed: true}); // You could also return results here
});


app.listen(PORT);

