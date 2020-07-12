
export default {
  filename: "./mantra.config.js",
  content(obj) {
  let model = 
  `
export default ${obj}

  `
    return model;
  }
}