
// Tools

import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { resolve } from 'https://deno.land/std/path/mod.ts';
import { Input, Select } from 'https://deno.land/x/cliffy/prompt.ts';
import promiserAllObjImport from 'https://dev.jspm.io/promise-all-properties';
let enconder = new TextEncoder();
import Spinner from 'https://raw.githubusercontent.com/ameerthehacker/cli-spinners/master/mod.ts';

const promiseAllObj = promiserAllObjImport.default

// Models

import confg_js from '../writers/config.js';

// Main Prompt

const prompt = async (workingPath, name) => {

  let setup = {
    name: name || await Input.prompt({
      message: `Project name:`,
      default: name || workingPath.split("/").slice(-1)[0],
    }),
    public: await Input.prompt({
      message: "Public path:",
      default: "./public"
    }),
    mantra: await Input.prompt({
      message: "Mantra content:",
      default: "./.mantra"
    }),
    preset: await Select.prompt({
      message: 'Select a preset',
      options: [
        { name: 'Blog', value: "blog" },
        { name: 'E-comerce', value: "ecomerce" },
        { name: 'Default', value: "blank" }
      ],
      default: "blank"
    }),
    framework: await Select.prompt({
      message: 'Select a front-end framework',
      options: [
        { name: 'Vue', value: 'vue' },
        { name: 'React', value: 'react' },
        { name: 'Puffin', value: 'puffin' },
        { name: "Vanilla", value: "none" }
      ],
      default: 'vue',
    })
  }
   return promiseAllObj(setup);
}

const init = async (workingPath, setup) => {  
  let spinner = Spinner.getInstance()
  await spinner.start("Reading setup...")
  let pathToPublic = resolve(workingPath, setup.public)
  let pathToMantra = resolve(workingPath, setup.mantra)
  let pathToConfig = resolve(workingPath, confg_js.filename)

  await spinner.setText("Buiding project config...")
  
  const configObject = {
    name: setup.name,
    paths: {
      public: setup.public,
      mantra: setup.mantra
    },
    plugins: setup.plugins || []
  }
  
  let config = enconder.encode(confg_js.content(JSON.stringify(configObject, null, 2)))
  await spinner.setText("Creating directories...")
  await ensureDir(pathToMantra)
  await ensureDir(pathToPublic)
  await spinner.setText("Creating files...")
  await Deno.writeFile(pathToConfig, config)
  await Deno.writeFile(resolve(pathToPublic, "./README.md"), enconder.encode("\n ## This is the folder where you must put your public files"))
  await spinner.succeed("Project created!")
}

export {
  init,
  prompt
}