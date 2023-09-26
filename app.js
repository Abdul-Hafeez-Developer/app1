const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const userDataDir = path.join('chrome-profile');
    const launchOptions = {
      headless: "new",
      args: [
        '--start-maximized',
        `--user-data-dir=${userDataDir}`,
      ],
    };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto('https://codehafeez.com/');
    const links = await page.evaluate(() => {
      const linkElements = Array.from(document.querySelectorAll('a'));
      return linkElements.map(link => link.href);
    });

    await browser.close();

    res.json({ links });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
