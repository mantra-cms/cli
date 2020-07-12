#!/usr/bin/env -S deno run -A --unstable


// Main imports and Declarations

 
import { styles } from "https://deno.land/x/ansi_styles/mod.ts";
import { text } from 'https://raw.githack.com/denyncrawford/deno-figlet/master/mod.js';

const args = Deno.args
const dir = Deno.cwd();

import { Command } from 'https://deno.land/x/cliffy/command.ts';  

// ClI Modules import

import { create } from './lib/deps/deps.js';

// CLI Command Executor:

console.log(`${styles.green.open}${await text("Mantra CLI","standard")}${styles.green.close}`);

await new Command()
  .name("mantra")
  .version('0.1.0')
  .allowEmpty(false)
  .command('create [name]')
  .description("Creates a new mantra project.")
  .action(async (opt , name) => {
    let setup = await create.prompt(dir, name)
    create.init(dir, setup)    
  })
  .parse(args);
