const puppeteer = require("puppeteer")
const { exec, spawn } = require("child_process")
const { promises } = require("fs")

function start(TITLE, TEXT, IMAGES) {
  return new Promise(async (resolve, reject) => {
    const url =
      "https://www.notion.so/3de2aa6acd5d4f1e8ffd7a7f164ab3c8?v=3594a89ef65f478a85ea5c18b61df44e"

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    const cookies = [COOKIESHERE]
    await page.setCookie(...cookies)
    await page.cookies(url)
    await page.goto(url)

    await nextStep(() => {
      console.log('Clicando no botão "Novo"')
      page.click("div.notion-collection-view-item-add")
    })

    await nextStep(() => {
      console.log("Abrindo em uma nova página")
      const url = page.url()
      const newPageUrl = url.split("&p=")[1]
      page.goto(`https://www.notion.so/${newPageUrl}`)
      return true
    })

    await nextStep(() => {
      console.log("Preenche o campo de título")
      page.type("div[contenteditable='true'][placeholder='Untitled']", TITLE)
    })

    await nextStep(async () => {
      console.log("Preenche o campo de conteúdo")
      await page.keyboard.press(String.fromCharCode(13))
      await page.keyboard.type(TEXT)
      await page.keyboard.press(String.fromCharCode(13))
      console.log("Texto preenchido")
    })

    if (IMAGES) {
      await nextStep(() => {
        page.keyboard.press(String.fromCharCode(13))

        IMAGES.forEach((image) => {
          console.log("Adicionando imagens")
          setTimeout(async () => {
            console.log(`${__dirname}/docs/${image}`)
            exec(
              `copyq write image/jpg - < ${__dirname}/docs/${image} && copyq select 0`
            )

            await page.keyboard.down("Control")
            await page.keyboard.press("V")
            await page.keyboard.up("Control")
          })
        }, 3000)
      }, 5000)
    }

    await nextStep(() => {
      console.log("Fechando browser")
      browser.close()
      resolve(true)
    }, 10000)
  })
}

const nextStep = async (callback, time = 5000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(callback())
    }, time)
  })
}

module.exports = start
