const fs = require("fs")
const path = require("path")
const utf8 = require("utf8")
const { exec, spawn } = require("child_process")

const start = require("./index")
fs.readdir(path.join(__dirname, "docs"), (err, data) => {
  if (err) return console.log(err)

  let jsonFiles = data.filter((d) => d.includes(".json"))
  run(jsonFiles)
})

function run(files) {
  if (files.length == 0) return "fim"

  const file = files.pop()
  fs.readFile(path.join(__dirname, "docs", file), async (err, data) => {
    if (err) return console.log(err)
    const content = JSON.parse(data)

    console.log("RODANDO NO ARQUIVO:", file)
    start(content.tags[0], formatText(content.text), content.photos)
      .then((res) => {
        console.log("fim aquivo")
        run(files)
      })
      .catch((err) => {
        console.log({ err })
      })
  })
}

function formatText(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/undefined/g, "")
    .replace(/.undefined/g, ".")
    .replace(/&oacute;/g, "ó")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&Eacute;/g, "É")
    .replace(/&uacute;/g, "ú")
    .replace(/&atilde;/g, "ã")
    .replace(/&ecirc;/g, "ê")
    .replace(/&ecirc;/g, "ê")
    .replace(/&ccedil;/g, "ç")
    .replace(/&otilde;;/g, "õ")
    .replace(/&nbsp;/g, "  ")
}
